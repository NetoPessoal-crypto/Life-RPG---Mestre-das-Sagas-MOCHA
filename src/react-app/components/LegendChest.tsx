import { useState } from 'react';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

// BAÚ EM PURO CSS
const ChestIcon = ({ open, empty }: { open: boolean, empty: boolean }) => (
  <div className="relative w-20 h-16 flex flex-col items-center mt-2">
    <div className={`w-20 h-6 bg-[#8b5a2b] border-2 border-black rounded-t-xl origin-bottom transition-transform duration-500 z-20 ${open ? '-translate-y-2 -rotate-12 scale-y-75 brightness-75' : ''}`}>
      <div className="absolute top-0 left-3 w-3 h-full bg-[#222] border-x border-black" />
      <div className="absolute top-0 right-3 w-3 h-full bg-[#222] border-x border-black" />
    </div>
    
    {open && !empty && (
      <div className="absolute top-3 w-16 h-8 bg-yellow-500 rounded-full animate-pulse blur-[4px] z-10" />
    )}
    
    {open && empty && (
      <div className="absolute top-4 w-16 h-4 bg-black rounded-full z-10 opacity-50" />
    )}

    <div className="w-20 h-10 bg-[#5c4026] border-2 border-black border-t-0 relative z-30">
      <div className="absolute top-0 left-3 w-3 h-full bg-[#222] border-x border-black" />
      <div className="absolute top-0 right-3 w-3 h-full bg-[#222] border-x border-black" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#d4a853] border-2 border-black rounded-sm flex items-center justify-center shadow-lg">
         <div className="w-1.5 h-2.5 bg-black rounded-sm" />
      </div>
    </div>
  </div>
);

export default function LegendChest() {
  const { state, addGold, removeGold } = useGame();
  const [goldInput, setGoldInput] = useState('');
  const [isAnimating, setIsAnimating] = useState<'gain' | 'loss' | null>(null);

  const gold = state.attributes.GOLD;

  const handleAction = (type: 'gain' | 'loss') => {
    const val = Number(goldInput);
    if (val <= 0) return;

    if (type === 'gain') {
      addGold(val);
      setIsAnimating('gain');
    } else {
      removeGold(val);
      setIsAnimating('loss');
    }
    setGoldInput('');
    setTimeout(() => setIsAnimating(null), 1000);
  };

  return (
    <section className="relative mt-8">
      {/* DIVISOR MOCHA */}
      <h2 className="font-pixel text-xs text-muted-foreground mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-primary/30" />
        BAÚ DE TESOURO
        <span className="flex-1 h-px bg-primary/30" />
      </h2>

      <div className={`bg-card border border-primary/20 p-6 rounded-lg relative overflow-hidden transition-all ${isAnimating === 'loss' ? 'animate-shake border-red-500' : ''}`}>
        
        {/* FLASH DE DANO */}
        {isAnimating === 'loss' && (
          <div className="absolute inset-0 bg-red-500/20 pointer-events-none animate-pulse" />
        )}

        <div className="flex flex-col items-center gap-6">
          
          <div className="relative w-full h-24 flex items-center justify-center">
            
            <ChestIcon open={gold <= 0 || gold > 0} empty={gold <= 0} />

            {/* MOSCAS EM PIXEL ART (QUADRADOS PRETOS) */}
            {gold <= 0 && (
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-40">
                 <div className="absolute -top-2 ml-4 w-1.5 h-1.5 bg-black animate-bounce" />
                 <div className="absolute top-2 -ml-8 w-1 h-1 bg-black animate-pulse delay-75" />
                 <div className="absolute top-4 ml-8 w-1.5 h-1.5 bg-black animate-bounce delay-150" />
              </div>
            )}

            {/* CRISTAIS/MOEDAS EM PIXEL ART (QUADRADOS COLORIDOS) */}
            {gold > 1000 && (
               <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-40">
                  <div className="absolute -top-4 -ml-12 w-3 h-3 bg-yellow-400 border border-yellow-600 rotate-45 animate-bounce" />
                  <div className="absolute -top-2 ml-12 w-2 h-2 bg-cyan-400 border border-cyan-600 rotate-45 animate-bounce delay-150" />
               </div>
            )}

            {/* CHUVA DE MOEDAS (PIXELS DOURADOS) */}
            {isAnimating === 'gain' && (
              <div className="absolute inset-0 flex justify-center pointer-events-none z-50">
                <div className="coin-rain">
                  <div className="w-3 h-3 bg-yellow-400 border border-yellow-600" />
                  <div className="w-3 h-3 bg-yellow-400 border border-yellow-600 mt-2" />
                  <div className="w-3 h-3 bg-yellow-400 border border-yellow-600" />
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-2">
            <p className="font-pixel text-[24px] text-yellow-500 drop-shadow-md">
              {gold.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            {gold <= 0 && <p className="font-pixel text-[8px] text-red-500 mt-2 uppercase tracking-widest">O herói está sem fundos!</p>}
          </div>

          <div className="w-full flex gap-2">
            <input 
              type="number" 
              value={goldInput}
              onChange={(e) => setGoldInput(e.target.value)}
              placeholder="VALOR..."
              className="flex-1 bg-background border border-primary/20 p-2 text-foreground font-pixel text-[10px] outline-none text-center rounded-sm focus:border-primary/50 transition-colors"
            />
            <Button onClick={() => handleAction('gain')} className="bg-green-900/20 border border-green-500/50 text-green-500 hover:bg-green-900/40 h-10 px-4">
              <TrendingUp size={16} />
            </Button>
            <Button onClick={() => handleAction('loss')} className="bg-red-900/20 border border-red-500/50 text-red-500 hover:bg-red-900/40 h-10 px-4">
              <TrendingDown size={16} />
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25%, 75% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out; }
        
        .coin-rain {
          animation: drop 1s forwards;
          position: absolute;
          top: -20px;
          display: flex;
          gap: 12px;
        }
        @keyframes drop {
          0% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(80px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
