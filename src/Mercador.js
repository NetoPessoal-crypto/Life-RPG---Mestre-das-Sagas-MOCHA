import React, { useState, useEffect } from 'react';
import './Mercador.css';

const Mercador = () => {
  // Estágios: 'fundo', 'respiro', 'fala', 'preparando', 'pausado', 'abrindo', 'premio'
  const [estagio, setEstagio] = useState('fundo');
  const [frameAtual, setFrameAtual] = useState(1);

  useEffect(() => {
    let timer;

    if (estagio === 'fundo') {
      timer = setTimeout(() => setEstagio('respiro'), 2000); // 2s fundo sozinho
    } 
    
    else if (estagio === 'respiro') {
      const interval = setInterval(() => {
        setFrameAtual(prev => (prev === 1 ? 2 : 1));
      }, 400); // Velocidade do respiro
      timer = setTimeout(() => {
        clearInterval(interval);
        setEstagio('fala');
        setFrameAtual(3);
      }, 2000); // 2s de respiro
    } 
    
    else if (estagio === 'fala') {
      timer = setTimeout(() => {
        setEstagio('preparando');
        setFrameAtual(4);
      }, 2000); // 2s no frame 3 (fala)
    } 
    
    else if (estagio === 'preparando') {
      if (frameAtual < 6) {
        timer = setTimeout(() => setFrameAtual(prev => prev + 1), 200);
      } else {
        setEstagio('pausado'); // Trava no frame 6
      }
    }

    return () => {
      clearTimeout(timer);
    };
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
