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

  // Cálculos de Status
  const hpPercent = (state.hp / state.maxHP) * 100;
  const xpNextLevel = 100; // Sistema simples de 100 XP por nível
  const xpPercent = (state.totalXP % xpNextLevel);

  // --- LÓGICA DO GRÁFICO DE TEIA (SVG) ---
  const stats = [
    { label: 'STR', val: state.attributes.STR, icon: <Sword size={10}/> },
    { label: 'INT', val: state.attributes.INT, icon: <Brain size={10}/> },
    { label: 'EXPL', val: state.attributes.EXPL, icon: <Map size={10}/> },
    { label: 'CON', val: state.attributes.CON, icon: <Heart size={10}/> },
    { label: 'WIS', val: state.attributes.WIS, icon: <Flame size={10}/> },
  ];

  const centerX = 100;
  const centerY = 100;
  const radius = 70;

  const getCoordinates = (val: number, i: number, total: number) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const distance = (val / 100) * radius; // Supondo cap de 100 para o gráfico
    return {
      x: centerX + distance * Math.cos(angle),
      y: centerY + distance * Math.sin(angle)
    };
  };

  const radarPoints = stats.map((s, i) => {
    const coords = getCoordinates(s.val, i, stats.length);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  const handleSaveName = () => {
    updatePlayerName(newName);
    setIsEditingName(false);
  };

  return (
    <AppShell>
      <div className="p-4 space-y-6 pb-24">
        
        {/* HEADER DO HERÓI */}
        <div className="bg-card border-2 border-primary/20 rounded-lg p-5 flex gap-4 items-center shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="w-20 h-20 rounded-full border-4 border-primary/40 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(212,168,83,0.2)]">
            <User size={40} className="text-primary opacity-80" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex gap-1 items-center bg-black border border-primary/30 p-1 rounded">
                  <input 
                    value={newName} onChange={(e) => setNewName(e.target.value)}
                    className="bg-transparent text-white font-pixel text-[10px] w-24 outline-none"
                  />
                  <button onClick={handleSaveName} className="text-green-500 p-1"><Check size={14}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-pixel text-white text-[11px] uppercase tracking-tighter">{state.playerName}</h2>
                  <button onClick={() => setIsEditingName(true)} className="text-primary/40 hover:text-primary"><Edit2 size={12}/></button>
                </div>
              )}
            </div>
            
            <div className="bg-primary/10 border border-primary/20 px-2 py-0.5 inline-block rounded">
              <p className="font-pixel text-primary text-[7px] tracking-widest uppercase">
                {getPlayerTitle(state.level)}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              {/* HP BAR */}
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 bg-black/50 border border-red-900/50 rounded-sm overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_8px_rgba(220,38,38,0.4)] transition-all duration-700" 
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
                <span className="font-pixel text-[7px] text-red-500 w-8">{state.hp} HP</span>
              </div>

              {/* XP BAR */}
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-black/50 border border-blue-900/50 rounded-sm overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-700 to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-700" 
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="font-pixel text-[7px] text-blue-400 w-8">LV {state.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLE DE CAIXA (GOLD) */}
        <div className="bg-card border-2 border-primary/20 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <div>
              <p className="font-pixel text-[7px] text-primary/60 uppercase">Tesouro Acumulado</p>
              <h3 className="font-pixel text-[15px] text-yellow-500 mt-1">
                {state.attributes.GOLD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <Coins className="text-yellow-500/30 mb-1" size={30} />
          </div>
          
          <div className="flex gap-2">
            <input 
              type="number" value={goldValue} onChange={(e) => setGoldValue(e.target.value)}
              placeholder="VALOR EM R$..."
              className="flex-1 bg-black border border-primary/20 p-3 text-white font-pixel text-[9px] outline-none focus:border-primary/50"
            />
            <Button 
              onClick={() => { addGold(Number(goldValue)); setGoldValue(''); }}
              className="bg-green-600/10 text-green-500 border border-green-500/30 hover:bg-green-600/30 h-12"
            >
              <TrendingUp size={18} />
            </Button>
            <Button 
              onClick={() => { removeGold(Number(goldValue)); setGoldValue(''); }}
              className="bg-red-600/10 text-red-500 border border-red-500/30 hover:bg-red-600/30 h-12"
            >
              <TrendingDown size={18} />
            </Button>
          </div>
        </div>

        {/* ÁREA DE ATRIBUTOS (TEIA + LISTA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* GRÁFICO DE TEIA */}
          <div className="bg-card border-2 border-primary/20 rounded-lg p-4 flex flex-col items-center justify-center relative min-h-[220px]">
            <p className="absolute top-3 left-3 font-pixel text-[7px] text-primary/40 uppercase">Evolução Radial</p>
            
            <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-[0_0_10px_rgba(212,168,83,0.2)]">
              {/* Teias de Fundo */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
                <polygon
                  key={tick}
                  points={stats.map((_, i) => {
                    const c = getCoordinates(100 * tick, i, stats.length);
                    return `${c.x},${c.y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(212,168,83,0.1)"
                  strokeWidth="1"
                />
              ))}
              {/* Eixos */}
              {stats.map((_, i) => {
                const c = getCoordinates(100, i, stats.length);
                return (
                  <line key={i} x1={centerX} y1={centerY} x2={c.x} y2={c.y} stroke="rgba(212,168,83,0.1)" strokeWidth="1" />
                );
              })}
              {/* Área do Herói */}
              <polygon
                points={radarPoints}
                fill="rgba(212,168,83,0.3)"
                stroke="#d4a853"
                strokeWidth="2"
                className="animate-pulse"
              />
              {/* Rótulos dos Ícones */}
              {stats.map((s, i) => {
                const c = getCoordinates(120, i, stats.length);
                return (
                  <foreignObject key={i} x={c.x - 10} y={c.y - 10} width="20" height="20">
                    <div className="text-primary/60 flex items-center justify-center">{s.icon}</div>
                  </foreignObject>
                );
              })}
            </svg>
          </div>

          {/* LISTA DE BARRAS DE ATRIBUTO */}
          <div className="bg-card border-2 border-primary/20 rounded-lg p-4 space-y-3">
            <p className="font-pixel text-[7px] text-primary/40 uppercase mb-2">Poderes Básicos</p>
            {stats.map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-pixel text-[8px] text-white/70">{s.label}</span>
                  <span className="font-pixel text-[8px] text-primary">{s.val}</span>
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary/60 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(s.val, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </AppShell>
  );
}
