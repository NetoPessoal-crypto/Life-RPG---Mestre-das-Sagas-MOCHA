import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Skull } from 'lucide-react';

type TavernSkin = 'sombrio' | 'rustico' | 're4' | 'cigana';

export default function TavernPage() {
  const { state } = useGame();
  const [skin, setSkin] = useState<TavernSkin>('re4'); // Começando com o RE4 que você pediu!

  // Saldo de mentira só para montarmos a tela (depois ligamos no real)
  const fichas = 3; 

  return (
    <AppShell>
      <div className="relative min-h-[85vh] p-4 flex flex-col items-center justify-center overflow-hidden">
        
        {/* SELETOR DE SKINS (Apenas para nossos testes) */}
        <div className="absolute top-2 right-2 flex gap-1 z-50">
          <button onClick={() => setSkin('sombrio')} className={`px-2 py-1 text-[8px] font-pixel border ${skin === 'sombrio' ? 'bg-primary text-black' : 'border-primary/50 text-primary'}`}>Sombrio</button>
          <button onClick={() => setSkin('rustico')} className={`px-2 py-1 text-[8px] font-pixel border ${skin === 'rustico' ? 'bg-primary text-black' : 'border-primary/50 text-primary'}`}>Rústico</button>
          <button onClick={() => setSkin('re4')} className={`px-2 py-1 text-[8px] font-pixel border ${skin === 're4' ? 'bg-primary text-black' : 'border-primary/50 text-primary'}`}>RE4</button>
          <button onClick={() => setSkin('cigana')} className={`px-2 py-1 text-[8px] font-pixel border ${skin === 'cigana' ? 'bg-primary text-black' : 'border-primary/50 text-primary'}`}>Cigana</button>
        </div>

        {/* HEADER DA TAVERNA: SALDO DE FICHAS */}
        <div className="absolute top-4 left-4 z-40 flex flex-col items-start">
          <h1 className="font-pixel text-primary text-lg tracking-widest drop-shadow-md">MERCADO NEGRO</h1>
          <div className="flex items-center gap-2 mt-1 bg-black/50 p-2 border border-primary/30 rounded">
            <Skull className="w-4 h-4 text-purple-500" />
            <span className="font-pixel text-xs text-purple-400">FICHAS: {fichas}</span>
          </div>
        </div>

        {/* ÁREA DO MERCADOR (Aqui vamos desenhar o RE4) */}
        <div className="w-full max-w-sm mt-16 flex flex-col items-center">
          <p className="font-pixel text-xs text-muted-foreground animate-pulse text-center">
            {skin === 're4' && "What're ya buyin', stranger?"}
            {skin === 'sombrio' && "O destino cobra seu preço..."}
            {skin === 'rustico' && "Uma bebida e uma história?"}
            {skin === 'cigana' && "As cartas não mentem, herói."}
          </p>

          <div className="w-48 h-48 border-2 border-dashed border-primary/20 mt-8 flex items-center justify-center rounded-lg">
             {/* ESPAÇO ONDE A ARTE CSS VAI ENTRAR */}
             <span className="font-pixel text-[10px] text-primary/40">ARTE: {skin.toUpperCase()}</span>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
