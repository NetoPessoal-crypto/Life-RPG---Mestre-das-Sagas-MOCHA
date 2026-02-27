import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame, getPlayerTitle, TavernSkin } from '@/react-app/context/GameContext';
import { User, Settings, X } from 'lucide-react';

export default function ProfilePage() {
  const { state, setTavernSkin } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  
  const attrTop = ['CON', 'STR', 'DEX', 'INT'] as const;
  const attrBottom = ['WIS', 'EXPL', 'GOLD'] as const;

  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpPercent = (state.totalXP % 100);

  const skins: { id: TavernSkin, label: string }[] = [
    { id: 'sombrio', label: 'Mercado Negro (Sombrio)' },
    { id: 'rustico', label: 'Taverna Clássica (Rústico)' },
    { id: 're4', label: 'O Mercador (RE4)' },
    { id: 'cigana', label: 'Tenda da Cigana' }
  ];

  return (
    <AppShell>
      <div className="relative p-4 space-y-8 pb-24">
        
        {/* BOTÃO DE CONFIGURAÇÕES NO TOPO */}
        <div className="flex justify-end mb-[-1rem]">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Profile Card */}
        <section className="bg-card border border-primary/20 rounded-lg p-6 flex flex-col items-center gap-4 relative">
           <div className="w-20 h-20 bg-black border-2 border-primary/40 flex items-center justify-center shadow-lg">
              <User size={40} className="text-primary opacity-60" />
           </div>
           <div className="text-center">
              <h2 className="font-pixel text-lg text-white uppercase">{state.playerName}</h2>
              <p className="font-pixel text-[8px] text-primary tracking-widest uppercase">{getPlayerTitle(state.level)}</p>
           </div>
           
           <div className="w-full space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between font-pixel text-[7px] text-red-500 uppercase">
                  <span>Vida</span>
                  <span>{state.hp}%</span>
                </div>
                <div className="h-3 w-full bg-black border border-red-900/30 overflow-hidden">
                  <div className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" style={{ width: `${hpPercent}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-pixel text-[7px] text-blue-400 uppercase">
                  <span>XP</span>
                  <span>LV {state.level}</span>
                </div>
                <div className="h-2 w-full bg-black border border-blue-900/30 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${xpPercent}%` }} />
                </div>
              </div>
           </div>
        </section>

        {/* Atributos com Barras */}
        <section>
          <h2 className="font-pixel text-xs text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30" /> STATUS <span className="flex-1 h-px bg-primary/30" />
          </h2>
          
          <div className="space-y-4">
            {(Object.entries(state.attributes)).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between font-pixel text-[9px]">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="text-primary">{value}</span>
                </div>
                <div className="h-2 w-full bg-black border border-primary/10 overflow-hidden">
                  <div 
                    className="h-full bg-[#d4a853]/60 transition-all duration-1000"
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MODAL DE CONFIGURAÇÕES DO MESTRE */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-primary/50 w-full max-w-[350px] rounded-lg p-6 relative">
              
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
              >
                <X size={20} />
              </button>

              <h2 className="font-pixel text-primary text-sm mb-6 text-center tracking-widest">
                OPÇÕES DO MESTRE
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-pixel text-[10px] text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-primary/30" /> ESTÉTICA DA TAVERNA
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {skins.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setTavernSkin(s.id)}
                        className={`p-3 font-pixel text-[10px] border text-left transition-all ${
                          state.tavernSkin === s.id 
                            ? 'bg-primary text-black border-primary' 
                            : 'bg-black text-muted-foreground border-primary/20 hover:border-primary/50'
                        }`}
                      >
                        {state.tavernSkin === s.id && "▶ "} {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
