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

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  photo?: string;
  name: string;
  discoveredAt: string;
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

// --- CONFIGURAÇÕES INICIAIS ---

const STORAGE_KEY = 'life-rpg-state';

const defaultState: GameState = {
  playerName: 'Aventureiro',
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

// --- FUNÇÕES AUXILIARES ---

function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

function getTodayString(): string {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
}

function parseQuestsFromText(text: string, sagaId: string): Quest[] {
  const quests: Quest[] = [];
  const lines = text.split(/[;\n]/).filter(line => line.trim());
  
  const dayMap: Record<string, string> = {
    'segunda': 'segunda-feira', 'terça': 'terça-feira', 'quarta': 'quarta-feira',
    'quinta': 'quinta-feira', 'sexta': 'sexta-feira', 'sábado': 'sábado', 'domingo': 'domingo'
  };
  
  const attributeKeywords: Record<string, AttributeKey> = {
    'treino': 'STR', 'academia': 'STR', 'musculação': 'STR', 'força': 'STR',
    'corrida': 'DEX', 'cardio': 'DEX', 'caminhada': 'DEX', 'bike': 'DEX',
    'estudo': 'INT', 'estudar': 'INT', 'leitura': 'INT', 'ler': 'INT', 'curso': 'INT', 'react': 'INT', 'javascript': 'INT',
    'meditação': 'WIS', 'meditar': 'WIS', 'terapia': 'WIS', 'reflexão': 'WIS',
    'sono': 'CON', 'dormir': 'CON', 'saúde': 'CON', 'médico': 'CON', 'água': 'CON', 'dieta': 'CON',
    'passeio': 'EXPL', 'explorar': 'EXPL', 'viagem': 'EXPL', 'lazer': 'EXPL',
    'dinheiro': 'GOLD', 'trabalho': 'GOLD', 'freelance': 'GOLD', 'renda': 'GOLD', 'venda': 'GOLD'
  };
  
  lines.forEach((line, index) => {
    const trimmed = line.trim().toLowerCase();
    let day = 'todos';
    let title = line.trim();
    
    for (const [key, value] of Object.entries(dayMap)) {
      if (trimmed.includes(key)) {
        day = value;
        title = line.includes(':') ? line.split(':')[1].trim() : line.replace(new RegExp(key, 'i'), '').trim();
        break;
      }
    }
    
    let attribute: AttributeKey = 'INT';
    for (const [keyword, attr] of Object.entries(attributeKeywords)) {
      if (trimmed.includes(keyword)) {
        attribute = attr;
        break;
      }
    }
    
    if (title) {
      quests.push({
        id: `${sagaId}-${index}-${Date.now()}`,
        title: title.toUpperCase(),
        attribute,
        completed: false,
        day
      });
    }
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
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Salva no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Lógica de virada de dia e penalidade (Debuff)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastCheckDate !== today) {
      const todayStr = getTodayString();
      
      // Verifica se quests essenciais ficaram pendentes
      const missedCON = state.sagas.some(s => 
        s.quests.some(q => (q.day === todayStr || q.day === 'todos') && q.attribute === 'CON' && !q.completed)
      );
      
      let damage = 0;
      if (missedCON) damage += 15; // Falta de sono/saúde tira mais HP
      
      setState(prev => ({
        ...prev,
        lastCheckDate: today,
        hp: Math.max(0, prev.hp - damage),
        // Reseta as tarefas para o novo dia
        sagas: prev.sagas.map(saga => ({
          ...saga,
          quests: saga.quests.map(q => ({ ...q, completed: false }))
        }))
      }));
    }
  }, [state.lastCheckDate, state.sagas]);

  const completeQuest = (questId: string, sagaId: string) => {
    setState(prev => {
      const saga = prev.sagas.find(s => s.id === sagaId);
      const quest = saga?.quests.find(q => q.id === questId);
      
      if (!quest || quest.completed) return prev;
      
      const xpGain = 10;
      const newTotalXP = prev.totalXP + xpGain;
      
      return {
        ...prev,
        totalXP: newTotalXP,
        level: calculateLevel(newTotalXP),
        attributes: {
          ...prev.attributes,
          [quest.attribute]: prev.attributes[quest.attribute] + xpGain
        },
        sagas: prev.sagas.map(s => 
          s.id === sagaId 
            ? { ...s, quests: s.quests.map(q => q.id === questId ? { ...q, completed: true } : q) }
            : s
        )
      };
    });
  };

  const addSaga = (name: string, rawText: string) => {
    const sagaId = `saga-${Date.now()}`;
    const quests = parseQuestsFromText(rawText, sagaId);
    
    setState(prev => ({
      ...prev,
      sagas: [...prev.sagas, {
        id: sagaId,
        name,
        rawText,
        quests,
        createdAt: new Date().toISOString()
      }]
    }));
  };

  const deleteSaga = (sagaId: string) => {
    setState(prev => ({
      ...prev,
      sagas: prev.sagas.filter(s => s.id !== sagaId)
    }));
  };

  const addMapPoint = (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => {
    setState(prev => {
      const newTotalXP = prev.totalXP + 15;
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          EXPL: prev.attributes.EXPL + 10
        },
        totalXP: newTotalXP,
        level: calculateLevel(newTotalXP),
        mapPoints: [...prev.mapPoints, {
          ...point,
          id: `point-${Date.now()}`,
          discoveredAt: new Date().toISOString()
        }]
      };
    });
  };

  const updatePlayerName = (name: string) => {
    setState(prev => ({ ...prev, playerName: name }));
  };

  const takeDamage = (amount: number) => {
    setState(prev => ({ ...prev, hp: Math.max(0, prev.hp - amount) }));
  };

  const heal = (amount: number) => {
    setState(prev => ({ ...prev, hp: Math.min(prev.maxHP, prev.hp + amount) }));
  };

  const isExhausted = state.hp < state.maxHP * 0.3;

  const todayStr = getTodayString();
  const todayQuests = state.sagas.flatMap(saga => 
    saga.quests.filter(q => q.day === todayStr || q.day === 'todos')
  );

  return (
    <GameContext.Provider value={{
      state,
      completeQuest,
      addSaga,
      deleteSaga,
      addMapPoint,
      updatePlayerName,
      takeDamage,
      heal,
      isExhausted,
      todayQuests
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
