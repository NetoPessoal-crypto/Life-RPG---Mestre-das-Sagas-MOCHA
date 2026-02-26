import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useGame } from '@/react-app/context/GameContext';

interface AppShellProps {
  children: ReactNode;
  showStatusBars?: boolean; // Podemos manter ou remover se a Dashboard já tiver as barras
}

export default function AppShell({ children }: AppShellProps) {
  const { state, isExhausted } = useGame();

  // Cálculo para o efeito de dano (fica mais forte quanto menos HP você tem)
  const isCritical = state.hp < 30;

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-primary/30`}>
      {/* TEXTURA DE FUNDO RPG */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a853' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 🔴 CAMADA DE DANO (A TELA AVERMELHADA QUE VOCÊ PEDIU) */}
      {isCritical && (
        <div className="fixed inset-0 pointer-events-none z-[9999] animate-pulse-fast shadow-[inset_0_0_60px_rgba(220,38,38,0.6)] border-[4px] border-red-600/20" />
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-[450px] mx-auto pb-24 relative z-10">
        {children}
      </main>
      
      <BottomNav />

      {/* AVISO DE EXAUSTÃO NO TOPO */}
      {isExhausted && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-1 rounded-full font-pixel text-[8px] z-[10000] shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-bounce">
          ⚠️ STATUS: EXAUSTO
        </div>
      )}

      <style>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
