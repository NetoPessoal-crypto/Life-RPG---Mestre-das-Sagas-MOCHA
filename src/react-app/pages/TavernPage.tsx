import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Skull } from 'lucide-react';
import Mercador from '@/react-app/Mercador';

const LOOT_TABLE = [
  "Vale 1 Hambúrguer sem culpa",
  "1 Hora extra de videogame",
  "Pular o treino de perna hoje",
  "Comprar um jogo na Steam"
];

export default function TavernPage() {
  const { state, spendTavernToken } = useGame(); // Pegue aqui sua função de salvar saga se ela existir
  const [reward, setReward] = useState<string | null>(null);

  const skin = state.tavernSkin;
  const fichas = state.tavernTokens;

  // Função disparada no PRIMEIRO clique (abre a maleta)
  const handleGerarRecompensa = () => {
    if (fichas > 0) {
      spendTavernToken(1);
      const randomReward = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
      setReward(randomReward);
    }
  };

  // Função disparada no SEGUNDO clique (salva e some com o Mercador)
  const handleFinalizarEncontro = () => {
    if (reward) {
      // LOGICA PARA SALVAR NA SAGA
      console.log(`Salvando "${reward}" no campo de Sagas...`);
      
      // Se você tiver uma função no GameContext para adicionar sagas, chame-a aqui.
      // Exemplo: addSaga(`Ganhou: ${reward}`);

      setReward(null); // Limpa o estado para o Mercador entender que acabou
    }
  };

  return (
    <AppShell>
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">

        {/* HEADER DA TAVERNA */}
        <div className="absolute top-4 left-4 z-50 flex flex-col items-start">
          <h1 className="font-pixel text-primary text-lg tracking-widest drop-shadow-md">
            {skin === 're4' && "MERCADO NEGRO"}
            {skin !== 're4' && "TAVERNA"}
          </h1>
          <div className="flex items-center gap-2 mt-1 bg-black/80 p-2 border border-primary/30 rounded">
            <Skull className="w-4 h-4 text-purple-500" />
            <span className={`font-pixel text-xs ${fichas > 0 ? 'text-purple-400' : 'text-red-500'}`}>
              FICHAS: {fichas}
            </span>
          </div>
        </div>

        {/* ÁREA DO MERCADOR ANIMADO */}
        <div className="w-full h-full flex items-center justify-center">
          {skin === 're4' ? (
            <Mercador 
              recompensa={reward} 
              onTrocarFicha={handleGerarRecompensa}
              onFinalizar={handleFinalizarEncontro}
              podeAbrir={fichas > 0} 
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="font-pixel text-white">Skin em construção...</p>
            </div>
          )}
        </div>

        {/* FEEDBACK CASO NÃO TENHA FICHAS */}
        {!reward && fichas <= 0 && (
          <div className="absolute bottom-10 z-50 bg-black/90 p-4 border-2 border-red-500 animate-bounce">
            <p className="font-pixel text-[10px] text-red-500 uppercase tracking-tighter">
              Sem fichas? Hehehe... Stranger, volte quando tiver ouro.
            </p>
          </div>
        )}

      </div>
    </AppShell>
  );
}
