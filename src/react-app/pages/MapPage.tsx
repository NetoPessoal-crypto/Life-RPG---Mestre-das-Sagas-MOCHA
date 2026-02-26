import { useState, useEffect } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Plus, Camera, Compass, Lock } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleCheckIn = () => {
    if (!name.trim()) return;
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          addMapPoint({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: name.trim(),
            photo: photo || undefined
          });
          setName(''); setPhoto(''); setShowForm(false); setIsGettingLocation(false);
        },
        () => {
          alert("Erro ao obter GPS.");
          setIsGettingLocation(false);
        }
      );
    }
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-pixel text-sm text-primary flex items-center gap-2">
            <Compass className="w-5 h-5" /> MAPA DE EXPLORAÇÃO
          </h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="font-pixel text-[10px] glow-gold">
            <Plus className="w-4 h-4 mr-1" /> NOVO LOCAL
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-4">
             <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nome do local..." 
              className="w-full bg-muted border border-border rounded px-3 py-2 text-sm text-white"
            />
            <Button onClick={handleCheckIn} disabled={!name.trim() || isGettingLocation} className="w-full font-pixel text-[10px]">
              {isGettingLocation ? 'LOCALIZANDO...' : 'REVELAR ÁREA (+10 EXPL)'}
            </Button>
          </div>
        )}

        <div className="relative bg-black border border-primary/20 rounded-lg overflow-hidden aspect-square shadow-2xl">
          {/* MAPA OPEN SOURCE (Sem Chave) */}
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.2)' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(state.mapPoints[0]?.lng || -46.63)-0.01},${(state.mapPoints[0]?.lat || -23.55)-0.01},${(state.mapPoints[0]?.lng || -46.63)+0.01},${(state.mapPoints[0]?.lat || -23.55)+0.01}&layer=mapnik`}
          ></iframe>

          {/* CAMADA DE NÉVOA DE GUERRA */}
          <div className="absolute inset-0 pointer-events-none" 
               style={{ 
                 backgroundColor: 'rgba(0,0,0,0.85)',
                 WebkitMaskImage: state.mapPoints.length > 0 
                  ? state.mapPoints.map(p => `radial-gradient(circle 80px at ${((p.lng + 180) / 360) * 100}% ${((90 - p.lat) / 180) * 100}%, transparent 50%, black 100%)`).join(',')
                  : 'none',
                 maskImage: state.mapPoints.length > 0 
                  ? state.mapPoints.map(p => `radial-gradient(circle 80px at ${((p.lng + 180) / 360) * 100}% ${((90 - p.lat) / 180) * 100}%, transparent 50%, black 100%)`).join(',')
                  : 'none'
               }}>
          </div>
          
          {state.mapPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <Lock className="w-12 h-12 text-primary/40 mb-3" />
              <p className="font-pixel text-[10px] text-primary/60">TERRITÓRIO BLOQUEADO</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
