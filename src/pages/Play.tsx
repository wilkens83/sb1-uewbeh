import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Timer, Trophy, AlertCircle, Users } from 'lucide-react';
import { useAuthStore } from '../store';
import { useGameStore } from '../store/gameStore';
import { PlayerInfo } from '../components/PlayerInfo';
import { GameControls } from '../components/GameControls';
import { nanoid } from 'nanoid';

export function Play() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const user = useAuthStore((state) => state.user);
  const boardRef = useRef<HTMLIFrameElement>(null);
  const {
    playerColor,
    whitePlayer,
    blackPlayer,
    currentTurn,
    setGameId,
    setPlayers,
    setPlayerColor,
    resetGame
  } = useGameStore();

  useEffect(() => {
    if (gameId) {
      setGameId(gameId);
      // In a real app, we would fetch game state from the server here
    } else {
      resetGame();
    }
  }, [gameId]);

  const createNewGame = useCallback(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const newGameId = nanoid();
    setGameId(newGameId);
    setPlayers(user, null);
    setPlayerColor('white');
    navigate(`/play/${newGameId}`);
  }, [user, navigate]);

  const joinGame = useCallback(() => {
    if (!user || !gameId || blackPlayer) return;
    setPlayers(whitePlayer, user);
    setPlayerColor('black');
  }, [user, gameId, blackPlayer, whitePlayer]);

  if (!gameId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Choose Game Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              onClick={createNewGame}
              className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create New Game</h3>
              <p className="text-gray-600">Start a new game and invite a friend</p>
            </button>
            
            <button
              onClick={() => navigate('/play/join')}
              className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Trophy className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Join Game</h3>
              <p className="text-gray-600">Join an existing game</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="aspect-square w-full">
              <iframe
                ref={boardRef}
                src={`https://lichess.org/embed/game/${gameId}?theme=brown&bg=dark`}
                className="w-full h-full rounded-lg"
                allowTransparency={true}
                frameBorder={0}
              />
            </div>
          </div>
          
          <GameControls
            playerColor={playerColor}
            gameId={gameId}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-indigo-600" />
                <span className="text-lg font-medium">10:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-medium">10 tokens</span>
              </div>
            </div>

            <div className="space-y-4">
              {whitePlayer ? (
                <PlayerInfo
                  player={whitePlayer}
                  isActive={currentTurn === 'w'}
                  color="white"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">Waiting for White player...</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 my-4" />
              
              {blackPlayer ? (
                <PlayerInfo
                  player={blackPlayer}
                  isActive={currentTurn === 'b'}
                  color="black"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  {user && !playerColor ? (
                    <button
                      onClick={joinGame}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Join as Black
                    </button>
                  ) : (
                    <p className="text-gray-600">Waiting for Black player...</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {gameId && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-2">Game ID</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={gameId}
                  className="flex-1 p-2 bg-gray-50 rounded-md"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(gameId)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Share this ID with your opponent to join the game
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`https://lichess.org/analysis`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 text-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                Open Analysis Board
              </a>
              <a
                href="https://lichess.org/practice"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 text-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                Practice Puzzles
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}