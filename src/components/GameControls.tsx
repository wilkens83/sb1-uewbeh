import React from 'react';
import { Share2, ExternalLink } from 'lucide-react';

interface GameControlsProps {
  playerColor: 'white' | 'black' | null;
  gameId: string;
}

export function GameControls({ playerColor, gameId }: GameControlsProps) {
  const handleShare = () => {
    const url = `${window.location.origin}/play/${gameId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="mt-4 flex items-center justify-between bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Share2 className="h-4 w-4" />
          <span>Share Game</span>
        </button>

        <a
          href={`https://lichess.org/${gameId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Open in Lichess</span>
        </a>
      </div>

      <div className="text-sm text-gray-500">
        {playerColor ? `Playing as ${playerColor}` : 'Spectating'}
      </div>
    </div>
  );
}