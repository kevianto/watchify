import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://watchify-backend-1.onrender.com'; // Change to your deployed backend in production

interface MessagePayload {
  sender: string;
  text: string;
  isAnonymous?: boolean;
}

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: { token },
      });

      // ✅ Useful debug logs
      this.socket.on('connect', () => {
        console.log('✅ Connected to socket.io:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('⚠️ Disconnected from socket.io:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket disconnected manually.');
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
      console.log(`🚪 Joined room: ${roomId}`);
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
      console.log(`🚪 Left room: ${roomId}`);
    }
  }

  sendMessage(roomId: string, message: MessagePayload): void {
    if (this.socket) {
      this.socket.emit('send-message', { roomId, ...message });
      console.log(`📤 Sent message to room ${roomId}:`, message);
    }
  }

  syncVideo(roomId: string, action: string, currentTime?: number): void {
    if (this.socket) {
      this.socket.emit('video-control', { roomId, action, currentTime });
      console.log(`🎬 Sent video action "${action}" to room ${roomId}`);
    }
  }
}

export const socketService = new SocketService();
