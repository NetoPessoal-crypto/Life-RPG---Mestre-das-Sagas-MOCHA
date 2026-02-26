import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- INTERFACES ---

export interface Quest {
  id: string;
  title: string;
  attribute: AttributeKey;
  completed: boolean;
  day: string;
}

export interface Saga {
  id: string;
  name: string;
  rawText: string;
  quests: Quest[];
  createdAt: string;
}

export interface MapPhoto {
  url: string;
  timestamp: string;
}

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  discoveredAt: string;
  photos: MapPhoto[];
}

export type AttributeKey = 'CON' | 'STR' | 'DEX' | 'INT' | 'WIS' | 'EXPL' | 'GOLD';

export interface Attributes {
  CON: number;
  STR: number;
  DEX: number;
  INT: number;
  WIS: number;
  EXPL: number;
  GOLD: number;
}

export interface GameState {
  playerName: string;
  level: number;
  totalXP: number;
  hp: number;
  maxHP: number;
  attributes: Attributes;
  sagas: Saga[];
  mapPoints: MapPoint[];
  lastCheckDate: string;
}

const STORAGE_KEY = 'life-rpg-state';

const defaultState: GameState = {
  playerName: 'Neto',
  level: 1,
  totalXP: 0,
  hp: 100,
  maxHP: 100,
  attributes: {
    CON: 10, STR: 10, DEX: 10, INT: 10, WIS: 10, EXPL: 10, GOLD: 0
  },
  sagas: [],
  mapPoints: [],
  lastCheckDate: new Date().toISOString().split('T')[0]
};

// --- FUNÇÕES DE LÓGICA ---

function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

function getTodayString(): string {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
}

function parseQuestsFromText(text: string, sagaId: string): Quest[] {
  const quests: Quest[] = [];
  const lines = text.split(/[;\n]/).filter(line => line.trim());
  const attributeKeywords: Record<string, AttributeKey> = {
    'treino': 'STR', 'academia': 'STR', 'corrida': 'DEX', 'estudo': 'INT', 'ler': 'INT',
    'meditar': 'WIS', 'sono': 'CON', 'água': 'CON', 'viagem': 'EXPL', 'trampo': 'GOLD'
  };
  
  lines.forEach((line, index) => {
    const trimmed = line.trim().toLowerCase();
    let attribute: AttributeKey = 'INT';
    for (const [keyword, attr] of Object.entries(attributeKeywords)) {
      if (trimmed.includes(keyword)) { attribute = attr; break; }
    }
    quests.push({
      id: `${sagaId}-${index}-${Date.now()}`,
      title: line.trim().toUpperCase(),
      attribute,
      completed: false,
      day: 'todos'
    });
  });
  return quests;
}

// --- CONTEXTO ---

interface GameContextType {
  state: GameState;
  completeQuest: (questId: string, sagaId: string) => void;
  addSaga: (name: string, rawText: string) => void;
  deleteSaga: (sagaId: string) => void;
  addMapPoint: (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => void;
  addPhotoToPoint: (pointId: string, photoUrl: string) => void;
  updatePlayerName: (name: string) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  isExhausted: boolean;
  todayQuests: Quest[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMapPoint = (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => {
    setState(prev => ({
      ...prev,
      totalXP: prev.totalXP + 20,
      level: calculateLevel(prev.totalXP + 20),
      attributes: { ...prev.attributes, EXPL: prev.attributes.EXPL + 15 },
      mapPoints: [...prev.mapPoints, {
        ...point,
        id: `point-${Date.now()}`,
        discoveredAt: new Date().toISOString()
      }]
    }));
  };

  const addPhotoToPoint = (pointId: string, photoUrl: string) => {
    setState(prev => ({
      ...prev,
      totalXP: prev.totalXP + 10,
      mapPoints: prev.mapPoints.map(p => 
        p.id === pointId 
          ? { ...p, photos: [...p.photos, { url: photoUrl, timestamp: new Date().toISOString() }] }
          : p
      )
    }));
  };

  const completeQuest = (questId: string, sagaId: string) => {
    setState(prev => ({
      ...prev,
      totalXP: prev.totalXP + 10,
      level: calculateLevel(prev.totalXP + 10),
      sagas: prev.sagas.map(s => s.id === sagaId ? { ...s, quests: s.quests.map(q => q.id === questId ? { ...q, completed: true } : q) } : s)
    }));
  };

  const addSaga = (name: string, rawText: string) => {
    const sagaId = `saga-${Date.now()}`;
    setState(prev => ({ ...prev, sagas: [...prev.sagas, { id: sagaId, name, rawText, quests: parseQuestsFromText(rawText, sagaId), createdAt: new Date().toISOString() }] }));
  };

  const deleteSaga = (sagaId: string) => setState(prev => ({ ...prev, sagas: prev.sagas.filter(s => s.id !== sagaId) }));
  const updatePlayerName = (name: string) => setState(prev => ({ ...prev, playerName: name }));
  const takeDamage = (amount: number) => setState(prev => ({ ...prev, hp: Math.max(0, prev.hp - amount) }));
  const heal = (amount: number) => setState(prev => ({ ...prev, hp: Math.min(prev.maxHP, prev.hp + amount) }));
  const isExhausted = state.hp < 30;
  const todayQuests = state.sagas.flatMap(s => s.quests);

  return (
    <GameContext.Provider value={{ state, completeQuest, addSaga, deleteSaga, addMapPoint, addPhotoToPoint, updatePlayerName, takeDamage, heal, isExhausted, todayQuests }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
