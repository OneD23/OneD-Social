import { ApiError } from '../../../utils/ApiError.js';
import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { Business } from '../../businesses/models/business.model.js';
import { Group } from '../../groups/models/group.model.js';
import { Notification } from '../../notifications/models/notification.model.js';
import { emitToUser } from '../../../realtime/socket.js';
import { Share } from '../models/share.model.js';
import { Post } from '../models/post.model.js';

const populatePost = (query) => query.populate('author', 'name username avatarUrl').populate('business', 'name logoUrl category').populate('group', 'name scope location topic').populate('comments.author', 'name username avatarUrl');

export const createPost = async (authorId, payload) => {
  if (payload.business) {
    const business = await Business.findOne({ _id: payload.business, owner: authorId });
    if (!business) throw new ApiError(403, 'Only the business owner can post as this business');
  }
  if (payload.group) {
    const group = await Group.findOne({ _id: payload.group, members: authorId });
    if (!group) throw new ApiError(403, 'Join the group before posting');
  }
  const type = payload.type || (payload.group ? 'group' : payload.business ? 'business' : 'user');
  const post = await Post.create({ ...payload, author: authorId, type });

  if (payload.group) {
    const group = await Group.findById(payload.group).select('members');
    const recipients = group.members.filter((memberId) => memberId.toString() !== authorId.toString());
    await Notification.insertMany(recipients.map((recipient) => ({ recipient, actor: authorId, type: 'group_post', post: post._id, group: payload.group })), { ordered: false });
  }

  return populatePost(Post.findById(post._id));
};

export const listPosts = async (query = {}, filters = {}) => {
  const { page, limit, skip } = getPagination(query);
  const sort = query.sort === 'relevance' ? { score: -1, createdAt: -1 } : { createdAt: -1 };
  const [items, total] = await Promise.all([
    populatePost(Post.find(filters).sort(sort).skip(skip).limit(limit)),
    Post.countDocuments(filters),
  ]);
  return paginatedResponse(items, total, page, limit);
};

export const getPostsByUser = (userId, query) => listPosts(query, { author: userId, group: null });

export const updatePost = async (postId, userId, payload) => {
  const post = await Post.findOneAndUpdate({ _id: postId, author: userId }, payload, { new: true, runValidators: true });
  if (!post) throw new ApiError(404, 'Post not found');
  return populatePost(Post.findById(post._id));
};

export const deletePost = async (postId, userId) => {
  const post = await Post.findOneAndUpdate({ _id: postId, author: userId, deletedAt: null }, { deletedAt: new Date() });
  if (!post) throw new ApiError(404, 'Post not found');
};

export const toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');
  const liked = post.likes.some((id) => id.toString() === userId.toString());
  const update = liked ? { $pull: { likes: userId }, $inc: { score: -1 } } : { $addToSet: { likes: userId }, $inc: { score: 1 } };
  const updated = await Post.findByIdAndUpdate(postId, update, { new: true });
  if (!liked && post.author.toString() !== userId.toString()) {
    await Notification.create({ recipient: post.author, actor: userId, type: 'like', post: post._id });
    emitToUser(post.author, 'notification:like', { post: post._id, actor: userId });
  }
  return { liked: !liked, likesCount: updated.likes.length };
};

export const addComment = async (postId, userId, text) => {
  const post = await Post.findByIdAndUpdate(postId, { $push: { comments: { author: userId, text } }, $inc: { score: 2 } }, { new: true });
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.author.toString() !== userId.toString()) {
    await Notification.create({ recipient: post.author, actor: userId, type: 'comment', post: post._id });
    emitToUser(post.author, 'notification:comment', { post: post._id, actor: userId });
  }
  return populatePost(Post.findById(post._id));
};

export const sharePost = async (postId, userId, payload) => {
  const post = await Post.findOne({ _id: postId, deletedAt: null });
  if (!post) throw new ApiError(404, 'Post not found');
  const share = await Share.create({ post: postId, user: userId, comment: payload.comment, group: payload.group });
  await Post.findByIdAndUpdate(postId, { $inc: { sharesCount: 1, score: 5 } });
  if (post.author.toString() !== userId.toString()) {
    await Notification.create({ recipient: post.author, actor: userId, type: 'share', post: post._id });
    emitToUser(post.author, 'notification:share', { post: post._id, actor: userId });
  }
  return share.populate([{ path: 'post' }, { path: 'user', select: 'name username avatarUrl verified' }, { path: 'group', select: 'name' }]);
};
