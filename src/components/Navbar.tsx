import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, Trophy, Users, Coins } from 'lucide-react';
import { useAuthStore } from '../store';

export function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sword className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Echecs</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/play" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Play
            </Link>
            <Link to="/tournaments" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              <Trophy className="h-4 w-4 mr-1" />
              Tournaments
            </Link>
            <Link to="/community" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              <Users className="h-4 w-4 mr-1" />
              Community
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{user.tokens}</span>
                </div>
                <Link to="/profile" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}