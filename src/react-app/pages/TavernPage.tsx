import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Skull } from 'lucide-react';

// LISTA TEMPORÁRIA DE RECOMPENSAS (Depois vamos puxar das suas configurações)
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

  // Estados da Animação
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<string | null>(null);

  const handleBuy = () => {
    if (fichas <= 0 || isOpening) return;
    
    spendTavernToken(1);
    setIsOpening(true);
    setReward(null);

    // Tempo para a maleta cair e abrir
    setTimeout(() => {
      const randomReward = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
      setReward(randomReward);
    }, 1500);

    // Fecha o casaco depois de 5 segundos
    setTimeout(() => {
      setIsOpening(false);
      setReward(null);
    }, 5000);
  };

  return (
    <AppShell>
      <div className="relative min-h-[85vh] p-4 flex flex-col items-center justify-center overflow-hidden">

        {/* HEADER DA TAVERNA */}
        <div className="absolute top-4 left-4 z-40 flex flex-col items-start">
          <h1 className="font-pixel text-primary text-lg tracking-widest drop-shadow-md">
            {skin === 're4' && "MERCADO NEGRO"}
            {skin === 'sombrio' && "O VAZIO"}
            {skin === 'rustico' && "TAVERNA DO HERÓI"}
            {skin === 'cigana' && "TENDA DO DESTINO"}
          </h1>
          <div className="flex items-center gap-2 mt-1 bg-black/50 p-2 border border-primary/30 rounded">
            <Skull className="w-4 h-4 text-purple-500" />
            <span className={`font-pixel text-xs ${fichas > 0 ? 'text-purple-400' : 'text-red-500'}`}>
              FICHAS: {fichas}
            </span>
          </div>
        </div>

        {/* ÁREA DO MERCADOR */}
        <div className="w-full max-w-sm mt-16 flex flex-col items-center">
          <p className="font-pixel text-xs text-muted-foreground animate-pulse text-center h-4">
            {skin === 're4' && !isOpening && "What're ya buyin', stranger?"}
            {skin === 're4' && isOpening && "Hehehe... thank you!"}
            {skin !== 're4' && "Skin em construção..."}
          </p>

          <div className="relative w-64 h-64 mt-8 flex items-center justify-center">
             
             {/* O MERCADOR RE4 EM CSS */}
             {skin === 're4' && (
                <div 
                  className={`relative w-32 h-48 cursor-pointer transition-transform hover:scale-105 ${fichas <= 0 ? 'opacity-50 grayscale' : ''}`}
                  onClick={handleBuy}
                >
                  {/* Fundo interno do casaco (o que aparece quando abre) */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-36 bg-[#0a0a0a] z-10 flex flex-col items-center pt-8 border-x-2 border-black">
                     {/* "Itens" pendurados no casaco */}
                     <div className="flex gap-4">
                        <div className="w-2 h-4 bg-red-800 rounded-sm shadow-[0_0_5px_red]" />
                        <div className="w-3 h-3 bg-blue-800 rounded-full shadow-[0_0_5px_blue]" />
                     </div>
                  </div>

                  {/* O Capuz */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-24 bg-[#1a1a1b] rounded-t-full border-2 border-black z-30 shadow-xl">
                    {/* Sombra interna do rosto */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-10 bg-black rounded-full" />
                    {/* Olhos Laranjas Brilhantes */}
                    <div className="absolute bottom-6 left-5 w-2.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]" />
                    <div className="absolute bottom-6 right-5 w-2.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]" />
                  </div>

                  {/* Aba Esquerda do Sobretudo */}
                  <div className={`absolute top-12 left-0 w-[55%] h-36 bg-[#1a1a1b] border-2 border-black z-40 origin-top-left transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isOpening ? '-rotate-[25deg] -translate-x-2' : ''}`} />
                  
                  {/* Aba Direita do Sobretudo */}
                  <div className={`absolute top-12 right-0 w-[55%] h-36 bg-[#1a1a1b] border-2 border-black z-40 origin-top-right transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isOpening ? 'rotate-[25deg] translate-x-2' : ''}`} />
                </div>
             )}

             {/* ANIMAÇÃO DA MALETA CAINDO */}
             {isOpening && skin === 're4' && (
               <div className="absolute bottom-0 z-50 flex flex-col items-center briefcase-drop">
                 <div className="w-16 h-10 bg-gray-400 border-2 border-gray-600 rounded-sm relative shadow-2xl">
                   <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-800" /> {/* Alça */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-600 rounded-sm" /> {/* Fechadura */}
                 </div>
               </div>
             )}
          </div>

          {/* O RESULTADO DO LOOT */}
          <div className="h-20 mt-4 flex items-center justify-center w-full">
            {reward && (
              <div className="bg-primary/10 border border-primary p-4 rounded-lg text-center animate-fade-in w-full max-w-[300px] relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 animate-pulse-fast pointer-events-none" />
                <p className="font-pixel text-[8px] text-muted-foreground mb-1 uppercase">Recompensa Obtida:</p>
                <p className="font-pixel text-xs text-primary drop-shadow-md">{reward}</p>
              </div>
            )}
            {!reward && !isOpening && fichas <= 0 && (
              <p className="font-pixel text-[8px] text-red-500 uppercase tracking-widest text-center">
                Sem fichas. O mercado não aceita fiado.
              </p>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes briefcaseDrop {
          0% { transform: translateY(-50px) scale(0.5); opacity: 0; }
          50% { transform: translateY(0px) scale(1); opacity: 1; }
          70% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .briefcase-drop {
          animation: briefcaseDrop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </AppShell>
  );
}
