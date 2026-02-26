import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame, getPlayerTitle } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { Swords, Scroll, Package, PackageOpen, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardPage() {
  const { state, addGold, removeGold } = useGame();
  const [goldValue, setGoldValue] = useState('');
  const [isChestOpen, setIsChestOpen] = useState(false);

  // Filtro de Quests Reais (Lógica exata do seu Mocha)
  const questsWithSaga = state.sagas.flatMap(saga => 
    saga.quests
      .filter(q => {
        const todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
        return q.day === todayStr || q.day === 'todos';
      })
      .map(q => ({ quest: q, sagaId: saga.id }))
  );

  const completedCount = questsWithSaga.filter(q => q.quest.completed).length;
  const totalCount = questsWithSaga.length;

  return (
    <AppShell>
      <div className="p-4 space-y-6 pb-32">
        {/* Title Section (Mocha Style) */}
        <div className="text-center">
          <h1 className="font-pixel text-lg text-primary flex items-center justify-center gap-2">
            <Swords className="w-5 h-5" /> LIFE RPG <Swords className="w-5 h-5 scale-x-[-1]" />
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">
            {state.playerName} - {getPlayerTitle(state.level)}
          </p>
        </div>

        {/* Quests de Hoje (Com os divisores de linha que você gosta) */}
        <section>
          <h2 className="font-pixel text-xs text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30" />
            QUESTS DE HOJE
            <span className="flex-1 h-px bg-primary/30" />
            <span className="text-primary">{completedCount}/{totalCount}</span>
          </h2>

          {questsWithSaga.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-primary/30 rounded-lg">
              <Scroll className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">Mural de missões vazio</p>
            </div>
          ) : (
            <div className="space-y-2">
              {questsWithSaga.map(({ quest }) => (
                <div key={quest.id} className="bg-card border border-primary/20 p-3 rounded-lg flex items-center justify-between">
                  <span className={`font-pixel text-[9px] uppercase ${quest.completed ? 'line-through opacity-40' : 'text-white'}`}>
                    {quest.title}
                  </span>
                  {quest.completed && <span className="text-[8px] text-green-500 font-pixel">FEITO</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats Summary (Layout Mocha) */}
        <section className="bg-card border border-primary/20 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-pixel text-xl text-primary">{state.level}</p>
              <p className="text-[8px] text-muted-foreground">NÍVEL</p>
            </div>
            <div>
              <p className="font-pixel text-xl text-yellow-400">{state.totalXP}</p>
              <p className="text-[8px] text-muted-foreground">XP TOTAL</p>
            </div>
            <div>
              <p className="font-pixel text-xl text-cyan-400">{state.mapPoints.length}</p>
              <p className="text-[8px] text-muted-foreground">LOCAIS</p>
            </div>
          </div>
        </section>

        {/* O COFRE (BAÚ DE TESOURO) */}
        <section>
          <h2 className="font-pixel text-xs text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30" />
            BAÚ DE OURO
            <span className="flex-1 h-px bg-primary/30" />
          </h2>
          
          <div className="bg-card border-2 border-primary/20 p-6 flex flex-col items-center gap-4 rounded-lg">
              <button onClick={() => setIsChestOpen(!isChestOpen)} className="hover:scale-110 active:scale-95 transition-transform">
                {isChestOpen ? (
                  <PackageOpen size={48} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                ) : (
                  <Package size={48} className="text-primary/40 hover:text-primary" />
                )}
              </button>
              
              <p className="font-pixel text-[18px] text-yellow-500">
                {state.attributes.GOLD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>

              {isChestOpen && (
                <div className="w-full space-y-4 animate-in zoom-in duration-300">
                  <input 
                    type="number" value={goldValue} onChange={(e) => setGoldValue(e.target.value)}
                    placeholder="VALOR..."
                    className="w-full bg-black border border-primary/20 p-2 text-white font-pixel text-[10px] outline-none text-center"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => { addGold(Number(goldValue)); setGoldValue(''); }} className="flex-1 bg-green-900/20 border border-green-500 text-green-500 h-10 font-pixel text-[8px]">
                      DEPOSITAR <TrendingUp size={14} className="ml-1" />
                    </Button>
                    <Button onClick={() => { removeGold(Number(goldValue)); setGoldValue(''); }} className="flex-1 bg-red-900/20 border border-red-500 text-red-500 h-10 font-pixel text-[8px]">
                      RETIRAR <TrendingDown size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
