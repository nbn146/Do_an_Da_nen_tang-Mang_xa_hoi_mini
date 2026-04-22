let ioInstance;

const onlineUsers = new Map();

export function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("register-user", (userId) => {
      onlineUsers.set(String(userId), socket.id);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
}

export function emitNotification(userId, payload) {
  if (!ioInstance) return;
  const socketId = onlineUsers.get(String(userId));
  if (socketId) {
    ioInstance.to(socketId).emit("notification:new", payload);
  }
}
