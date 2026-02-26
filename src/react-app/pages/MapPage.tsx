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

  // Pega a localização do último ponto ou usa o padrão
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
          name: name.trim()
        });
        setName(''); setShowForm(false); setIsGettingLocation(false);
      },
      () => { alert("Ative o GPS do celular!"); setIsGettingLocation(false); }
    );
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-primary text-xs flex items-center gap-2">
            <Compass className="animate-spin-slow" /> EXPLORAÇÃO
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[10px]">
            {showForm ? 'FECHAR' : 'NOVO LOCAL'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border-2 border-primary/20 p-4 rounded-lg space-y-3">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Nome da Área (Ex: Masmorra da Academia)"
              className="w-full bg-black border border-primary/40 p-2 text-white text-xs outline-none"
            />
            <Button onClick={handleCheckIn} className="w-full font-pixel text-[10px]">
              {isGettingLocation ? 'MAPEANDO...' : 'REVELAR ÁREA (+10 XP)'}
            </Button>
          </div>
        )}

        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden">
          {/* MAPA REAL (OpenStreetMap) */}
          <iframe
            width="100%" height="100%"
            style={{ filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.7)' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.003},${lat-0.003},${lng+0.003},${lat+0.003}&layer=mapnik&marker=${lat},${lng}`}
          ></iframe>

          {/* NÉVOA DE GUERRA DINÂMICA */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{ 
              backgroundColor: 'black',
              // Se tiver pontos, abre um buraco no centro (onde o mapa está focado)
              maskImage: state.mapPoints.length > 0 
                ? 'radial-gradient(circle 120px at center, transparent 10%, black 80%)' 
                : 'none',
              WebkitMaskImage: state.mapPoints.length > 0 
                ? 'radial-gradient(circle 120px at center, transparent 10%, black 80%)' 
                : 'none'
            }}
          />

          {state.mapPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-center p-6">
              <Lock className="w-12 h-12 text-primary/20 mb-2" />
              <p className="font-pixel text-[10px] text-primary/40">ZONA DESCONHECIDA</p>
              <p className="text-[8px] text-muted-foreground mt-2">FAÇA UM CHECK-IN PARA REVELAR</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
