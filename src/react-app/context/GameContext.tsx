import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- INTERFACES ---
export interface MapPhoto { url: string; timestamp: string; description?: string; }
export interface MapPoint { id: string; lat: number; lng: number; name: string; iconType: string; discoveredAt: string; photos: MapPhoto[]; }
export type AttributeKey = 'CON' | 'STR' | 'DEX' | 'INT' | 'WIS' | 'EXPL' | 'GOLD';
export interface Attributes { CON: number; STR: number; DEX: number; INT: number; WIS: number; EXPL: number; GOLD: number; }

// NOVA TIPAGEM DA TAVERNA
export type TavernSkin = 'sombrio' | 'rustico' | 're4' | 'cigana';

export interface GameState {
  playerName: string;
  level: number;
  totalXP: number;
  hp: number;
  maxHP: number;
  attributes: Attributes;
  mapPoints: MapPoint[];
  sagas: any[];
  // --- NOVAS VARIÁVEIS DA TAVERNA ---
  tavernSkin: TavernSkin;
  tavernTokens: number; 
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
  sagas: [],
  tavernSkin: 're4', // Skin inicial padrão
  tavernTokens: 3    // Começando com 3 fichas de brinde para a gente poder testar!
};

interface GameContextType {
  state: GameState;
  updatePlayerName: (name: string) => void;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => void;
  addMapPoint: (point: Omit<MapPoint, 'id' | 'discoveredAt'>) => void;
  addXP: (amount: number) => void;
  // --- NOVAS FUNÇÕES DA TAVERNA ---
  setTavernSkin: (skin: TavernSkin) => void;
  addTavernToken: (amount: number) => void;
  spendTavernToken: (amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Merge para garantir que usuários antigos recebam as novas variáveis da Taverna sem quebrar o save
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
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

  // --- CONTROLES DA TAVERNA ---
  const setTavernSkin = (skin: TavernSkin) => setState(prev => ({ ...prev, tavernSkin: skin }));
  
  const addTavernToken = (amount: number) => setState(prev => ({ 
    ...prev, tavernTokens: prev.tavernTokens + amount 
  }));
  
  const spendTavernToken = (amount: number) => setState(prev => ({ 
    ...prev, tavernTokens: Math.max(0, prev.tavernTokens - amount) 
  }));

  return (
    <GameContext.Provider value={{ 
      state, updatePlayerName, addGold, removeGold, addMapPoint, addXP,
      setTavernSkin, addTavernToken, spendTavernToken 
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame error');
  return context;
};
