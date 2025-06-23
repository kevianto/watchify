import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://watchify-backend-1.onrender.com';

interface MessagePayload {
  sender: string;
  text: string;
  isAnonymous?: boolean;
}

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
    }
  }

  // ✅ Updated to accept full message object
  sendMessage(roomId: string, message: MessagePayload) {
    if (this.socket) {
      this.socket.emit('send-message', { roomId, ...message });
    }
  }

  syncVideo(roomId: string, action: string, currentTime?: number) {
    if (this.socket) {
      this.socket.emit('video-control', { roomId, action, currentTime });
    }
  }
}

export const socketService = new SocketService();
