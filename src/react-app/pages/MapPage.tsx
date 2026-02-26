import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Camera, Plus, Compass, Lock, History } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);

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

  const handleNewCheckIn = () => {
    if (!name || !tempPhoto) return;
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition((p) => {
      addMapPoint({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        name: name.toUpperCase(),
        photos: [{ url: tempPhoto, timestamp: new Date().toISOString() }]
      });
      setName(''); setTempPhoto(''); setShowForm(false); setIsLocating(false);
    }, () => {
      alert("GPS necessário para mapear o território!");
      setIsLocating(false);
    });
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        {/* HEADER IGUAL AO ORIGINAL */}
        <div className="flex items-center justify-between">
          <h1 className="font-pixel text-sm text-primary flex items-center gap-2">
            <Compass className="w-5 h-5 animate-pulse" />
            MAPA DE EXPLORAÇÃO
          </h1>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="font-pixel text-[10px] glow-gold"
          >
            <Plus className="w-4 h-4 mr-1" />
            {showForm ? 'CANCELAR' : 'CHECK-IN'}
          </Button>
        </div>

        {/* O "QUADRADO" DO MAPA - AGORA É A CÂMERA */}
        <div className="relative aspect-square bg-card border-4 border-double border-primary/30 rounded-lg overflow-hidden shadow-2xl">
          {showForm ? (
            // VISUAL DE CAPTURA
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/40 hover:bg-black/20 transition-all">
              {tempPhoto ? (
                <img src={tempPhoto} className="absolute inset-0 w-full h-full object-cover animate-in fade-in" />
              ) : (
                <div className="text-center space-y-2">
                  <Camera className="w-12 h-12 text-primary mx-auto opacity-50" />
                  <p className="font-pixel text-[10px] text-primary">TIRAR FOTO DO LOCAL</p>
                </div>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>
          ) : (
            // VISUAL DE "LOCK" QUANDO NÃO ESTÁ EM CHECK-IN
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
              <Lock className="w-12 h-12 text-primary/20 mb-3" />
              <p className="font-pixel text-[10px] text-primary/40 uppercase">Território Aguardando Registro</p>
              <p className="text-[8px] text-muted-foreground mt-2">Clique em CHECK-IN para iniciar</p>
            </div>
          )}
          
          {/* Overlay de HUD (Interface de jogo sobre a câmera) */}
          <div className="absolute inset-x-0 top-0 p-2 flex justify-between pointer-events-none">
            <div className="text-[8px] font-mono text-primary/60 bg-black/40 px-2">SYS_SCAN: ACTIVE</div>
            <div className="text-[8px] font-mono text-primary/60 bg-black/40 px-2">LOC_GPS: {isLocating ? 'SEARCHING...' : 'READY'}</div>
          </div>
        </div>

        {/* CAMPOS DO FORMULÁRIO (Abaixo do quadrado) */}
        {showForm && (
          <div className="space-y-3 animate-in slide-in-from-bottom-4">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="NOME DO TERRITÓRIO..."
              className="w-full bg-muted border border-border rounded px-3 py-3 text-sm focus:outline-none focus:border-primary font-pixel text-[10px]"
            />
            <Button 
              onClick={handleNewCheckIn} 
              disabled={!name || !tempPhoto || isLocating}
              className="w-full font-pixel text-[10px] h-12 shadow-[0_0_15px_rgba(212,168,83,0.3)]"
            >
              {isLocating ? 'OBTENDO COORDENADAS...' : 'CONFIRMAR DESCOBERTA (+20 XP)'}
            </Button>
          </div>
        )}

        {/* LISTA DE LUGARES DESCOBERTOS (Cards Estilo RPG) */}
        <div className="space-y-4 mt-6">
          <h2 className="font-pixel text-[10px] text-muted-foreground uppercase tracking-widest">Registros de Jornada</h2>
          
          {[...state.mapPoints].reverse().map(point => (
            <div key={point.id} className="bg-card border-l-4 border-primary rounded-r-lg shadow-lg overflow-hidden">
              <div className="p-3 flex justify-between items-center bg-primary/5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-pixel text-[10px] text-white uppercase">{point.name}</span>
                </div>
                {/* Botão de Add Foto no mesmo lugar */}
                <label className="bg-primary/20 p-1.5 rounded-full cursor-pointer hover:bg-primary/40 transition-all">
                  <Plus className="w-3 h-3 text-primary" />
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, point.id)} className="hidden" />
                </label>
              </div>

              {/* Mini Galeria de Fotos */}
              <div className="flex gap-2 p-3 overflow-x-auto bg-black/20 scrollbar-hide">
                {point.photos.map((photo, i) => (
                  <div key={i} className="flex-shrink-0 relative group">
                    <img src={photo.url} className="w-24 h-24 object-cover rounded border border-primary/10" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1">
                      <p className="text-[6px] font-pixel text-center text-primary leading-tight">
                        {new Date(photo.timestamp).toLocaleDateString('pt-BR')}<br/>
                        {new Date(photo.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                      </p>
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
