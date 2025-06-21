import React from 'react';
import { Users, Crown, User } from 'lucide-react';

interface User {
  id: string;
  username: string;
  isAnonymous: boolean;
  isHost?: boolean;
}

interface UserListProps {
  users: User[];
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-blue-400" />
        <h3 className="text-white font-semibold">Viewers</h3>
        <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
          {users.length}
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              user.id === currentUserId 
                ? 'bg-purple-500/20 border border-purple-500/30' 
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-medium truncate">
                  {user.username}
                </span>
                {user.id === currentUserId && (
                  <span className="text-xs text-purple-300">(You)</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {user.isHost && (
                  <div className="flex items-center space-x-1 text-xs text-yellow-300">
                    <Crown className="h-3 w-3" />
                    <span>Host</span>
                  </div>
                )}
                {user.isAnonymous && (
                  <div className="flex items-center space-x-1 text-xs text-blue-300">
                    <User className="h-3 w-3" />
                    <span>Guest</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No other viewers yet</p>
        </div>
      )}
    </div>
  );
};

export default UserList;