import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Video, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Watchify</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create or join a room to watch videos together with friends in perfect synchronization
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/create-room"
            className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-6 group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Create Room</h2>
            <p className="text-gray-300 mb-6">
              Start a new watch party by creating a room with your favorite video. Share the room code with friends to watch together.
            </p>
            <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="font-semibold">Get Started</span>
              <Sparkles className="ml-2 h-4 w-4" />
            </div>
          </Link>

          <Link
            to="/join-room"
            className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-6 group-hover:from-blue-400 group-hover:to-indigo-400 transition-all">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Join Room</h2>
            <p className="text-gray-300 mb-6">
              Join an existing watch party using a room code. Connect with friends and enjoy synchronized viewing experiences.
            </p>
            <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="font-semibold">Join Now</span>
              <Video className="ml-2 h-4 w-4" />
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">How it Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <p className="text-gray-300 text-sm">Create or join a room</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <p className="text-gray-300 text-sm">Share the room code</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-400 font-bold">3</span>
                </div>
                <p className="text-gray-300 text-sm">Watch together in sync</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;