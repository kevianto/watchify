import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { socketService } from '../services/socket';
import { roomService } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import Navbar from '../components/Navbar';
import { Copy, Check, AlertCircle, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isAnonymous?: boolean;
}

interface RoomUser {
  id: string;
  username: string;
  isAnonymous: boolean;
  isHost?: boolean;
}

interface RoomData {
  id: string;
  title?: string;
  videoUrl: string;
  hostId: string;
  users: RoomUser[];
}

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!roomId || !user || !token) return;

    const socket = socketService.connect(token);
    socketService.joinRoom(roomId);

    const loadRoom = async () => {
      try {
        const response = await roomService.getRoomUsers(roomId);
        setRoomData(response.data);
        setUsers(response.data.users);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load room');
        setLoading(false);
        return;
      }
    };

    loadRoom();

    // Socket listeners
    socket.on('receive-message', (messageData) => {
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: messageData.sender,
          message: messageData.text,
          timestamp: new Date(),
          isAnonymous: messageData.isAnonymous,
        },
      ]);
    });

    socket.on('play', () => {
      (window as any).syncVideoControl?.('play');
    });

    socket.on('pause', () => {
      (window as any).syncVideoControl?.('pause');
    });

    socket.on('seek', ({ time }) => {
      (window as any).syncVideoControl?.('seek', time);
    });

    socket.on('user-joined', (userData) => {
      setUsers((prev) => [...prev, userData]);
    });

    socket.on('user-left', (userId) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    socket.on('room-error', (errorData) => {
      setError(errorData.message);
    });

    return () => {
      socketService.leaveRoom(roomId);
      socketService.disconnect();
      socket.off('receive-message');
      socket.off('play');
      socket.off('pause');
      socket.off('seek');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('room-error');
    };
  }, [roomId, user, token, navigate]);

  const handleSendMessage = (text: string) => {
    if (!roomId) return;

    socketService.sendMessage(roomId, {
      sender: user.username,
      text,
      isAnonymous: user.isAnonymous,
    });

    // ✅ No need to manually setMessages here — handled via 'receive-message' event
  };

  const handleVideoControl = (action: string, currentTime?: number) => {
    if (!roomId || !roomData || roomData.hostId !== user?.id) return;
    socketService.syncVideo(roomId, action, currentTime);
  };

  const copyRoomId = async () => {
    if (!roomId) return;
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Room Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-white">Room not found</div>
        </div>
      </div>
    );
  }

  const isHost = roomData.hostId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Room Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {roomData.title || 'Watch Party'}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-300">Room ID:</span>
                <code className="bg-white/10 text-purple-300 px-2 py-1 rounded text-sm font-mono">
                  {roomId}
                </code>
                <button
                  onClick={copyRoomId}
                  className="text-gray-300 hover:text-white transition-colors"
                  title="Copy room ID"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isHost && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                  👑 Host
                </div>
              )}
              <a
                href={roomData.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-300 hover:text-blue-200 transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Video Source</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <VideoPlayer
              videoUrl={roomData.videoUrl}
              isHost={isHost}
              onVideoControl={handleVideoControl}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UserList users={users} currentUserId={user?.id || ''} />
            <Chat messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
