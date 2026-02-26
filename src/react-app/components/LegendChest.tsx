import { useState } from 'react';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { TrendingUp, TrendingDown, Package, PackageOpen } from 'lucide-react';

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
      {/* DIVISOR ESTÉTICA MOCHA */}
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

        <div className="flex flex-col items-center gap-4">
          
          {/* O BAÚ E AS ANIMAÇÕES */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {gold <= 0 ? (
              <div className="relative">
                <PackageOpen size={60} className="text-muted-foreground/30" />
                {/* MOSCAS */}
                <div className="absolute -top-2 left-0 w-full flex justify-around">
                   <span className="animate-bounce text-[10px]">🪰</span>
                   <span className="animate-pulse text-[8px] delay-75">🪰</span>
                </div>
              </div>
            ) : gold > 1000 ? (
              <div className="relative">
                <PackageOpen size={60} className="text-yellow-500" />
                <div className="absolute -top-4 -left-2 text-yellow-400 animate-bounce">💰</div>
                <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce delay-150">💎</div>
              </div>
            ) : (
              <Package size={60} className="text-primary/60" />
            )}

            {/* CHUVA DE MOEDAS */}
            {isAnimating === 'gain' && (
              <div className="absolute inset-0 flex justify-center pointer-events-none">
                <div className="coin-rain">🪙 🪙 🪙</div>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="font-pixel text-[20px] text-yellow-500">
              {gold.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            {gold <= 0 && <p className="font-pixel text-[8px] text-red-500 mt-1 uppercase">O herói está sem fundos!</p>}
          </div>

          {/* CONTROLES */}
          <div className="w-full flex gap-2 mt-2">
            <input 
              type="number" 
              value={goldInput}
              onChange={(e) => setGoldInput(e.target.value)}
              placeholder="VALOR..."
              className="flex-1 bg-background border border-border p-2 text-foreground font-pixel text-[10px] outline-none text-center rounded-md"
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
          font-size: 20px;
          display: flex;
          gap: 4px;
        }
        @keyframes drop {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(60px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
