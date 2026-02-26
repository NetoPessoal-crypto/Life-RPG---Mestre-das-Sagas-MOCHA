import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame, getPlayerTitle } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { User, Sword, Package, PackageOpen, TrendingUp, TrendingDown, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { state, addGold, removeGold } = useGame();
  const [goldValue, setGoldValue] = useState('');
  const [isChestOpen, setIsChestOpen] = useState(false);

  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpPercent = (state.totalXP % 100);

  return (
    <AppShell>
      <div className="p-4 space-y-8 pb-32 text-[#d4a853]">
        
        {/* HEADER DO RECRUTA ZERO */}
        <div className="bg-[#1a1a1a] border-4 border-double border-[#d4a853]/40 p-4 shadow-lg rounded-sm">
          <div className="flex items-center gap-4 border-b border-[#d4a853]/20 pb-4 mb-4">
             <div className="w-14 h-14 bg-black border-2 border-[#d4a853] flex items-center justify-center">
                <User size={28} className="text-[#d4a853]" />
             </div>
             <div>
                <h2 className="font-pixel text-[12px] uppercase text-white">{state.playerName}</h2>
                <p className="font-pixel text-[7px] text-[#d4a853] tracking-tighter">
                   {getPlayerTitle(state.level)}
                </p>
             </div>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-full bg-black border border-red-900 rounded-sm overflow-hidden">
               <div className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" style={{ width: `${hpPercent}%` }} />
            </div>
            <div className="h-2 w-full bg-black border border-blue-900 rounded-sm overflow-hidden">
               <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* MISSÕES DO DIA */}
        <div className="space-y-4">
          <h3 className="font-pixel text-[9px] flex items-center gap-2 border-l-4 border-[#d4a853] pl-2">
            <Sword size={14} /> JORNADAS ATIVAS
          </h3>
          
          {state.sagas.length === 0 ? (
            <div className="bg-black/40 border border-[#d4a853]/10 p-6 text-center italic opacity-40 font-pixel text-[7px]">
              NENHUMA MISSÃO NO MURAL...
            </div>
          ) : (
            <div className="space-y-3">
              {state.sagas.map(s => (
                <div key={s.id} className="bg-[#121212] border border-[#d4a853]/20 p-3 flex justify-between items-center rounded-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-[#d4a853]/30" />
                    <span className="font-pixel text-[8px] text-white uppercase">{s.name}</span>
                  </div>
                  <span className="font-pixel text-[6px] text-[#d4a853]">EM PROGRESSO</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BAÚ DE OURO (NO FINAL DA TELA) */}
        <div className="pt-10">
          <div className={`bg-[#2a1e12] border-t-4 border-[#5c4026] p-6 transition-all duration-500 ${isChestOpen ? 'rounded-lg shadow-2xl translate-y-0' : 'rounded-t-3xl translate-y-2'}`}>
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => setIsChestOpen(!isChestOpen)}
                className="hover:scale-110 transition-transform active:scale-95"
              >
                {isChestOpen ? (
                  <PackageOpen size={48} className="text-yellow-500 animate-in zoom-in duration-300" />
                ) : (
                  <Package size={48} className="text-[#5c4026] hover:text-[#d4a853] transition-colors" />
                )}
              </button>
              
              <h4 className="font-pixel text-[9px] uppercase tracking-widest text-[#d4a853]">
                {isChestOpen ? 'BAÚ ABERTO' : 'BAÚ DE TESOURO'}
              </h4>
              
              <p className="font-pixel text-[18px] text-yellow-500 my-2">
                {state.attributes.GOLD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>

              {isChestOpen && (
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <input 
                    type="number" value={goldValue} onChange={(e) => setGoldValue(e.target.value)}
                    placeholder="DIGITE O VALOR..."
                    className="w-full bg-black/60 border border-[#d4a853]/20 p-3 text-white font-pixel text-[10px] outline-none rounded-sm text-center"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => { addGold(Number(goldValue)); setGoldValue(''); }} className="flex-1 bg-green-900/40 border border-green-500/50 hover:bg-green-800 h-12">
                      <TrendingUp size={18} />
                    </Button>
                    <Button onClick={() => { removeGold(Number(goldValue)); setGoldValue(''); }} className="flex-1 bg-red-900/40 border border-red-500/50 hover:bg-red-800 h-12">
                      <TrendingDown size={18} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
