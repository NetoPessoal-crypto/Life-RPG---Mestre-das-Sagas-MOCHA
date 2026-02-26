import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Compass, Lock, Plus, Camera, X, Maximize2 } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Estado para controlar qual foto está sendo visualizada em tela cheia
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const handleCheckIn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name.trim() || !tempPhoto) return;
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
      () => { 
        alert("Ative o GPS para registrar!"); 
        setIsGettingLocation(false); 
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h1 className="font-pixel text-primary text-[10px] flex items-center gap-2">
            <Compass className="animate-spin-slow w-4 h-4" /> DIÁRIO DE JORNADAS
          </h1>
          <Button type="button" onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] h-8 glow-gold">
            {showForm ? 'VOLTAR' : 'NOVA MISSÃO'}
          </Button>
        </div>

        {/* FORMULÁRIO */}
        {showForm && (
          <div className="bg-card border-2 border-primary/20 p-4 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-4">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="NOME DO LOCAL..."
              className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel"
            />
            
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? (
                <img src={tempPhoto} className="w-full h-40 object-cover rounded shadow-lg" />
              ) : (
                <div className="text-center py-4">
                  <Camera className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
                  <span className="font-pixel text-[8px] text-primary">TIRAR FOTO OBRIGATÓRIA</span>
                </div>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>

            <Button type="button" onClick={handleCheckIn} disabled={!name || !tempPhoto || isGettingLocation} className="w-full font-pixel text-[10px] py-6">
              {isGettingLocation ? ' MAPEANDO...' : 'REGISTRAR CONQUISTA (+20 XP)'}
            </Button>
          </div>
        )}

        {/* MAPA E NÉVOA */}
        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black shadow-inner">
          <iframe
            width="100%" height="100%"
            style={{ filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.6)' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.003},${lat-0.003},${lng+0.003},${lat+0.003}&layer=mapnik&marker=${lat},${lng}`}
          ></iframe>

          <div className="absolute inset-0 pointer-events-none"
               style={{ 
                 backgroundColor: 'rgba(0,0,0,0.85)',
                 maskImage: state.mapPoints.length > 0 ? 'radial-gradient(circle 100px at center, transparent 10%, black 90%)' : 'none',
                 WebkitMaskImage: state.mapPoints.length > 0 ? 'radial-gradient(circle 100px at center, transparent 10%, black 90%)' : 'none'
               }}>
          </div>
        </div>

        {/* LISTA DE REGISTROS */}
        <div className="space-y-6">
           {[...state.mapPoints].reverse().map(p => (
             <div key={p.id} className="bg-card border-l-4 border-primary rounded-r-lg shadow-xl animate-in fade-in">
               <div className="p-3 bg-primary/5 flex justify-between items-center">
                 <span className="font-pixel text-[9px] text-white uppercase tracking-tighter">{p.name}</span>
                 <label className="cursor-pointer bg-primary/20 p-2 rounded-full hover:bg-primary/40 transition-all">
                   <Plus className="w-3 h-3 text-primary" />
                   <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, p.id)} className="hidden" />
                 </label>
               </div>
               
               <div className="flex gap-3 p-3 overflow-x-auto bg-black/30 scrollbar-hide">
                 {p.photos?.map((photo, i) => (
                   <div key={i} className="flex-shrink-0 relative group">
                     {/* Clique na imagem para abrir o Visualizador */}
                     <div 
                        className="relative cursor-zoom-in"
                        onClick={() => setSelectedPhoto(photo.url)}
                     >
                        <img src={photo.url} className="w-24 h-24 object-cover rounded border border-primary/20 hover:border-primary transition-all" />
                        <div className="absolute top-1 right-1 bg-black/60 p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3 h-3 text-white" />
                        </div>
                     </div>
                     <div className="mt-1 text-[6px] font-pixel text-center text-muted-foreground uppercase">
                       {new Date(photo.timestamp).toLocaleDateString('pt-BR')}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>

        {/* --- MODAL DE VISUALIZAÇÃO (O GRIMÓRIO DE FOTOS) --- */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedPhoto(null)} // Fecha ao clicar fora
          >
            <div className="relative max-w-full max-h-[90vh] flex flex-col items-center">
               <button 
                  className="absolute -top-12 right-0 bg-primary/20 text-primary p-2 rounded-full border border-primary/40 hover:bg-primary/40"
                  onClick={() => setSelectedPhoto(null)}
               >
                 <X className="w-6 h-6" />
               </button>
               
               <div className="border-4 border-double border-primary/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(212,168,83,0.4)]">
                  <img 
                    src={selectedPhoto} 
                    className="max-w-full max-h-[70vh] object-contain"
                    alt="Registro de Jornada"
                  />
               </div>
               
               <p className="font-pixel text-[10px] text-primary mt-6 animate-pulse">
                 MEMÓRIA PRESERVADA
               </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
