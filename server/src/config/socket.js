import { Server } from 'socket.io';

let ioInstance = null;
const userSockets = new Map(); // userId -> Set of socketId (handles multiple tabs per user)

/**
 * Initialize Socket.io on the HTTP server.
 */
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins for dynamic server configurations
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: [
        'Authorization',
        'Content-Type',
        'Accept',
        'X-Requested-With',
        'Origin',
      ],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Map a socket to a specific logged-in user
    socket.on('register', (userId) => {
      if (userId) {
        const uId = String(userId);
        if (!userSockets.has(uId)) {
          userSockets.set(uId, new Set());
        }
        userSockets.get(uId).add(socket.id);
        console.log(`[Socket] Registered socket ${socket.id} to user ${uId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);

      // Cleanup disconnected socket from tracking map
      for (const [userId, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(userId);
          }
          console.log(
            `[Socket] Unregistered socket ${socket.id} from user ${userId}`
          );
          break;
        }
      }
    });
  });

  ioInstance = io;
  return io;
};

/**
 * Fetch the active Socket.io instance.
 */
export const getIo = () => ioInstance;

/**
 * Emit a real-time event directly to all active sockets of a specific user.
 */
export const sendToUser = (userId, event, data) => {
  const uId = String(userId);
  if (ioInstance && userSockets.has(uId)) {
    const sockets = userSockets.get(uId);
    console.log(
      `[Socket] Emitting real-time ${event} to user ${uId} across ${sockets.size} active tab(s)`
    );
    for (const socketId of sockets) {
      ioInstance.to(socketId).emit(event, data);
    }
  } else {
    console.log(`[Socket] User ${uId} is offline. Skipping real-time emit.`);
  }
};
