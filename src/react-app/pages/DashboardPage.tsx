import AppShell from '@/react-app/components/AppShell';
import AttributeCard from '@/react-app/components/AttributeCard';
import QuestItem from '@/react-app/components/QuestItem';
import LegendChest from '@/react-app/components/LegendChest';
import StatusBars from '@/react-app/components/StatusBars'; // <-- OLHA QUEM VOLTOU AQUI!
import { useGame, AttributeKey } from '@/react-app/context/GameContext';
import { Scroll, Swords } from 'lucide-react';

const attributeOrder: AttributeKey[] = ['CON', 'STR', 'DEX', 'INT', 'WIS', 'EXPL', 'GOLD'];

export default function DashboardPage() {
  const { state } = useGame();

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
      <div className="p-4 space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="font-pixel text-lg text-primary flex items-center justify-center gap-2">
            <Swords className="w-5 h-5" />
            LIFE RPG
            <Swords className="w-5 h-5 scale-x-[-1]" />
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Conquiste sua vida, um quest por vez</p>
        </div>

        {/* BARRAS DE VIDA E XP (A Alma do RPG que faltava!) */}
        <StatusBars />

        {/* Attributes Grid */}
        <section>
          <h2 className="font-pixel text-xs text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30" />
            ATRIBUTOS
            <span className="flex-1 h-px bg-primary/30" />
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {attributeOrder.slice(0, 4).map(attr => (
              <AttributeCard 
                key={attr} 
                attribute={attr} 
                value={state.attributes[attr]} 
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {attributeOrder.slice(4).map(attr => (
              <AttributeCard 
                key={attr} 
                attribute={attr} 
                value={state.attributes[attr]} 
              />
            ))}
          </div>
        </section>

        {/* Daily Quests */}
        <section>
          <h2 className="font-pixel text-xs text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30" />
            QUESTS DE HOJE
            <span className="flex-1 h-px bg-primary/30" />
            <span className="text-primary">{completedCount}/{totalCount}</span>
          </h2>

          {questsWithSaga.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-primary/30 rounded-lg">
              <Scroll className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma quest para hoje</p>
              <p className="text-xs text-muted-foreground mt-1">
                Vá para <span className="text-primary">Sagas</span> para criar suas missões
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {questsWithSaga.map(({ quest, sagaId }) => (
                <QuestItem key={quest.id} quest={quest} sagaId={sagaId} />
              ))}
            </div>
          )}
        </section>

        {/* Stats Summary */}
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

        {/* O Baú */}
        <LegendChest />
        
      </div>
    </AppShell>
  );
}
