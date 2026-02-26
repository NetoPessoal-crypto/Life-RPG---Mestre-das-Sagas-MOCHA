import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- INTERFACES ---
export interface Quest { id: string; title: string; attribute: AttributeKey; completed: boolean; day: string; }
export interface Saga { id: string; name: string; rawText: string; quests: Quest[]; createdAt: string; }
export interface MapPhoto { url: string; timestamp: string; description?: string; }
export interface MapPoint { 
  id: string; 
  lat: number; 
  lng: number; 
  name: string; 
  iconType: string; // Guarda o ícone escolhido pelo Neto
  discoveredAt: string; 
  photos: MapPhoto[]; 
}
export type AttributeKey = 'CON' | 'STR' | 'DEX' | 'INT' | 'WIS' | 'EXPL' | 'GOLD';
export interface Attributes { CON: number; STR: number; DEX: number; INT: number; WIS: number; EXPL: number; GOLD: number; }
export interface GameState { playerName: string; level: number; totalXP: number; hp: number; maxHP: number; attributes: Attributes; sagas: Saga[]; mapPoints: MapPoint[]; lastCheckDate: string; }

const STORAGE_KEY = 'life-rpg-state-v2'; // Versão 2 para garantir limpeza de lixo antigo

const defaultState: GameState = {
  playerName: 'Neto',
  level: 1,
  totalXP: 0,
  hp: 100,
  maxHP: 100,
  attributes: { CON: 10, STR: 10, DEX: 10, INT: 10, WIS: 10, EXPL: 10, GOLD: 0 },
  sagas: [],
  mapPoints: [],
  lastCheckDate: new Date().toISOString().split('T')[0]
};

interface GameContextType {
  state: GameState;
  completeQuest: (questId: string, sagaId: string) => void;
  addSaga: (name: string, rawText: string) => void;
  deleteSaga: (sagaId: string) => void;
  addMapPoint: (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => void;
  addPhotoToPoint: (pointId: string, photoUrl: string, description?: string) => void;
  updatePlayerName: (name: string) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  isExhausted: boolean;
  todayQuests: Quest[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultState;
    } catch { return defaultState; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { console.error("Erro ao salvar no LocalStorage", e); }
  }, [state]);

  const addMapPoint = (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => {
    setState(prev => ({
      ...prev,
      totalXP: prev.totalXP + 25,
      attributes: { ...prev.attributes, EXPL: prev.attributes.EXPL + 15 },
      mapPoints: [...prev.mapPoints, { ...point, id: `point-${Date.now()}`, discoveredAt: new Date().toISOString() }]
    }));
  };

  const addPhotoToPoint = (pointId: string, photoUrl: string, description?: string) => {
    setState(prev => ({
      ...prev,
      totalXP: prev.totalXP + 15,
      mapPoints: prev.mapPoints.map(p => 
        p.id === pointId ? { ...p, photos: [...p.photos, { url: photoUrl, timestamp: new Date().toISOString(), description }] } : p
      )
    }));
  };

  const completeQuest = (qId: string, sId: string) => {
    setState(prev => ({ ...prev, totalXP: prev.totalXP + 10, sagas: prev.sagas.map(s => s.id === sId ? { ...s, quests: s.quests.map(q => q.id === qId ? { ...q, completed: true } : q) } : s) }));
  };

  const addSaga = (name: string, text: string) => {
    const sagaId = `saga-${Date.now()}`;
    setState(prev => ({ ...prev, sagas: [...prev.sagas, { id: sagaId, name, rawText: text, quests: [], createdAt: new Date().toISOString() }] }));
  };

  const deleteSaga = (id: string) => setState(prev => ({ ...prev, sagas: prev.sagas.filter(s => s.id !== id) }));
  const updatePlayerName = (n: string) => setState(prev => ({ ...prev, playerName: n }));
  const takeDamage = (a: number) => setState(prev => ({ ...prev, hp: Math.max(0, prev.hp - a) }));
  const heal = (a: number) => setState(prev => ({ ...prev, hp: Math.min(prev.maxHP, prev.hp + a) }));
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
  if (!context) throw new Error('GameContext must be used within GameProvider');
  return context;
};
