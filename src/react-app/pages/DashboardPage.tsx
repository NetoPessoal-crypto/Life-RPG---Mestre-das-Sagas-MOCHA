import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame, getPlayerTitle } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { User, TrendingUp, TrendingDown, Sword, Package, PackageOpen, ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardPage() {
  const { state, updatePlayerName, addGold, removeGold } = useGame();
  const [goldValue, setGoldValue] = useState('');
  const [isChestOpen, setIsChestOpen] = useState(false); // Estado para abrir o baú

  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpPercent = (state.totalXP % 100);

  return (
    <AppShell>
      <div className="p-4 space-y-8 pb-24 text-[#d4a853]">
        
        {/* TOPO: PERFIL PIXEL ART */}
        <div className="bg-[#121212] border-2 border-[#d4a853]/30 rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 border-b border-[#d4a853]/10 pb-4 mb-4">
             <div className="w-14 h-14 bg-[#1a1a1a] border-2 border-[#d4a853] flex items-center justify-center">
                <User size={28} className="text-[#d4a853]" />
             </div>
             <div>
                <h2 className="font-pixel text-[14px] uppercase tracking-wider">{state.playerName}</h2>
                <p className="font-pixel text-[8px] text-white/40 italic">
                  [ {getPlayerTitle(state.level)} ]
                </p>
             </div>
          </div>

          {/* BARRAS ESTILO PDF */}
          <div className="space-y-3">
            <div className="space-y-1">
               <div className="flex justify-between font-pixel text-[7px]">
                  <span>VITALIDADE</span>
                  <span>{state.hp}%</span>
               </div>
               <div className="h-3 w-full bg-[#0a0a0a] border border-[#d4a853]/20">
                  <div className="h-full bg-red-800 transition-all duration-1000" style={{ width: `${hpPercent}%` }} />
               </div>
            </div>

            <div className="space-y-1">
               <div className="flex justify-between font-pixel text-[7px]">
                  <span>EXPERIENCIA</span>
                  <span>LV {state.level}</span>
               </div>
               <div className="h-3 w-full bg-[#0a0a0a] border border-[#d4a853]/20">
                  <div className="h-full bg-blue-800 transition-all duration-1000" style={{ width: `${xpPercent}%` }} />
               </div>
            </div>
          </div>
        </div>

        {/* MISSÕES REAIS (Sincronizado com o que você cria) */}
        <div className="space-y-4">
          <h3 className="font-pixel text-[10px] flex items-center gap-2">
            <Sword size={14} /> JORNADAS ATIVAS
          </h3>
          
          {state.sagas.length === 0 ? (
            <div className="border-2 border-dashed border-[#d4a853]/10 p-8 text-center rounded-lg">
               <p className="font-pixel text-[7px] text-white/20 uppercase italic">
                 Nenhuma saga iniciada...<br/>Vá na aba "Sagas" para criar sua história!
               </p>
            </div>
          ) : (
            <div className="space-y-2">
               {/* Aqui vamos mapear as sagas reais quando conectarmos os arquivos */}
               {state.sagas.slice(0, 3).map((saga) => (
                 <div key={saga.id} className="bg-[#1a1a1a] border-l-4 border-[#d4a853] p-3 flex justify-between items-center">
                    <span className="font-pixel text-[8px] uppercase">{saga.name}</span>
                    <span className="font-pixel text-[6px] opacity-40">EM PROGRESSO</span>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* ATRIBUTOS (Fiel ao seu PDF) */}
        <div className="bg-[#121212] p-4 border border-[#d4a853]/10">
           <p className="font-pixel text-[8px] mb-4 opacity-30 uppercase">Atributos do Herói</p>
           {[
             { label: 'STR', val: state.attributes.STR },
             { label: 'INT', val: state.attributes.INT },
             { label: 'EXPL', val: state.attributes.EXPL },
             { label: 'CON', val: state.attributes.CON },
             { label: 'WIS', val: state.attributes.WIS }
           ].map((attr) => (
             <div key={attr.label} className="flex items-center gap-4 mb-2">
               <span className="font-pixel text-[8px] w-8">{attr.label}</span>
               <div className="h-2 flex-1 bg-black border border-[#d4a853]/10 relative overflow-hidden">
                  <div className="h-full bg-[#d4a853]/60" style={{ width: `${attr.val}%` }} />
               </div>
               <span className="font-pixel text-[8px] text-white/50">{attr.val}</span>
             </div>
           ))}
        </div>

        {/* O COFRE INTERATIVO (BAÚ) */}
        <div className="fixed bottom-20 left-4 right-4 z-50">
           <div className={`bg-[#2a1e12] border-2 border-[#5c4026] p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-all duration-500 transform ${isChestOpen ? 'translate-y-0 opacity-100' : 'translate-y-[80%] opacity-90'}`}>
              
              {/* Gatilho para abrir/fechar */}
              <button 
                onClick={() => setIsChestOpen(!isChestOpen)}
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#5c4026] w-20 h-10 border-2 border-b-0 border-[#d4a853] flex items-center justify-center rounded-t-xl"
              >
                {isChestOpen ? <ChevronDown className="animate-bounce" /> : <Package className="animate-pulse" />}
              </button>

              <div className="text-center mb-4">
                 <div className="flex justify-center gap-2 mb-1">
                    {isChestOpen ? <PackageOpen size={20} /> : <Package size={20} />}
                    <h3 className="font-pixel text-[10px] uppercase">Seu Baú de Ouro</h3>
                 </div>
                 <p className="font-pixel text-[16px] text-yellow-500">
                    {state.attributes.GOLD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 </p>
              </div>

              {isChestOpen && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <input 
                    type="number" value={goldValue} onChange={(e) => setGoldValue(e.target.value)}
                    placeholder="VALOR..."
                    className="flex-1 bg-black border border-[#5c4026] p-2 text-white font-pixel text-[10px] outline-none"
                  />
                  <Button onClick={() => { addGold(Number(goldValue)); setGoldValue(''); }} className="bg-green-900/60 border border-green-500/50 h-10 px-4">
                    <TrendingUp size={16} />
                  </Button>
                  <Button onClick={() => { removeGold(Number(goldValue)); setGoldValue(''); }} className="bg-red-900/60 border border-red-500/50 h-10 px-4">
                    <TrendingDown size={16} />
                  </Button>
                </div>
              )}
           </div>
        </div>

      </div>
    </AppShell>
  );
}
