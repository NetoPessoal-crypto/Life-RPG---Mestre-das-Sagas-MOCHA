import React, { useState, useEffect } from 'react';
import './Mercador.css';

interface MercadorProps {
  recompensa: string | null;
  onTrocarFicha: () => void;
  onFinalizar: () => void;
  podeAbrir: boolean;
}

const Mercador: React.FC<MercadorProps> = ({ recompensa, onTrocarFicha, onFinalizar, podeAbrir }) => {
  const [estagio, setEstagio] = useState<'fundo' | 'respiro' | 'fala' | 'preparando' | 'pausado' | 'abrindo' | 'premio'>('fundo');
  const [frameAtual, setFrameAtual] = useState<number>(1);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (estagio === 'fundo') timer = setTimeout(() => setEstagio('respiro'), 2000);
    else if (estagio === 'respiro') timer = setTimeout(() => { setEstagio('fala'); setFrameAtual(3); }, 2000);
    else if (estagio === 'fala') timer = setTimeout(() => { setEstagio('preparando'); setFrameAtual(4); }, 2000);
    return () => clearTimeout(timer);
  }, [estagio]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (estagio === 'respiro') {
      interval = setInterval(() => setFrameAtual(prev => (prev === 1 ? 2 : 1)), 1000);
    } else if (estagio === 'preparando') {
      interval = setInterval(() => {
        setFrameAtual(prev => {
          if (prev < 6) return prev + 1;
          setEstagio('pausado');
          return 6;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [estagio]);

  const handleClique = () => {
    if (estagio === 'premio') {
      onFinalizar(); // Salva na Saga e limpa o reward na TavernPage
      setEstagio('fundo'); // Faz o Mercador sumir
      setFrameAtual(1);
    } 
    else if (estagio === 'pausado' && podeAbrir) {
      onTrocarFicha();
      setEstagio('abrindo');
      let f = 7;
      const finalAnim = setInterval(() => {
        if (f <= 15) { setFrameAtual(f); f++; }
        else { clearInterval(finalAnim); setEstagio('premio'); }
      }, 1000);
    }
  };

  return (
    <div className="taverna-container" onClick={handleClique}>
      <div className="background-layer" />
      {estagio !== 'fundo' && (
        <img src={`/mercador/frame${frameAtual}.png`} alt="Mercador" className="mercador-sprite" />
      )}
      {estagio === 'premio' && (
        <div className="reward-container">
          <img src="/mercador/caixa_recompensa.png" alt="Moldura" className="reward-frame" />
          <div className="reward-text-wrapper">
            <p className="reward-title">RECOMPENSA OBTIDA</p>
            <p className="reward-content">{recompensa}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mercador;
