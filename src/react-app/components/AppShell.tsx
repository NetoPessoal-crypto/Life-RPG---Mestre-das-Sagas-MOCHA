import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useGame } from '@/react-app/context/GameContext';

interface AppShellProps {
  children: ReactNode;
  showStatusBars?: boolean; 
}

export default function AppShell({ children }: AppShellProps) {
  const { state, isExhausted } = useGame();

  const isCritical = state.hp < 30;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      
      {/* 🔴 CAMADA DE DANO (MANTIDA, POIS FAZ PARTE DO RPG) */}
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
