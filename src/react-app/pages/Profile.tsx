import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame, AttributeKey } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { User, Edit2, Save, Trophy, Target, Flame, Heart } from 'lucide-react';

const attributeLabels: Record<AttributeKey, string> = {
  CON: 'Constituição',
  STR: 'Força',
  DEX: 'Destreza',
  INT: 'Inteligência',
  WIS: 'Sabedoria',
  EXPL: 'Exploração',
  GOLD: 'Ouro'
};

export default function ProfilePage() {
  const { state, updatePlayerName, heal } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(state.playerName);

  const handleSave = () => {
    if (tempName.trim()) {
      updatePlayerName(tempName.trim());
      setIsEditing(false);
    }
  };

  const totalAttributePoints = Object.values(state.attributes).reduce((a, b) => a + b, 0);
  const completedQuests = state.sagas.flatMap(s => s.quests).filter(q => q.completed).length;
  const totalQuests = state.sagas.flatMap(s => s.quests).length;

  return (
    <AppShell>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="bg-card border border-primary/30 rounded-lg p-6 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/40 to-accent border-4 border-primary/50 flex items-center justify-center glow-gold">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-pixel text-xs px-3 py-1 rounded-full">
              LV {state.level}
            </div>
          </div>

          {/* Name */}
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-muted border border-border rounded px-3 py-1 text-center font-pixel text-sm focus:outline-none focus:border-primary"
                autoFocus
              />
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="font-pixel text-lg text-foreground">{state.playerName}</h2>
              <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-primary">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <p className="text-sm text-muted-foreground">Aventureiro Nível {state.level}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-primary/20 rounded-lg p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="font-pixel text-xl text-foreground">{state.totalXP}</p>
            <p className="text-[10px] text-muted-foreground">XP TOTAL</p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-4 text-center">
            <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="font-pixel text-xl text-foreground">{completedQuests}</p>
            <p className="text-[10px] text-muted-foreground">QUESTS FEITAS</p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-4 text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="font-pixel text-xl text-foreground">{totalAttributePoints}</p>
            <p className="text-[10px] text-muted-foreground">PONTOS TOTAIS</p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="font-pixel text-xl text-foreground">{state.mapPoints.length}</p>
            <p className="text-[10px] text-muted-foreground">EXPLORAÇÕES</p>
          </div>
        </div>

        {/* Attributes Detail */}
        <div className="bg-card border border-primary/20 rounded-lg p-4">
          <h3 className="font-pixel text-xs text-muted-foreground mb-4">ATRIBUTOS</h3>
          <div className="space-y-3">
            {(Object.entries(state.attributes) as [AttributeKey, number][]).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="font-pixel text-[10px] text-muted-foreground w-20">{attributeLabels[key]}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-yellow-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, value)}%` }}
                  />
                </div>
                <span className="font-pixel text-xs text-foreground w-8 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HP Recovery */}
        {state.hp < state.maxHP && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-pixel text-xs text-red-400">VIDA BAIXA</h3>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Complete quests de CON e EXPL para recuperar
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <Button 
              onClick={() => heal(20)} 
              variant="outline" 
              className="w-full font-pixel text-[10px] border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              DESCANSAR (+20 HP)
            </Button>
          </div>
        )}

        {/* Sagas Summary */}
        <div className="bg-card border border-primary/20 rounded-lg p-4">
          <h3 className="font-pixel text-xs text-muted-foreground mb-3">SAGAS ATIVAS</h3>
          {state.sagas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">Nenhuma saga criada</p>
          ) : (
            <div className="space-y-2">
              {state.sagas.map(saga => {
                const completed = saga.quests.filter(q => q.completed).length;
                const total = saga.quests.length;
                return (
                  <div key={saga.id} className="flex items-center justify-between text-sm">
                    <span>{saga.name}</span>
                    <span className="font-pixel text-[10px] text-primary">{completed}/{total}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
