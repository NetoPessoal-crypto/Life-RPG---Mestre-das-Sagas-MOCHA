import AppShell from '@/react-app/components/AppShell';
import { useGame, getPlayerTitle } from '@/react-app/context/GameContext';
import { User, Shield, Zap } from 'lucide-react';

export default function ProfilePage() {
  const { state } = useGame();
  
  const attrTop = ['CON', 'STR', 'DEX', 'INT'] as const;
  const attrBottom = ['WIS', 'EXPL', 'GOLD'] as const;

  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpPercent = (state.totalXP % 100);

  return (
    <AppShell>
      <div className="p-4 space-y-8">
        {/* Personagem Status Card */}
        <section className="bg-card border border-primary/20 rounded-lg p-6 flex flex-col items-center gap-4">
           <div className="w-20 h-20 rounded-full border-4 border-primary/40 bg-black flex items-center justify-center shadow-lg">
              <User size={40} className="text-primary opacity-80" />
           </div>
           <div className="text-center">
              <h2 className="font-pixel text-lg text-white uppercase">{state.playerName}</h2>
              <p className="font-pixel text-[8px] text-primary tracking-widest">{getPlayerTitle(state.level)}</p>
           </div>
           
           <div className="w-full space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between font-pixel text-[7px] text-red-500">
                  <span>HP</span>
                  <span>{state.hp}%</span>
                </div>
                <div className="h-3 w-full bg-black border border-red-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${hpPercent}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-pixel text-[7px] text-blue-400">
                  <span>XP</span>
                  <span>LV {state.level}</span>
                </div>
                <div className="h-2 w-full bg-black border border-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${xpPercent}%` }} />
                </div>
              </div>
           </div>
        </section>

        {/* Attributes Grid (Mocha Style: 4 e 3) */}
        <section>
          <h2 className="font-pixel text-xs text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30" /> ATRIBUTOS <span className="flex-1 h-px bg-primary/30" />
          </h2>
          
          <div className="grid grid-cols-4 gap-2 mb-2">
            {attrTop.map(attr => (
              <div key={attr} className="bg-card border border-primary/10 p-2 rounded text-center">
                <p className="text-[6px] text-muted-foreground font-pixel">{attr}</p>
                <p className="text-xs font-pixel text-primary">{state.attributes[attr]}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {attrBottom.map(attr => (
              <div key={attr} className="bg-card border border-primary/10 p-2 rounded text-center">
                <p className="text-[6px] text-muted-foreground font-pixel">{attr}</p>
                <p className="text-xs font-pixel text-primary">
                  {attr === 'GOLD' ? `$${state.attributes[attr]}` : state.attributes[attr]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
