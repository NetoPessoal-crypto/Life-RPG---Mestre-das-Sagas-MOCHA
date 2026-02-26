import { useGame } from '@/react-app/context/GameContext';
import { Heart, Zap, Shield } from 'lucide-react';

export default function StatusBars() {
  const { state } = useGame();
  
  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpForCurrentLevel = state.totalXP % 100;
  const xpPercent = xpForCurrentLevel;

  return (
    <div className="bg-card border-b-2 border-primary/30 px-4 py-3">
      <div className="max-w-[450px] mx-auto">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/30 to-accent border-2 border-primary/50 flex items-center justify-center glow-gold">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] font-pixel px-1.5 py-0.5 rounded">
              LV{state.level}
            </div>
          </div>

          {/* Bars Container */}
          <div className="flex-1 space-y-2">
            {/* Player Name */}
            <div className="text-sm font-pixel text-foreground truncate">
              {state.playerName}
            </div>

            {/* HP Bar */}
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden border border-red-900/50">
                <div 
                  className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500 relative"
                  style={{ width: `${hpPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
              </div>
              <span className="text-[10px] font-pixel text-red-400 w-12 text-right">
                {state.hp}/{state.maxHP}
              </span>
            </div>

            {/* XP Bar */}
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden border border-yellow-900/50">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500 relative"
                  style={{ width: `${xpPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
              </div>
              <span className="text-[10px] font-pixel text-yellow-400 w-12 text-right">
                {xpForCurrentLevel}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
