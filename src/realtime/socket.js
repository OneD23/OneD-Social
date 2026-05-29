let ioInstance = null;

export const setSocketServer = (io) => { ioInstance = io; };
export const getSocketServer = () => ioInstance;
export const emitToUser = (userId, event, payload) => {
  if (ioInstance && userId) ioInstance.to(`user:${userId}`).emit(event, payload);
};
export const emitToConversation = (conversationId, event, payload) => {
  if (ioInstance && conversationId) ioInstance.to(`conversation:${conversationId}`).emit(event, payload);
};
