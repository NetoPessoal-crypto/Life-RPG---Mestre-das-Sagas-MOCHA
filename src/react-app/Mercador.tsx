import React, { useState, useEffect } from 'react';
import './Mercador.css';

// Definimos o que o Mercador precisa receber da Taverna
interface MercadorProps {
  recompensa: string | null;
  onTrocarFicha: () => void;
  podeAbrir: boolean;
}

const Mercador: React.FC<MercadorProps> = ({ recompensa, onTrocarFicha, podeAbrir }) => {
  const [estagio, setEstagio] = useState<'fundo' | 'respiro' | 'fala' | 'preparando' | 'pausado' | 'abrindo' | 'premio'>('fundo');
  const [frameAtual, setFrameAtual] = useState<number>(1);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (estagio === 'fundo') {
      timer = setTimeout(() => setEstagio('respiro'), 2000);
    } 
    else if (estagio === 'respiro') {
      const interval = setInterval(() => {
        setFrameAtual(prev => (prev === 1 ? 2 : 1));
      }, 400);
      timer = setTimeout(() => {
        clearInterval(interval);
        setEstagio('fala');
        setFrameAtual(3);
      }, 2000);
    } 
    else if (estagio === 'fala') {
      timer = setTimeout(() => {
        setEstagio('preparando');
        setFrameAtual(4);
      }, 2000);
    } 
    else if (estagio === 'preparando') {
      if (frameAtual < 6) {
        timer = setTimeout(() => setFrameAtual(prev => prev + 1), 200);
      } else {
        setEstagio('pausado');
      }
    }

    return () => clearTimeout(timer);
  }, [estagio, frameAtual]);

  const handleClique = () => {
    // Só inicia a abertura se o jogador tiver fichas (podeAbrir)
    if (estagio === 'pausado' && podeAbrir) {
      onTrocarFicha(); // Avisa a Taverna para gastar a ficha e sortear o prêmio
      setEstagio('abrindo');
      rodarSequenciaFinal();
    }
  };

  const rodarSequenciaFinal = () => {
    let f = 7;
    const interval = setInterval(() => {
      setFrameAtual(f);
      if (f === 15) {
        clearInterval(interval);
        setEstagio('premio');
      }
      f++;
    }, 120);
  };

  return (
    <div className="taverna-container" onClick={handleClique}>
      <div className="background-layer" />
      
      {estagio !== 'fundo' && (
        <img 
          src={`/mercador/frame${frameAtual}.png`} 
          alt="Mercador" 
          className="mercador-sprite"
        />
      )}

      {/* AGORA O TEXTO É DINÂMICO! */}
      {estagio === 'premio' && (
        <div className="reward-box">
          <p className="reward-title">RECOMPENSA OBTIDA:</p>
          <p className="reward-text">{recompensa || "ERRO AO GERAR"}</p>
        </div>
      )}
    </div>
  );
};

export default Mercador;
