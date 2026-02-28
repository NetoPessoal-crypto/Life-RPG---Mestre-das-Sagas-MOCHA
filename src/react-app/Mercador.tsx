import React, { useState, useEffect } from 'react';
import './Mercador.css';

const Mercador: React.FC = () => {
  // Estágios da animação
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
    if (estagio === 'pausado') {
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

      {estagio === 'premio' && (
        <div className="reward-box">
          <p>VOCÊ GANHOU: 1 HORA DE VIDEOGAME!</p>
        </div>
      )}
    </div>
  );
};

export default Mercador;
