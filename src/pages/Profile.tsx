import React, { useState } from 'react';
import { Phone, Mail, Trophy, Coins, Sword, Clock, Edit2, Shield, User } from 'lucide-react';
import { useAuthStore } from '../store';

export function Profile() {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  
  const mockUser = {
    ...user,
    email: 'player@echecs.com',
    phone: '+1 (555) 123-4567',
    memberSince: '2024-03-15',
    lastActive: '2024-03-20',
    achievements: [
      { id: 1, title: 'First Victory', description: 'Won your first game', date: '2024-03-16' },
      { id: 2, title: 'Tournament Champion', description: 'Won a tournament', date: '2024-03-18' },
    ],
    recentGames: [
      { id: 1, opponent: 'GrandMaster_Bot', result: 'win', date: '2024-03-20', rating: '+15' },
      { id: 2, opponent: 'ChessWizard', result: 'loss', date: '2024-03-19', rating: '-12' },
      { id: 3, opponent: 'QueenMaster', result: 'draw', date: '2024-03-18', rating: '0' },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-600 rounded-full p-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{mockUser.username}</h1>
                  <p className="text-gray-500">Member since {mockUser.memberSince}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{mockUser.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{mockUser.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Last active: {mockUser.lastActive}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-600">Rating: {mockUser.rating}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sword className="h-5 w-5 text-indigo-500" />
                  <span className="text-gray-600">
                    Record: {mockUser.wins}W/{mockUser.losses}L/{mockUser.draws}D
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-600">{mockUser.tokens} tokens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Games</h2>
            <div className="space-y-4">
              {mockUser.recentGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      game.result === 'win' ? 'bg-green-500' : 
                      game.result === 'loss' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="font-medium">{game.opponent}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${
                      game.rating.startsWith('+') ? 'text-green-600' :
                      game.rating.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>{game.rating}</span>
                    <span className="text-sm text-gray-500">{game.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="space-y-4">
              {mockUser.achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium text-indigo-900">{achievement.title}</h3>
                  </div>
                  <p className="text-sm text-indigo-700">{achievement.description}</p>
                  <p className="text-xs text-indigo-500 mt-2">{achievement.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Token History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Token History</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tournament Win</span>
                <span className="text-green-600">+50 tokens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Bonus</span>
                <span className="text-green-600">+10 tokens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Game Entry</span>
                <span className="text-red-600">-5 tokens</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}