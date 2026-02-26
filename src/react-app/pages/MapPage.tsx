import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Compass, Lock, Plus } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Pega a localização do último ponto ou usa o padrão (SP)
  const lastPoint = state.mapPoints[state.mapPoints.length - 1];
  const lat = lastPoint?.lat || -23.55;
  const lng = lastPoint?.lng || -46.63;

  const handleCheckIn = () => {
    if (!name.trim()) return;
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (p) => {
        addMapPoint({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          name: name.trim(),
          photos: [] // No código antigo era assim
        });
        setName(''); setShowForm(false); setIsGettingLocation(false);
      },
      () => { alert("Ative o GPS!"); setIsGettingLocation(false); },
      { enableHighAccuracy: true }
    );
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-primary text-xs flex items-center gap-2">
            <Compass className="animate-spin-slow" /> MODO INTERATIVO
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px]">
            {showForm ? 'VOLTAR' : 'NOVO CHECK-IN'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border-2 border-primary/20 p-4 rounded-lg space-y-3">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="NOME DO LOCAL..."
              className="w-full bg-black border border-primary/40 p-2 text-white text-xs outline-none"
            />
            <Button onClick={handleCheckIn} className="w-full font-pixel text-[10px]">
              {isGettingLocation ? 'LOCALIZANDO...' : 'REVELAR NO MAPA'}
            </Button>
          </div>
        )}

        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden">
          {/* O MAPA QUE SE MEXE (iframe do OpenStreetMap) */}
          <iframe
            width="100%" height="100%"
            style={{ filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.7)' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.003},${lat-0.003},${lng+0.003},${lat+0.003}&layer=mapnik&marker=${lat},${lng}`}
          ></iframe>

          {/* A CAMADA DE NÉVOA (FOG OF WAR) */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.9)',
              // A máscara cria um buraco transparente no centro do mapa
              maskImage: state.mapPoints.length > 0 
                ? 'radial-gradient(circle 120px at center, transparent 10%, black 80%)' 
                : 'none',
              WebkitMaskImage: state.mapPoints.length > 0 
                ? 'radial-gradient(circle 120px at center, transparent 10%, black 80%)' 
                : 'none'
            }}
          />

          {state.mapPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-center p-6">
              <Lock className="w-10 h-10 text-primary/20 mb-2" />
              <p className="font-pixel text-[10px] text-primary/40">ÁREA NÃO MAPEADA</p>
            </div>
          )}
        </div>
        
        {/* Lista simples de locais abaixo */}
        <div className="space-y-2">
           {state.mapPoints.map(p => (
             <div key={p.id} className="p-2 border border-primary/10 rounded font-pixel text-[8px] text-muted-foreground uppercase">
               {p.name} - REVELADO
             </div>
           ))}
        </div>
      </div>
    </AppShell>
  );
}
