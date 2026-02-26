import AppShell from '@/react-app/components/AppShell';
import QuestItem from '@/react-app/components/QuestItem';
import LegendChest from '@/react-app/components/LegendChest'; 
import { useGame } from '@/react-app/context/GameContext';
import { Scroll, Swords } from 'lucide-react';

export default function DashboardPage() {
  const { state } = useGame();

  // Filtro de Quests (Original do Mocha)
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
      <div className="p-4 space-y-6 pb-24">
        
        {/* TÍTULO MOCHA */}
        <div className="text-center">
          <h1 className="font-pixel text-lg text-primary flex items-center justify-center gap-2">
            <Swords className="w-5 h-5" /> LIFE RPG <Swords className="w-5 h-5 scale-x-[-1]" />
          </h1>
          <p className="text-xs text-muted-foreground mt-1 uppercase">{state.playerName}</p>
        </div>

        {/* QUESTS DE HOJE MOCHA */}
        <section>
          <h2 className="font-pixel text-xs text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30" />
            QUESTS DE HOJE
            <span className="flex-1 h-px bg-primary/30" />
            <span className="text-primary">{completedCount}/{totalCount}</span>
          </h2>

          {questsWithSaga.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-primary/30 rounded-lg">
              <Scroll className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">Nenhuma quest para hoje</p>
            </div>
          ) : (
            <div className="space-y-2">
              {questsWithSaga.map(({ quest, sagaId }) => (
                <QuestItem key={quest.id} quest={quest} sagaId={sagaId} />
              ))}
            </div>
          )}
        </section>

        {/* STATS SUMMARY MOCHA */}
        <section className="bg-card border border-primary/20 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-pixel text-2xl text-primary">{state.level}</p>
              <p className="text-[10px] text-muted-foreground">NÍVEL</p>
            </div>
            <div>
              <p className="font-pixel text-2xl text-yellow-400">{state.totalXP}</p>
              <p className="text-[10px] text-muted-foreground">XP TOTAL</p>
            </div>
            <div>
              <p className="font-pixel text-2xl text-cyan-400">{state.mapPoints.length}</p>
              <p className="text-[10px] text-muted-foreground">LUGARES</p>
            </div>
          </div>
        </section>

        {/* O NOSSO BAÚ LENDÁRIO COM MOSCAS E MOEDAS */}
        <LegendChest />

      </div>
    </AppShell>
  );
}
