import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Skull } from 'lucide-react';
import Mercador from '@/react-app/Mercador'; // O componente que criamos!

const LOOT_TABLE = [
  "Vale 1 Hambúrguer sem culpa",
  "1 Hora extra de videogame",
  "Pular o treino de perna hoje",
  "Comprar um jogo na Steam"
];

export default function TavernPage() {
  const { state, spendTavernToken } = useGame();
  const skin = state.tavernSkin;
  const fichas = state.tavernTokens;

  const [reward, setReward] = useState<string | null>(null);

  // Essa função será chamada pelo componente Mercador no momento exato do clique
  const handleGerarRecompensa = () => {
    if (fichas > 0) {
      spendTavernToken(1); // Gasta a ficha
      const randomReward = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
      setReward(randomReward);
      return randomReward;
    }
    return null;
  };

  return (
    <AppShell>
      {/* Container Principal da Taverna */}
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        
        {/* HEADER: Fichas e Nome (Z-INDEX ALTO para ficar na frente de tudo) */}
        <div className="absolute top-4 left-4 z-50 flex flex-col items-start">
          <h1 className="font-pixel text-primary text-lg tracking-widest drop-shadow-md">
            {skin === 're4' ? "MERCADO NEGRO" : "TAVERNA"}
          </h1>
          <div className="flex items-center gap-2 mt-1 bg-black/80 p-2 border border-primary/30 rounded">
            <Skull className="w-4 h-4 text-purple-500" />
            <span className={`font-pixel text-xs ${fichas > 0 ? 'text-purple-400' : 'text-red-500'}`}>
              FICHAS: {fichas}
            </span>
          </div>
        </div>

        {/* O PALCO DO MERCADOR */}
        <div className="w-full h-full flex items-center justify-center">
          {skin === 're4' ? (
            <Mercador 
              recompensa={reward} 
              onTrocarFicha={handleGerarRecompensa}
              podeAbrir={fichas > 0} 
            />
          ) : (
            <p className="font-pixel text-white">Skin em construção...</p>
          )}
        </div>

        {/* MENSAGEM DE ERRO SE NÃO TIVER FICHAS */}
        {!reward && fichas <= 0 && (
            <div className="absolute bottom-10 z-50 bg-black/80 p-2 border border-red-500">
                <p className="font-pixel text-[10px] text-red-500 uppercase">
                    O mercado não aceita fiado, stranger...
                </p>
            </div>
        )}
      </div>
    </AppShell>
  );
}
