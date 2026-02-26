import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame, getPlayerTitle } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { User, Shield, Zap, Coins, TrendingUp, TrendingDown, Edit2, Check, Brain, Sword, Map, Heart, Flame } from 'lucide-react';

export default function DashboardPage() {
  const { state, updatePlayerName, addGold, removeGold } = useGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(state.playerName);
  const [goldValue, setGoldValue] = useState('');

  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpPercent = (state.totalXP % 100);

  // Lista simples apenas com os dados
  const stats = [
    { label: 'STR', val: state.attributes.STR, id: 0 },
    { label: 'INT', val: state.attributes.INT, id: 1 },
    { label: 'EXPL', val: state.attributes.EXPL, id: 2 },
    { label: 'CON', val: state.attributes.CON, id: 3 },
    { label: 'WIS', val: state.attributes.WIS, id: 4 },
  ];

  const getCoordinates = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const distance = (Math.min(val, 100) / 100) * 70; 
    return { x: 100 + distance * Math.cos(angle), y: 100 + distance * Math.sin(angle) };
  };

  const radarPoints = stats.map((s, i) => {
    const c = getCoordinates(s.val, i);
    return `${c.x},${c.y}`;
  }).join(' ');

  return (
    <AppShell>
      <div className="p-4 space-y-6 pb-24">
        {/* PERFIL */}
        <div className="bg-card border-2 border-primary/20 rounded-lg p-5 flex gap-4 items-center shadow-xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-full border-4 border-primary/40 bg-black flex items-center justify-center">
            <User size={40} className="text-primary opacity-80" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex gap-1 items-center bg-black border border-primary/30 p-1 rounded">
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-transparent text-white font-pixel text-[10px] w-24 outline-none" />
                  <button onClick={() => { updatePlayerName(newName); setIsEditingName(false); }} className="text-green-500"><Check size={14}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-pixel text-white text-[11px] uppercase">{state.playerName}</h2>
                  <button onClick={() => setIsEditingName(true)} className="text-primary/40 hover:text-primary"><Edit2 size={12}/></button>
                </div>
              )}
            </div>
            <div className="bg-primary/10 border border-primary/20 px-2 py-0.5 inline-block rounded">
              <p className="font-pixel text-primary text-[7px] uppercase tracking-widest">{getPlayerTitle(state.level)}</p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 bg-black border border-red-900/50 rounded-sm overflow-hidden p-[1px]">
                  <div className="h-full bg-red-600" style={{ width: `${hpPercent}%` }} />
                </div>
                <span className="font-pixel text-[7px] text-red-500">{state.hp} HP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-black border border-blue-900/50 rounded-sm overflow-hidden p-[1px]">
                  <div className="h-full bg-blue-500" style={{ width: `${xpPercent}%` }} />
                </div>
                <span className="font-pixel text-[7px] text-blue-400">LV {state.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* GOLD */}
        <div className="bg-card border-2 border-primary/20 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <div><p className="font-pixel text-[7px] text-primary/60 uppercase">Tesouro</p><h3 className="font-pixel text-[14px] text-yellow-500">{state.attributes.GOLD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3></div>
            <Coins className="text-yellow-500/30" size={24} />
          </div>
          <div className="flex gap-2">
            <input type="number" value={goldValue} onChange={(e) => setGoldValue(e.target.value)} placeholder="VALOR..." className="flex-1 bg-black border border-primary/20 p-2 text-white font-pixel text-[9px] outline-none" />
            <Button onClick={() => { addGold(Number(goldValue)); setGoldValue(''); }} className="bg-green-600/20 text-green-500 border border-green-500/30 h-10 px-4"><TrendingUp size={16} /></Button>
            <Button onClick={() => { removeGold(Number(goldValue)); setGoldValue(''); }} className="bg-red-600/20 text-red-500 border border-red-500/30 h-10 px-4"><TrendingDown size={16} /></Button>
          </div>
        </div>

        {/* ATRIBUTOS */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card border-2 border-primary/20 rounded-lg p-4 flex flex-col items-center min-h-[220px]">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {[0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
                <polygon key={tick} points={stats.map((_, i) => { const c = getCoordinates(100 * tick, i); return `${c.x},${c.y}`; }).join(' ')} fill="none" stroke="rgba(212,168,83,0.1)" strokeWidth="1" />
              ))}
              <polygon points={radarPoints} fill="rgba(212,168,83,0.3)" stroke="#d4a853" strokeWidth="2" />
            </svg>
            <div className="flex gap-4 mt-2">
              <Sword size={12} className="text-red-500" />
              <Brain size={12} className="text-blue-500" />
              <Map size={12} className="text-green-500" />
              <Heart size={12} className="text-pink-500" />
              <Flame size={12} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
