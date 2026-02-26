import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Compass, Lock, Plus, Camera, Clock } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Pega a localização do último ponto ou usa o padrão (SP)
  const lastPoint = state.mapPoints[state.mapPoints.length - 1];
  const lat = lastPoint?.lat || -23.55;
  const lng = lastPoint?.lng || -46.63;

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>, pointId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (pointId) {
          addPhotoToPoint(pointId, base64);
        } else {
          setTempPhoto(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = () => {
    if (!name.trim() || !tempPhoto) return; // Mantendo a foto como necessária para o RPG
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (p) => {
        addMapPoint({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          name: name.trim().toUpperCase(),
          photos: [{ url: tempPhoto, timestamp: new Date().toISOString() }]
        });
        setName(''); setTempPhoto(''); setShowForm(false); setIsGettingLocation(false);
      },
      () => { alert("Ative o GPS!"); setIsGettingLocation(false); },
      { enableHighAccuracy: true }
    );
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-primary text-xs flex items-center gap-2">
            <Compass className="animate-spin-slow" /> MODO INTERATIVO
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] glow-gold">
            {showForm ? 'VOLTAR' : 'NOVO CHECK-IN'}
          </Button>
        </div>

        {/* FORMULÁRIO COM FOTO */}
        {showForm && (
          <div className="bg-card border-2 border-primary/20 p-4 rounded-lg space-y-4 animate-in slide-in-from-top">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="NOME DO LOCAL..."
              className="w-full bg-black border border-primary/40 p-2 text-white text-xs outline-none"
            />
            
            {/* Campo de Foto que o Mocha tinha */}
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? (
                <img src={tempPhoto} className="w-full h-32 object-cover rounded" />
              ) : (
                <div className="text-center">
                  <Camera className="w-6 h-6 text-primary mx-auto mb-1 opacity-50" />
                  <span className="font-pixel text-[7px] text-primary">CAPTURAR EVIDÊNCIA</span>
                </div>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>

            <Button onClick={handleCheckIn} disabled={!name || !tempPhoto || isGettingLocation} className="w-full font-pixel text-[10px]">
              {isGettingLocation ? 'LOCALIZANDO...' : 'REVELAR NO MAPA (+20 XP)'}
            </Button>
          </div>
        )}

        {/* MAPA E NÉVOA */}
        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden shadow-2xl">
          <iframe
            width="100%" height="100%"
            style={{ filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.7)' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.003},${lat-0.003},${lng+0.003},${lat+0.003}&layer=mapnik&marker=${lat},${lng}`}
          ></iframe>

          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.9)',
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
              <p className="font-pixel text-[10px] text-primary/40 uppercase">Área Inexplorada</p>
            </div>
          )}
        </div>
        
        {/* LISTA DE LOCAIS COM HISTÓRICO DE FOTOS */}
        <div className="space-y-4">
           {state.mapPoints.slice().reverse().map(p => (
             <div key={p.id} className="bg-card border border-primary/10 rounded overflow-hidden">
               <div className="p-2 bg-primary/5 flex justify-between items-center">
                 <span className="font-pixel text-[8px] text-primary uppercase">{p.name}</span>
                 <label className="cursor-pointer p-1">
                   <Plus className="w-3 h-3 text-primary" />
                   <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, p.id)} className="hidden" />
                 </label>
               </div>
               
               {/* Galeria de Fotos horizontal */}
               <div className="flex gap-2 p-2 overflow-x-auto bg-black/20">
                 {p.photos?.map((photo, i) => (
                   <div key={i} className="flex-shrink-0 relative">
                     <img src={photo.url} className="w-20 h-20 object-cover rounded border border-primary/5" />
                     <div className="absolute bottom-0 inset-x-0 bg-black/70 p-0.5 text-[5px] font-pixel text-center text-primary">
                       {new Date(photo.timestamp).toLocaleDateString('pt-BR')}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </div>
    </AppShell>
  );
}
