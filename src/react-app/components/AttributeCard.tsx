import { AttributeKey } from '@/react-app/context/GameContext';
import { Heart, Dumbbell, Wind, Brain, Sparkles, Compass, Coins } from 'lucide-react';

interface AttributeCardProps {
  attribute: AttributeKey;
  value: number;
  onClick?: () => void;
}

const attributeConfig: Record<AttributeKey, { 
  icon: typeof Heart; 
  label: string; 
  fullLabel: string;
  color: string;
  bgColor: string;
}> = {
  CON: { 
    icon: Heart, 
    label: 'CON', 
    fullLabel: 'Constituição',
    color: 'text-red-400',
    bgColor: 'from-red-900/40 to-red-950/40'
  },
  STR: { 
    icon: Dumbbell, 
    label: 'STR', 
    fullLabel: 'Força',
    color: 'text-orange-400',
    bgColor: 'from-orange-900/40 to-orange-950/40'
  },
  DEX: { 
    icon: Wind, 
    label: 'DEX', 
    fullLabel: 'Destreza',
    color: 'text-green-400',
    bgColor: 'from-green-900/40 to-green-950/40'
  },
  INT: { 
    icon: Brain, 
    label: 'INT', 
    fullLabel: 'Inteligência',
    color: 'text-blue-400',
    bgColor: 'from-blue-900/40 to-blue-950/40'
  },
  WIS: { 
    icon: Sparkles, 
    label: 'WIS', 
    fullLabel: 'Sabedoria',
    color: 'text-purple-400',
    bgColor: 'from-purple-900/40 to-purple-950/40'
  },
  EXPL: { 
    icon: Compass, 
    label: 'EXPL', 
    fullLabel: 'Exploração',
    color: 'text-cyan-400',
    bgColor: 'from-cyan-900/40 to-cyan-950/40'
  },
  GOLD: { 
    icon: Coins, 
    label: 'GOLD', 
    fullLabel: 'Ouro',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-900/40 to-yellow-950/40'
  }
};

export default function AttributeCard({ attribute, value, onClick }: AttributeCardProps) {
  const config = attributeConfig[attribute];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-lg bg-gradient-to-br ${config.bgColor}
        border border-primary/20 hover:border-primary/50
        transition-all duration-200 hover:scale-105 active:scale-95
        flex flex-col items-center gap-1 min-w-[80px]
        glow-gold
      `}
    >
      {/* Ornate corner decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/50 rounded-tl" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/50 rounded-tr" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/50 rounded-bl" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/50 rounded-br" />

      <Icon className={`w-6 h-6 ${config.color}`} />
      <span className="font-pixel text-[10px] text-muted-foreground">{config.label}</span>
      <span className={`font-pixel text-lg ${config.color}`}>{value}</span>
    </button>
  );
}
