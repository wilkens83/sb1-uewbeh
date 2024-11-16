import React from 'react';
import type { User } from '../types';
import { Circle } from 'lucide-react';
import clsx from 'clsx';

interface PlayerInfoProps {
  player: User;
  isActive: boolean;
  color: 'white' | 'black';
}

export function PlayerInfo({ player, isActive, color }: PlayerInfoProps) {
  return (
    <div className={clsx(
      'flex items-center justify-between p-3 rounded-lg',
      isActive ? 'bg-indigo-50' : 'bg-gray-50'
    )}>
      <div className="flex items-center space-x-3">
        <Circle 
          className={clsx(
            'h-4 w-4',
            color === 'white' ? 'text-gray-100 stroke-gray-400' : 'text-gray-900'
          )}
          fill={color === 'black' ? 'currentColor' : 'none'}
        />
        <div>
          <p className="font-medium">{player.username}</p>
          <p className="text-sm text-gray-500">Rating: {player.rating}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">
          {player.wins}W/{player.losses}L/{player.draws}D
        </p>
      </div>
    </div>
  );
}