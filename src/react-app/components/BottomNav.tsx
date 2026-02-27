import { NavLink } from 'react-router';
import { LayoutDashboard, ScrollText, Map, User, FlaskConical } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sagas', icon: ScrollText, label: 'Sagas' },
  { to: '/map', icon: Map, label: 'Mapa' },
  { to: '/tavern', icon: FlaskConical, label: 'Taverna' },
  { to: '/profile', icon: User, label: 'Perfil' }
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-primary/50 z-50">
      <div className="max-w-[450px] mx-auto flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 p-2 transition-all ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Icon size={24} strokeWidth={2} />
            <span className="text-[10px] font-pixel">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
