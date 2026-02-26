import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame, getPlayerTitle } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { User, Shield, Zap, Coins, TrendingUp, TrendingDown, CheckCircle2, Circle, Sword, Brain, Map, Heart, Flame, Package } from 'lucide-react';

export default function DashboardPage() {
  const { state, updatePlayerName, addGold, removeGold, addXP } = useGame();
  const [goldValue, setGoldValue] = useState('');

  // Simulação de Missões do Dia (Isso virá do seu Sagas futuramente)
  const todayQuests = [
    { id: '1', title: 'TREINO DE FORÇA NA ACADEMIA', xp: 20, attr: 'STR', completed: false },
    { id: '2', title: 'ESTUDAR REACT POR 1 HORA', xp: 25, attr: 'INT', completed: true },
    { id: '3', title: 'EXPLORAR NOVO CAFÉ NO MAPA', xp: 15, attr: 'EXPL', completed: false },
  ];

  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpPercent = (state.totalXP % 100);

  return (
    <AppShell>
      <div className="p-4 space-y-6 pb-24">
        
        {/* TOPO: STATUS DO HERÓI (ESTILO CLÁSSICO) */}
        <div className="bg-[#1a1a1a] border-4 border-double border-[#d4a853]/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 border-b border-[#d4a853]/20 pb-3 mb-3">
             <div className="w-16 h-16 bg-black border-2 border-[#d4a853] flex items-center justify-center rounded-sm">
                <User size={30} className="text-[#d4a853]" />
             </div>
             <div>
                <h2 className="font-pixel text-[#d4a853] text-[12px] uppercase">{state.playerName}</h2>
                <p className="font-pixel text-white/50 text-[7px] tracking-tighter italic">
                  &lt; {getPlayerTitle(state.level)} &gt;
                </p>
             </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[8px] font-pixel text-red-500">
               <span>VITALIDADE (HP)</span>
               <span>{state.hp} / {state.maxHP}</span>
            </div>
            <div className="h-4 w-full bg-black border border-red-900 rounded-sm p-[2px]">
               <div className="h-full bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)]" style={{ width: `${hpPercent}%` }} />
            </div>

            <div className="flex justify-between items-center text-[8px] font-pixel text-blue-400">
               <span>EXPERIÊNCIA (XP)</span>
               <span>NÍVEL {state.level}</span>
            </div>
            <div className="h-3 w-full bg-black border border-blue-900 rounded-sm p-[1px]">
               <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* MISSÕES DO DIA (O CORAÇÃO DO DASHBOARD) */}
        <div className="space-y-3">
          <h3 className="font-pixel text-[9px] text-[#d4a853] flex items-center gap-2 px-1">
            <Sword size={12} /> MISSÕES ATIVAS
          </h3>
          <div className="space-y-2">
            {todayQuests.map((quest) => (
              <div key={quest.id} className={`bg-black/40 border-l-4 p-3 rounded-r-md flex items-center justify-between transition-all ${quest.completed ? 'border-green-500 opacity-50' : 'border-[#d4a853] border-opacity-50'}`}>
                <div className="flex items-center gap-3">
                  {quest.completed ? <CheckCircle2 className="text-green-500" size={18} /> : <Circle className="text-[#d4a853]/40" size={18} />}
                  <div>
                    <p className="font-pixel text-[8px] text-white leading-tight uppercase">{quest.title}</p>
                    <p className="font-pixel text-[6px] text-[#d4a853] mt-1">RECOMPENSA: +{quest.xp} XP | {quest.attr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATRIBUTOS (COMO NO PDF) */}
        <div className="bg-[#1a1a1a]/80 border-2 border-[#d4a853]/10 rounded-lg p-4 space-y-3 shadow-inner">
           <h3 className="font-pixel text-[7px] text-white/30 uppercase mb-2">Poderes do Herói</h3>
           {[
             { label: 'STR', val: state.attributes.STR, color: 'bg-red-500' },
             { label: 'INT', val: state.attributes.INT, color: 'bg-blue-500' },
             { label: 'EXPL', val: state.attributes.EXPL, color: 'bg-green-500' },
             { label: 'CON', val: state.attributes.CON, color: 'bg-pink-500' },
             { label: 'WIS', val: state.attributes.WIS, color: 'bg-orange-500' }
           ].map((attr) => (
             <div key={attr.label} className="flex items-center gap-4">
               <span className="font-pixel text-[8px] text-white/70 w-8">{attr.label}</span>
               <div className="h-1.5 flex-1 bg-black rounded-full overflow-hidden">
                  <div className={`h-full ${attr.color} opacity-70`} style={{ width: `${attr.val}%` }} />
               </div>
               <span className="font-pixel text-[8px] text-[#d4a853]">{attr.val}</span>
             </div>
           ))}
        </div>

        {/* O COFRE (BAÚ DE FINANÇAS) */}
        <div className="mt-8 pt-8 border-t border-[#d4a853]/10">
          <div className="bg-gradient-to-b from-[#2a1e12] to-[#1a120b] border-2 border-[#5c4026] rounded-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#5c4026] p-2 rounded-full border-2 border-[#d4a853]">
               <Package className="text-[#d4a853]" size={24} />
            </div>
            
            <div className="text-center space-y-1 mb-4 mt-2">
               <p className="font-pixel text-[7px] text-[#d4a853] uppercase tracking-[2px]">Cofre Real (Finanças)</p>
               <h3 className="font-pixel text-[18px] text-yellow-500 shadow-sm">
                 {state.attributes.GOLD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
               </h3>
            </div>

            <div className="flex gap-2">
              <input 
                type="number" value={goldValue} onChange={(e) => setGoldValue(e.target.value)}
                placeholder="VALOR..."
                className="flex-1 bg-black/60 border border-[#5c4026] p-3 text-white font-pixel text-[10px] outline-none rounded-md"
              />
              <Button onClick={() => { addGold(Number(goldValue)); setGoldValue(''); }} className="bg-green-900/40 text-green-400 border border-green-700/50 hover:bg-green-800/60 h-12 flex-1">
                <TrendingUp size={16} />
              </Button>
              <Button onClick={() => { removeGold(Number(goldValue)); setGoldValue(''); }} className="bg-red-900/40 text-red-400 border border-red-700/50 hover:bg-red-800/60 h-12 flex-1">
                <TrendingDown size={16} />
              </Button>
            </div>
            <p className="font-pixel text-[5px] text-[#d4a853]/40 text-center mt-3 uppercase italic">
              "Dinheiro guardado é poder acumulado"
            </p>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
