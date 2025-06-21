import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
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

  sendMessage(roomId: string, message: string) {
    if (this.socket) {
      this.socket.emit('send-message', { roomId, message });
    }
  }

  syncVideo(roomId: string, action: string, currentTime?: number) {
    if (this.socket) {
      this.socket.emit('video-control', { roomId, action, currentTime });
    }
  }
}

export const socketService = new SocketService();