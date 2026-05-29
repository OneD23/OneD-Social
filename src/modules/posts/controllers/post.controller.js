import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as postService from '../services/post.service.js';

export const createPost = asyncHandler(async (req, res) => res.status(201).json(await postService.createPost(req.user._id, req.body)));
export const listFeed = asyncHandler(async (req, res) => res.json(await postService.listPosts(req.query, { group: null })));
export const byUser = asyncHandler(async (req, res) => res.json(await postService.getPostsByUser(req.params.userId, req.query)));
export const updatePost = asyncHandler(async (req, res) => res.json(await postService.updatePost(req.params.postId, req.user._id, req.body)));
export const deletePost = asyncHandler(async (req, res) => { await postService.deletePost(req.params.postId, req.user._id); res.status(204).send(); });
export const toggleLike = asyncHandler(async (req, res) => res.json(await postService.toggleLike(req.params.postId, req.user._id)));
export const addComment = asyncHandler(async (req, res) => res.status(201).json(await postService.addComment(req.params.postId, req.user._id, req.body.text)));
