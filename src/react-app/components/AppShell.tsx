import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import StatusBars from './StatusBars';
import { useGame } from '@/react-app/context/GameContext';

interface AppShellProps {
  children: ReactNode;
  showStatusBars?: boolean;
}

export default function AppShell({ children, showStatusBars = true }: AppShellProps) {
  const { isExhausted } = useGame();

  return (
    <div className={`min-h-screen bg-background ${isExhausted ? 'exhausted' : ''}`}>
      {/* Background texture */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a853' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {showStatusBars && <StatusBars />}
      
      <main className="max-w-[450px] mx-auto pb-20 relative">
        {children}
      </main>
      
      <BottomNav />

      {/* Exhaustion overlay */}
      {isExhausted && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg font-pixel text-xs z-50 animate-pulse">
          ⚠️ EXAUSTÃO! HP Baixo
        </div>
      )}
    </div>
  );
}
