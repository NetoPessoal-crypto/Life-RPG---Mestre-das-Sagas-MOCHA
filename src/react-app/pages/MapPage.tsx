import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Camera, Plus, Clock, Map as MapIcon } from 'lucide-react';

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
      alert("Erro de GPS. Tente novamente.");
      setIsLocating(false);
    });
  };

  return (
    <AppShell>
      <div className="p-4 space-y-6 pb-24">
        {/* Header Estilo RPG */}
        <div className="flex justify-between items-center border-b border-primary/20 pb-4">
          <div>
            <h1 className="font-pixel text-primary text-xs flex items-center gap-2">
              <MapIcon className="w-5 h-5 animate-pulse" /> MAPA DE CONQUISTAS
            </h1>
            <p className="text-[8px] font-pixel text-muted-foreground mt-1">
              {state.mapPoints.length} TERRITÓRIOS MAPEADOS
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] glow-gold">
            {showForm ? 'FECHAR' : 'NOVA EXPEDIÇÃO'}
          </Button>
        </div>

        {/* Formulário de Registro (Só aparece se clicar em Nova Expedição) */}
        {showForm && (
          <div className="bg-card border-2 border-primary/50 p-4 rounded-lg space-y-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-2">
              <label className="font-pixel text-[8px] text-primary">NOME DA ÁREA DESCOBERTA</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="EX: ACADEMIA / TRABALHO / PARQUE"
                className="w-full bg-black border border-primary/40 p-3 text-white text-xs outline-none focus:border-primary transition-all"
              />
            </div>
            
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40 hover:bg-primary/5'}`}>
              {tempPhoto ? (
                <div className="relative w-full h-40">
                  <img src={tempPhoto} className="w-full h-full object-cover rounded shadow-lg" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                </div>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-primary mb-2 opacity-50" />
                  <span className="font-pixel text-[8px] text-primary">TIRAR FOTO OBRIGATÓRIA</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>

            <Button onClick={handleNewCheckIn} disabled={!name || !tempPhoto || isLocating} className="w-full font-pixel text-[10px] h-12 shadow-lg">
              {isLocating ? 'MAPEANDO COORDENADAS...' : 'CONFIRMAR DESCOBERTA (+20 XP)'}
            </Button>
          </div>
        )}

        {/* Lista de Territórios (Cards com Print do Mapa) */}
        <div className="space-y-8">
          {[...state.mapPoints].reverse().map((point, index) => (
            <div key={point.id} className="relative bg-card border border-primary/20 rounded-lg overflow-hidden shadow-2xl group">
              
              {/* PRINT DO MAPA (Estático no fundo do topo) */}
              <div className="h-32 w-full relative border-b border-primary/10 grayscale contrast-125 brightness-[0.4] pointer-events-none">
                <iframe
                  width="100%" height="100%" frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${point.lng-0.002},${point.lat-0.002},${point.lng+0.002},${point.lat+0.002}&layer=mapnik&marker=${point.lat},${point.lng}`}
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>

              {/* Informações do Local */}
              <div className="p-4 -mt-10 relative z-10 flex justify-between items-end">
                <div className="bg-card/80 backdrop-blur-md p-3 rounded-lg border border-primary/20 shadow-xl">
                  <h3 className="font-pixel text-xs text-white leading-none">{point.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[7px] font-pixel text-primary bg-primary/10 px-2 py-0.5 rounded">
                      NÍVEL DE EXPLORAÇÃO: {point.photos.length}
                    </span>
                  </div>
                </div>
                
                {/* Botão para Add Mais Fotos (Update) */}
                <label className="bg-primary p-3 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg glow-gold">
                  <Plus className="w-5 h-5 text-black" />
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, point.id)} className="hidden" />
                </label>
              </div>

              {/* Galeria de Fotos (Linha do Tempo) */}
              <div className="p-4 space-y-3">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {point.photos.map((photo, i) => (
                    <div key={i} className="flex-shrink-0 w-32 relative rounded-md overflow-hidden border border-white/5">
                      <img src={photo.url} className="w-full h-32 object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1.5 border-t border-primary/20">
                        <p className="text-[6px] font-pixel text-primary text-center leading-tight">
                          {new Date(photo.timestamp).toLocaleDateString('pt-BR')}<br/>
                          {new Date(photo.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rodapé do Card com Coordenadas de RPG */}
              <div className="px-4 py-2 bg-primary/5 flex justify-between items-center">
                <p className="text-[6px] font-mono text-muted-foreground uppercase">
                  LOC: {point.lat.toFixed(4)} / {point.lng.toFixed(4)}
                </p>
                <div className="flex gap-1">
                   <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                   <span className="text-[6px] font-pixel text-primary">SINAL ESTÁVEL</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vazio */}
        {state.mapPoints.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <ImageIcon className="w-12 h-12 mx-auto mb-4" />
            <p className="font-pixel text-[10px]">NENHUM TERRITÓRIO REGISTRADO</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
