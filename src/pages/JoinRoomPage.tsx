import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { roomService } from '../services/api';
import { Users, Hash, AlertCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const JoinRoomPage: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setLoading(true);

    try {
      await roomService.joinRoom(roomId.trim());
      navigate(`/room/${roomId.trim()}`);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Room not found. Please check the room ID.');
      } else {
        setError(err.response?.data?.message || 'Failed to join room');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            to="/home" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Join Room</h1>
            <p className="text-gray-300">Enter a room code to join an existing watch party</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 text-red-300 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="roomId"
                  type="text"
                  required
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-wider"
                  placeholder="Enter room ID"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400 text-center">
                Room IDs are case-insensitive and usually 6-8 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !roomId.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Joining Room...' : 'Join Room'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <h3 className="text-sm font-medium text-indigo-300 mb-2">🎬 What happens next:</h3>
            <ul className="text-xs text-indigo-200 space-y-1">
              <li>• You'll be connected to the room's video stream</li>
              <li>• Playback will sync automatically with other viewers</li>
              <li>• You can chat with other participants</li>
              <li>• Only the room creator can control the video</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have a room ID?{' '}
              <Link to="/create-room" className="text-purple-400 hover:text-purple-300 font-medium">
                Create a new room
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomPage;