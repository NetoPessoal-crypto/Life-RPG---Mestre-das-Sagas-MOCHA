import React, { useState, useEffect } from 'react';
import './Mercador.css';

interface MercadorProps {
  recompensa: string | null;
  onTrocarFicha: () => void;
  onFinalizar: () => void; // Avisa a página para salvar e fechar
  podeAbrir: boolean;
}

const Mercador: React.FC<MercadorProps> = ({ recompensa, onTrocarFicha, onFinalizar, podeAbrir }) => {
  const [estagio, setEstagio] = useState<'fundo' | 'respiro' | 'fala' | 'preparando' | 'pausado' | 'abrindo' | 'premio'>('fundo');
  const [frameAtual, setFrameAtual] = useState<number>(1);

  // LOGICA 1: Controle das Fases de Tempo
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

  // LOGICA 2: Controle da Animação (1 segundo por frame)
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
          setEstagio('pausado');
          return 6;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [estagio]);

  // LOGICA 3: O Clique (Abrir maleta OU Finalizar encontro)
  const handleClique = () => {
    // SEGUNDO CLIQUE: Recompensa já está na tela, agora vamos salvar e fechar
    if (estagio === 'premio') {
      onFinalizar(); // Avisa a TavernPage para salvar na Saga
      setEstagio('fundo'); // Reseta o Mercador para o estado inicial (invisível)
      setFrameAtual(1);
    } 
    // PRIMEIRO CLIQUE: Inicia a abertura da maleta
    else if (estagio === 'pausado' && podeAbrir) {
      onTrocarFicha();
      setEstagio('abrindo');
      
      let f = 7;
      const finalAnim = setInterval(() => {
        if (f <= 15) {
          setFrameAtual(f);
          f++;
        } else {
          clearInterval(finalAnim);
          setEstagio('premio');
        }
      }, 1000);
    }
  };

  return (
    <div className="taverna-container" onClick={handleClique}>
      <div className="background-layer" />
      
      {/* O Mercador só aparece se não estiver no estágio fundo */}
      {estagio !== 'fundo' && (
        <img 
          src={`/mercador/frame${frameAtual}.png`} 
          alt="Mercador" 
          className="mercador-sprite"
        />
      )}

      {/* Caixa de recompensa estilizada com o seu PNG */}
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
