import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Sword, Brain, Map, Heart, Flame } from 'lucide-react';

export default function ProfilePage() {
  const { state } = useGame();

  const stats = [
    { label: 'STR', val: state.attributes.STR, i: 0 },
    { label: 'INT', val: state.attributes.INT, i: 1 },
    { label: 'EXPL', val: state.attributes.EXPL, i: 2 },
    { label: 'CON', val: state.attributes.CON, i: 3 },
    { label: 'WIS', val: state.attributes.WIS, i: 4 },
  ];

  const getCoords = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const dist = (Math.min(val, 100) / 100) * 70; 
    return { x: 100 + dist * Math.cos(angle), y: 100 + dist * Math.sin(angle) };
  };

  const radarPoints = stats.map((s, i) => {
    const c = getCoords(s.val, i);
    return `${c.x},${c.y}`;
  }).join(' ');

  return (
    <AppShell>
      <div className="p-4 space-y-8 text-[#d4a853]">
        <h2 className="font-pixel text-[10px] text-center border-b border-[#d4a853]/20 pb-2">FICHA DO PERSONAGEM</h2>
        
        {/* GRÁFICO DE TEIA */}
        <div className="bg-black/40 border-2 border-[#d4a853]/10 rounded-lg p-4 flex flex-col items-center">
           <svg width="200" height="200" viewBox="0 0 200 200">
             {[0.2, 0.4, 0.6, 0.8, 1].map(t => (
               <polygon key={t} points={stats.map((_, i) => { const c = getCoords(100*t, i); return `${c.x},${c.y}`; }).join(' ')} fill="none" stroke="rgba(212,168,83,0.1)" />
             ))}
             <polygon points={radarPoints} fill="rgba(212,168,83,0.3)" stroke="#d4a853" strokeWidth="2" />
           </svg>
           <div className="flex gap-4 mt-4 opacity-50">
             <Sword size={14}/> <Brain size={14}/> <Map size={14}/> <Heart size={14}/> <Flame size={14}/>
           </div>
        </div>

        {/* LISTA DE ATRIBUTOS */}
        <div className="space-y-4">
          {stats.map(s => (
            <div key={s.label} className="space-y-1">
              <div className="flex justify-between font-pixel text-[8px]">
                <span>{s.label}</span>
                <span>{s.val}</span>
              </div>
              <div className="h-2 w-full bg-black border border-[#d4a853]/20">
                <div className="h-full bg-[#d4a853]/60 shadow-[0_0_5px_#d4a853]" style={{ width: `${s.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
