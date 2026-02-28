import React, { useState, useEffect } from 'react';
import './Mercador.css';

interface MercadorProps {
  recompensa: string | null;
  onTrocarFicha: () => void;
  podeAbrir: boolean;
}

const Mercador: React.FC<MercadorProps> = ({ recompensa, onTrocarFicha, podeAbrir }) => {
  const [estagio, setEstagio] = useState<'fundo' | 'respiro' | 'fala' | 'preparando' | 'pausado' | 'abrindo' | 'premio'>('fundo');
  const [frameAtual, setFrameAtual] = useState<number>(1);

  // LOGICA 1: Controle das Fases de Tempo (2 segundos para diálogos/fundo)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (estagio === 'fundo') {
      timer = setTimeout(() => setEstagio('respiro'), 2000);
    } else if (estagio === 'respiro') {
      timer = setTimeout(() => {
        setEstagio('fala');
        setFrameAtual(3);
      }, 2000);
    } else if (estagio === 'fala') {
      timer = setTimeout(() => {
        setEstagio('preparando');
        setFrameAtual(4);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [estagio]);

  // LOGICA 2: Controle da Animação (1 segundo por frame conforme pedido)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (estagio === 'respiro') {
      interval = setInterval(() => {
        setFrameAtual(prev => (prev === 1 ? 2 : 1));
      }, 1000);
    } else if (estagio === 'preparando') {
      interval = setInterval(() => {
        setFrameAtual(prev => {
          if (prev < 6) return prev + 1;
          setEstagio('pausado'); // Trava no 6 e aguarda o clique
          return 6;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [estagio]);

  // LOGICA 3: Sequência de Abertura da Maleta (7 ao 15)
  const handleClique = () => {
    if (estagio === 'pausado' && podeAbrir) {
      onTrocarFicha();
      setEstagio('abrindo');
      
      let f = 7;
      const finalAnim = setInterval(() => {
        if (f <= 15) {
          setFrameAtual(f);
          f++;
        } else {
          // Só mostra o prêmio 1 segundo APÓS o frame 15 aparecer
          clearInterval(finalAnim);
          setEstagio('premio');
        }
      }, 1000);
    }
  };

  return (
    <div className="taverna-container" onClick={handleClique}>
      {/* Camada 1: Cenário */}
      <div className="background-layer" />
      
      {/* Camada 2: Mercador */}
      {estagio !== 'fundo' && (
        <img 
          src={`/mercador/frame${frameAtual}.png`} 
          alt="Mercador" 
          className="mercador-sprite"
        />
      )}

      {/* Camada 3: Sua nova caixa de texto em PNG */}
      {estagio === 'premio' && (
        <div className="reward-container">
          <img 
            src="/mercador/caixa_recompensa.png" 
            alt="Moldura Recompensa" 
            className="reward-frame" 
          />
          <div className="reward-text-wrapper">
            <p className="reward-title">RECOMPENSA OBTIDA</p>
            <p className="reward-content">{recompensa || "PROCESSANDO..."}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mercador;
