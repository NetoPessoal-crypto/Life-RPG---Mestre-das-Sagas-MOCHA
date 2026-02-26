import { useState, useEffect } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Plus, Compass, Lock } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Ponto central do mapa (último check-in ou SP como padrão)
  const centerLat = state.mapPoints[state.mapPoints.length - 1]?.lat || -23.5505;
  const centerLng = state.mapPoints[state.mapPoints.length - 1]?.lng || -46.6333;

  const handleCheckIn = () => {
    if (!name.trim()) return;
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (p) => {
        addMapPoint({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          name: name.trim(),
          discoveredAt: new Date().toISOString()
        });
        setName(''); setShowForm(false); setIsGettingLocation(false);
      },
      () => { alert("Ligue o GPS!"); setIsGettingLocation(false); },
      { enableHighAccuracy: true }
    );
  };

  // Gera a string da máscara de névoa baseada nos pontos reais
  const fogMask = state.mapPoints.length > 0 
    ? state.mapPoints.map(() => `radial-gradient(circle at center, transparent 30%, black 70%)`).join(',')
    : 'none';

  return (
    <AppShell>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-pixel text-sm text-primary flex items-center gap-2">
            <Compass className="w-5 h-5 animate-pulse" /> EXPLORAÇÃO
          </h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="font-pixel text-[10px] bg-primary/20 border border-primary text-primary">
            {showForm ? 'CANCELAR' : 'CHECK-IN'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border-2 border-primary/30 rounded-lg p-4 space-y-3 animate-in fade-in zoom-in">
             <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)} 
              placeholder="Nome do Local..." 
              className="w-full bg-black border border-primary/50 rounded p-2 text-white text-sm outline-none"
            />
            <Button onClick={handleCheckIn} disabled={!name.trim() || isGettingLocation} className="w-full font-pixel text-[10px]">
              {isGettingLocation ? 'BUSCANDO SINAL...' : 'REVELAR ÁREA +10 EXPL'}
            </Button>
          </div>
        )}

        <div className="relative aspect-square rounded-lg border-2 border-primary/20 overflow-hidden shadow-[0_0_20px_rgba(212,168,83,0.1)]">
          {/* MAPA OSM: Focado no seu ponto atual */}
          <iframe
            width="100%" height="100%" frameBorder="0"
            style={{ filter: 'grayscale(1) invert(0.9) contrast(1.5) brightness(0.8)' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng-0.005},${centerLat-0.005},${centerLng+0.005},${centerLat+0.005}&layer=mapnik&marker=${centerLat},${centerLng}`}
          ></iframe>

          {/* NÉVOA: Agora ela centraliza no mapa */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-1000" 
               style={{ 
                 backgroundColor: 'rgba(0,0,0,0.9)',
                 maskImage: state.mapPoints.length > 0 ? 'radial-gradient(circle 120px at center, transparent 20%, black 100%)' : 'none',
                 WebkitMaskImage: state.mapPoints.length > 0 ? 'radial-gradient(circle 120px at center, transparent 20%, black 100%)' : 'none'
               }}>
          </div>
          
          {state.mapPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <Lock className="w-10 h-10 text-primary/40 mb-2" />
              <p className="font-pixel text-[8px] text-primary/60">TERRA INCÓGNITA</p>
            </div>
          )}
        </div>

        {/* LISTA DE DESCOBERTAS */}
        <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-40">
          {state.mapPoints.map(p => (
            <div key={p.id} className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/10 rounded">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs text-white uppercase font-pixel text-[10px]">{p.name}</span>
            </div>
          )).reverse()}
        </div>
      </div>
    </AppShell>
  );
}
