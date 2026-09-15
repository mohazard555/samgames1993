import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import { Game } from '../types';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (game: Game) => void;
  onClearNotifications: () => void;
  newGames: Game[];
  hasUnread: boolean;
}

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  isOpen,
  onClose,
  onSelectGame,
  onClearNotifications,
  newGames,
  hasUnread,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGameClick = (game: Game) => {
    onSelectGame(game);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-amber-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-5 text-white flex justify-between items-center shadow">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black drop-shadow-sm">ما الجديد في التطبيق؟</h2>
              <p className="text-xs sm:text-sm font-bold opacity-90">أحدث الألعاب والتحديثات المضافة حديثاً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center font-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-bold text-gray-500">الألعاب الجديدة المضافة ({newGames.length}):</span>
            {hasUnread && (
              <button
                onClick={onClearNotifications}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1 rounded-xl transition-colors flex items-center gap-1 active:scale-95"
              >
                <span>🗑️</span>
                <span>مسح الإشعارات</span>
              </button>
            )}
          </div>

          {newGames.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game)}
              className="bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 p-3 sm:p-4 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-white text-xl font-black shadow`}>
                  🎮
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-800 text-sm sm:text-base group-hover:text-amber-700 transition-colors">
                      {game.name}
                    </span>
                    <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                      جديد ✨
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">تصنيف: {game.category}</p>
                </div>
              </div>
              <button
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl group-hover:scale-105 transition-transform shadow-sm"
              >
                العب الآن
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-2">
          <button
            onClick={onClearNotifications}
            className="text-xs text-gray-600 hover:text-gray-800 font-bold underline"
          >
            تحديد الكل كمقروء ومسح التنبيه
          </button>
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsNewModal;
