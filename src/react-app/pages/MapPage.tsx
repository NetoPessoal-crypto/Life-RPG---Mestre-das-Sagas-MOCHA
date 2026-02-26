import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { Camera, Plus, X, BookOpen, ScrollText, ChevronLeft, ChevronRight, Dumbbell, Book, Coffee, Briefcase, Palmtree, MapPin, Sword } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- CONFIGURAÇÃO DOS PINS (VERSÃO SEGURA PARA VERCEL) ---
const iconOptions = [
  { id: 'default', color: '#9ca3af', label: 'PADRÃO' },
  { id: 'strength', color: '#ef4444', label: 'FORÇA' },
  { id: 'intel', color: '#3b82f6', label: 'ESTUDO' },
  { id: 'work', color: '#ca8a04', label: 'TRAMPO' },
  { id: 'rest', color: '#fb923c', label: 'CAFÉ' },
  { id: 'explore', color: '#22c55e', label: 'ROLÊ' },
  { id: 'combat', color: '#a855f7', label: 'LUTA' },
];

const createCustomIcon = (type: string) => {
  const option = iconOptions.find(o => o.id === type) || iconOptions[0];
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: black; border: 2px solid ${option.color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-center; box-shadow: 0 0 10px ${option.color}66;">
            <div style="width: 8px; height: 8px; background-color: ${option.color}; border-radius: 50%;"></div>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('default');
  const [description, setDescription] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewing, setViewing] = useState<{ pointId: string, photoIndex: number } | null>(null);
  const [revisitPointId, setRevisitPointId] = useState<string | null>(null);

  const lastPoint = state.mapPoints[state.mapPoints.length - 1];
  const center: [number, number] = [lastPoint?.lat || -23.55, lastPoint?.lng || -46.63];

  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width; let height = img.height;
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>, pointId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        if (pointId) { setRevisitPointId(pointId); setTempPhoto(compressed); }
        else { setTempPhoto(compressed); }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = () => {
    if (!name.trim() || !tempPhoto) return;
    navigator.geolocation.getCurrentPosition((p) => {
      addMapPoint({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        name: name.trim().toUpperCase(),
        iconType: selectedIcon,
        photos: [{ url: tempPhoto, timestamp: new Date().toISOString(), description }]
      });
      setName(''); setDescription(''); setTempPhoto(''); setSelectedIcon('default'); setShowForm(false);
    });
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24 text-white">
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h1 className="font-pixel text-primary text-[10px] flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> MAPA DE CONQUISTAS
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] h-8 glow-gold">
            {showForm ? 'FECHAR' : 'NOVA MISSÃO'}
          </Button>
        </div>

        {(showForm || revisitPointId) && (
          <div className="bg-card border-2 border-primary/30 p-4 rounded-lg space-y-4 z-[1001] relative animate-in zoom-in">
            <h2 className="font-pixel text-[8px] text-primary uppercase">Escolha o Ícone do Pin</h2>
            
            <div className="flex justify-between bg-black/40 p-2 rounded-lg border border-primary/10">
              {iconOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedIcon(opt.id)}
                  className={`p-2 rounded-md transition-all ${selectedIcon === opt.id ? 'bg-primary/20 border border-primary scale-110' : 'opacity-40 grayscale'}`}
                  style={{ color: opt.color }}
                >
                  <MapPin size={18} />
                </button>
              ))}
            </div>

            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NOME DO LOCAL..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="DESCRIÇÃO..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel h-16 resize-none" />
            
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? <img src={tempPhoto} className="w-full h-32 object-cover rounded shadow-lg" /> : <Camera className="w-6 h-6 text-primary opacity-50" />}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>

            <Button onClick={revisitPointId ? () => { addPhotoToPoint(revisitPointId, tempPhoto, description); setRevisitPointId(null); setTempPhoto(''); } : handleCheckIn} className="w-full font-pixel text-[10px] py-4">GRAVAR NO MAPA</Button>
          </div>
        )}

        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black z-0 shadow-2xl">
          <MapContainer center={center} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%', filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={center} />
            {state.mapPoints.map((point) => (
              <Marker key={point.id} position={[point.lat, point.lng]} icon={createCustomIcon(point.iconType)}>
                <Popup><div className="font-pixel text-[8px] uppercase">{point.name}</div></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* LISTA DE CARDS (LIVRO DE MEMÓRIAS) */}
        <div className="space-y-6">
           {[...state.mapPoints].reverse().map(p => (
             <div key={p.id} className="bg-card border-l-4 border-primary rounded-r-lg shadow-xl overflow-hidden">
               <div className="p-3 bg-primary/5 flex justify-between items-center">
                 <span className="font-pixel text-[9px] uppercase">{p.name}</span>
                 <label className="cursor-pointer bg-primary/20 p-2 rounded-full hover:bg-primary/40"><Plus size={12} /><input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, p.id)} className="hidden" /></label>
               </div>
               <div className="flex gap-3 p-3 overflow-x-auto bg-black/30">
                 {p.photos?.map((photo, i) => (
                   <div key={i} className="flex-shrink-0 cursor-pointer" onClick={() => setViewing({ pointId: p.id, photoIndex: i })}><img src={photo.url} className="w-20 h-20 object-cover rounded border border-primary/20" /></div>
                 ))}
               </div>
             </div>
           ))}
        </div>

        {/* MODAL DO LIVRO (PÁGINAS) */}
        {viewing && currentPoint && currentPhoto && (
          <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md" onClick={() => setViewing(null)}>
            <div className="bg-[#f4e4bc] w-full max-w-sm rounded shadow-2xl overflow-hidden border-l-[10px] border-[#3d2b1f] relative text-[#3d2b1f] animate-in slide-in-from-left duration-500" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-[#3d2b1f]/60" onClick={() => setViewing(null)}><X size={24} /></button>
              <div className="p-6 space-y-4 font-serif">
                <h2 className="font-pixel text-[11px] uppercase border-b border-[#3d2b1f]/20 pb-2">{currentPoint.name}</h2>
                <img src={currentPhoto.url} className="w-full h-44 object-cover rounded-sm shadow-md" />
                <p className="text-[12px] italic leading-relaxed">"{currentPhoto.description || "O herói não deixou relatos..."}"</p>
                <div className="flex justify-between pt-4">
                  <Button disabled={viewing.photoIndex === 0} onClick={() => setViewing({ ...viewing, photoIndex: viewing.photoIndex - 1 })} className="font-pixel text-[7px] text-black border-black/20">ANTERIOR</Button>
                  <Button disabled={viewing.photoIndex === currentPoint.photos.length - 1} onClick={() => setViewing({ ...viewing, photoIndex: viewing.photoIndex + 1 })} className="font-pixel text-[7px] text-black border-black/20">PRÓXIMA</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
