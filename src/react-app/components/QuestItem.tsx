import { Quest, AttributeKey, useGame } from '@/react-app/context/GameContext';
import { Check, Heart, Dumbbell, Wind, Brain, Sparkles, Compass, Coins } from 'lucide-react';

interface QuestItemProps {
  quest: Quest;
  sagaId: string;
}

const attributeIcons: Record<AttributeKey, typeof Heart> = {
  CON: Heart,
  STR: Dumbbell,
  DEX: Wind,
  INT: Brain,
  WIS: Sparkles,
  EXPL: Compass,
  GOLD: Coins
};

const attributeColors: Record<AttributeKey, string> = {
  CON: 'text-red-400 bg-red-500/20 border-red-500/30',
  STR: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
  DEX: 'text-green-400 bg-green-500/20 border-green-500/30',
  INT: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  WIS: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  EXPL: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
  GOLD: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
};

export default function QuestItem({ quest, sagaId }: QuestItemProps) {
  const { completeQuest } = useGame();
  const Icon = attributeIcons[quest.attribute];
  const colorClasses = attributeColors[quest.attribute];

  return (
    <div 
      className={`
        flex items-center gap-3 p-3 rounded-lg bg-card border
        ${quest.completed ? 'border-primary/30 opacity-60' : 'border-border'}
        transition-all duration-200
      `}
    >
      {/* Attribute Icon */}
      <div className={`p-2 rounded border ${colorClasses}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Quest Title */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${quest.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {quest.title}
        </p>
        <p className="text-[10px] font-pixel text-muted-foreground mt-0.5">
          +10 {quest.attribute} XP
        </p>
      </div>

      {/* Complete Button */}
      <button
        onClick={() => !quest.completed && completeQuest(quest.id, sagaId)}
        disabled={quest.completed}
        className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          transition-all duration-200 active:scale-90
          ${quest.completed 
            ? 'bg-primary/20 text-primary cursor-default' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90 glow-gold'
          }
        `}
      >
        <Check className="w-6 h-6" strokeWidth={3} />
      </button>
    </div>
  );
}
