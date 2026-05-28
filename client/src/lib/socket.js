import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
let socket = null;

console.log(window.location.origin);

/**
 * Connect to the Socket.io server and register the current user.
 */
export const getSocket = (userId) => {
  if (!socket) {
    console.log(`[Socket] Initializing connection to ${socketUrl}`);
    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'], // Fallback options
    });

    // Register event listeners exactly once during initialization
    socket.on('connect', () => {
      console.log(`[Socket] Connected as socket ID ${socket.id}`);
      if (socket.userId) {
        socket.emit('register', socket.userId);
      }
    });

    // Reconnect hook to ensure we register again if the server restarts
    socket.on('reconnect', () => {
      console.log(`[Socket] Reconnected, re-registering user ${socket.userId}`);
      if (socket.userId) {
        socket.emit('register', socket.userId);
      }
    });
  }

  // Update stored userId
  socket.userId = userId;

  if (!socket.connected) {
    socket.connect();
  } else {
    // If already connected, immediately register
    socket.emit('register', userId);
  }

  return socket;
};

/**
 * Safely disconnect the active Socket.io connection.
 */
export const disconnectSocket = () => {
  if (socket) {
    console.log('[Socket] Disconnecting WebSocket...');
    socket.disconnect();
    socket = null;
  }
};
