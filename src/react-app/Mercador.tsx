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

  // EFEITO 1: Controla a transição automática das fases (TIMING)
  useEffect(() => {
    if (estagio === 'fundo') {
      const t = setTimeout(() => setEstagio('respiro'), 2000);
      return () => clearTimeout(t);
    } 
    if (estagio === 'respiro') {
      const t = setTimeout(() => { setEstagio('fala'); setFrameAtual(3); }, 2000);
      return () => clearTimeout(t);
    }
    if (estagio === 'fala') {
      const t = setTimeout(() => { setEstagio('preparando'); setFrameAtual(4); }, 2000);
      return () => clearTimeout(t);
    }
  }, [estagio]); // SÓ REEXECUTA QUANDO O ESTÁGIO MUDA

  // EFEITO 2: Controla a animação dos frames (MOVIMENTO)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (estagio === 'respiro') {
      interval = setInterval(() => {
        setFrameAtual(prev => (prev === 1 ? 2 : 1));
      }, 400);
    } 
    else if (estagio === 'preparando') {
      interval = setInterval(() => {
        setFrameAtual(prev => {
          if (prev < 6) return prev + 1;
          setEstagio('pausado');
          return 6;
        });
      }, 200);
    }

    return () => clearInterval(interval);
  }, [estagio]);

  const handleClique = () => {
    // O clique agora só funciona quando ele para no frame 6
    if (estagio === 'pausado' && podeAbrir) {
      onTrocarFicha();
      setEstagio('abrindo');
      
      let f = 7;
      const finalAnim = setInterval(() => {
        setFrameAtual(f);
        if (f === 15) {
          clearInterval(finalAnim);
          setEstagio('premio');
        }
        f++;
      }, 120);
    }
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
          <p className="reward-title">RECOMPENSA OBTIDA:</p>
          <p className="reward-text">{recompensa || "GERANDO..."}</p>
        </div>
      )}
    </div>
  );
};

export default Mercador;
