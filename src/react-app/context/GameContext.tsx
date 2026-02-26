import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- INTERFACES ---
export interface MapPhoto { url: string; timestamp: string; description?: string; }
export interface MapPoint { id: string; lat: number; lng: number; name: string; iconType: string; discoveredAt: string; photos: MapPhoto[]; }
export type AttributeKey = 'CON' | 'STR' | 'DEX' | 'INT' | 'WIS' | 'EXPL' | 'GOLD';
export interface Attributes { CON: number; STR: number; DEX: number; INT: number; WIS: number; EXPL: number; GOLD: number; }

export interface GameState {
  playerName: string;
  level: number;
  totalXP: number;
  hp: number;
  maxHP: number;
  attributes: Attributes;
  mapPoints: MapPoint[];
  sagas: any[];
}

const STORAGE_KEY = 'life-rpg-state-v3';

// LÓGICA DE TÍTULOS POR NÍVEL
export const getPlayerTitle = (level: number) => {
  if (level <= 5) return "RECRUTA ZERO";
  if (level <= 10) return "EXPLORADOR VAGANTE";
  if (level <= 20) return "GUERREIRO VETERANO";
  if (level <= 40) return "MESTRE DAS SAGAS";
  return "LENDA VIVA";
};

const defaultState: GameState = {
  playerName: 'Neto',
  level: 1,
  totalXP: 0,
  hp: 100,
  maxHP: 100,
  attributes: { CON: 10, STR: 10, DEX: 10, INT: 10, WIS: 10, EXPL: 10, GOLD: 0 },
  mapPoints: [],
  sagas: []
};

interface GameContextType {
  state: GameState;
  updatePlayerName: (name: string) => void;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => void;
  addMapPoint: (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => void;
  addXP: (amount: number) => void;
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

  const updatePlayerName = (playerName: string) => setState(prev => ({ ...prev, playerName }));
  
  const addGold = (amount: number) => setState(prev => ({ 
    ...prev, attributes: { ...prev.attributes, GOLD: prev.attributes.GOLD + amount } 
  }));

  const removeGold = (amount: number) => setState(prev => ({ 
    ...prev, attributes: { ...prev.attributes, GOLD: Math.max(0, prev.attributes.GOLD - amount) } 
  }));

  const addXP = (amount: number) => setState(prev => {
    const newXP = prev.totalXP + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    return { ...prev, totalXP: newXP, level: newLevel };
  });

  const addMapPoint = (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => {
    setState(prev => ({
      ...prev,
      totalXP: prev.totalXP + 25,
      level: Math.floor((prev.totalXP + 25) / 100) + 1,
      attributes: { ...prev.attributes, EXPL: prev.attributes.EXPL + 15 },
      mapPoints: [...prev.mapPoints, { ...point, id: `point-${Date.now()}`, discoveredAt: new Date().toISOString() }]
    }));
  };

  return (
    <GameContext.Provider value={{ state, updatePlayerName, addGold, removeGold, addMapPoint, addXP }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame error');
  return context;
};
