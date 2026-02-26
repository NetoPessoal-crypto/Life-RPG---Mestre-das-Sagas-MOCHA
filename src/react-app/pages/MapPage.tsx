import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { Camera, Plus, X, BookOpen, ScrollText, ChevronLeft, ChevronRight, Dumbbell, Book, Coffee, Briefcase, Palmtree, MapPin, Sword } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';

// --- OPÇÕES DE PINS ---
const iconOptions = [
  { id: 'default', icon: <MapPin />, color: 'text-gray-400' },
  { id: 'strength', icon: <Dumbbell />, color: 'text-red-500' },
  { id: 'intel', icon: <Book />, color: 'text-blue-500' },
  { id: 'work', icon: <Briefcase />, color: 'text-yellow-600' },
  { id: 'rest', icon: <Coffee />, color: 'text-orange-400' },
  { id: 'explore', icon: <Palmtree />, color: 'text-green-500' },
  { id: 'combat', icon: <Sword />, color: 'text-purple-500' },
];

const getRPGIcon = (type: string) => {
  const option = iconOptions.find(o => o.id === type) || iconOptions[0];
  const iconHTML = renderToStaticMarkup(
    <div className={`bg-black/90 p-2 rounded-full border-2 border-primary shadow-lg flex items-center justify-center ${option.color}`}>
      {option.icon}
    </div>
  );
  return L.divIcon({ html: iconHTML, className: 'custom-rpg-icon', iconSize: [40, 40], iconAnchor: [20, 20] });
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
        lat: p.coords.latitude, lng: p.coords.longitude,
        name: name.trim().toUpperCase(), iconType: selectedIcon,
        photos: [{ url: tempPhoto, timestamp: new Date().toISOString(), description }]
      });
      setName(''); setDescription(''); setTempPhoto(''); setSelectedIcon('default'); setShowForm(false);
    });
  };

  const currentPoint = viewing ? state.mapPoints.find(p => p.id === viewing.pointId) : null;
  const currentPhoto = currentPoint && viewing ? currentPoint.photos[viewing.photoIndex] : null;

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h1 className="font-pixel text-primary text-[10px] flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> MAPA DE CONQUISTAS
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] h-8 glow-gold">
            {showForm ? 'FECHAR' : 'NOVA MISSÃO'}
          </Button>
        </div>

        {/* FORMULÁRIO */}
        {(showForm || revisitPointId) && (
          <div className="bg-card border-2 border-primary/30 p-4 rounded-lg space-y-4 z-[1001] relative animate-in zoom-in">
            <h2 className="font-pixel text-[8px] text-primary uppercase">{revisitPointId ? 'Nova Crónica' : 'Escolha a sua Marca'}</h2>
            
            {!revisitPointId && (
              <div className="flex justify-between bg-black/40 p-2 rounded-lg border border-primary/10">
                {iconOptions.map((opt) => (
                  <button key={opt.id} onClick={() => setSelectedIcon(opt.id)} className={`p-2 rounded-md transition-all ${selectedIcon === opt.id ? 'bg-primary/20 border border-primary scale-110' : 'opacity-40 grayscale'}`}>
                    <div className={opt.color}>{opt.icon}</div>
                  </button>
                ))}
              </div>
            )}

            {!revisitPointId && <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NOME DO LOCAL..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel" />}
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="DESCRIÇÃO DA MEMÓRIA..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel h-16 resize-none" />
            
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? <img src={tempPhoto} className="w-full h-32 object-cover rounded shadow-lg" /> : <div className="text-center py-2"><Camera className="w-6 h-6 text-primary mx-auto mb-1 opacity-50" /><span className="font-pixel text-[7px] text-primary">{isProcessing ? 'PROCESSANDO...' : 'FOTO OBRIGATÓRIA'}</span></div>}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>

            <Button onClick={revisitPointId ? () => { addPhotoToPoint(revisitPointId, tempPhoto, description); setRevisitPointId(null); setTempPhoto(''); setDescription(''); } : handleCheckIn} disabled={(!name && !revisitPointId) || !tempPhoto || isProcessing} className="w-full font-pixel text-[10px] py-4 shadow-lg">GRAVAR NO LIVRO</Button>
            {revisitPointId && <Button onClick={() => setRevisitPointId(null)} variant="ghost" className="w-full font-pixel text-[8px] text-red-500">CANCELAR</Button>}
          </div>
        )}

        {/* MAPA COM PINS */}
        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black z-0 shadow-2xl">
          <MapContainer center={center} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%', filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.6)' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={center} />
            {state.mapPoints.map((point) => (
              <Marker key={point.id} position={[point.lat, point.lng]} icon={getRPGIcon(point.iconType)}>
                <Popup><div className="font-pixel text-[8px] uppercase text-black">{point.name}</div></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* LISTA DE CARDS */}
        <div className="space-y-6">
           {[...state.mapPoints].reverse().map(p => (
             <div key={p.id} className="bg-card border-l-4 border-primary rounded-r-lg shadow-xl overflow-hidden">
               <div className="p-3 bg-primary/5 flex justify-between items-center">
                 <span className="font-pixel text-[9px] text-white uppercase">{p.name}</span>
                 <label className="cursor-pointer bg-primary/20 p-2 rounded-full hover:bg-primary/40"><Plus className="w-3 h-3 text-primary" /><input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, p.id)} className="hidden" /></label>
               </div>
               <div className="flex gap-3 p-3 overflow-x-auto bg-black/30 scrollbar-hide">
                 {p.photos?.map((photo, i) => (
                   <div key={i} className="flex-shrink-0 relative cursor-pointer active:scale-95 transition-transform" onClick={() => setViewing({ pointId: p.id, photoIndex: i })}><img src={photo.url} className="w-20 h-20 object-cover rounded border border-primary/20" /></div>
                 ))}
               </div>
             </div>
           ))}
        </div>

        {/* MODAL DO LIVRO */}
        {viewing && currentPoint && currentPhoto && (
          <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md" onClick={() => setViewing(null)}>
            <div className="bg-[#f4e4bc] w-full max-w-sm rounded shadow-2xl animate-book-open origin-left border-l-[10px] border-[#3d2b1f] relative text-[#3d2b1f]" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-[#3d2b1f]/60 z-10" onClick={() => setViewing(null)}><X className="w-6 h-6" /></button>
              <div className="p-6 space-y-4 font-serif relative">
                <div className="border-b border-[#3d2b1f]/20 pb-2"><h2 className="font-pixel text-[11px] uppercase tracking-tighter">{currentPoint.name}</h2><p className="text-[8px] opacity-60">Crónica {viewing.photoIndex + 1} de {currentPoint.photos.length}</p></div>
                <img src={currentPhoto.url} className="w-full h-44 object-cover rounded-sm grayscale-[0.2]" />
                <p className="text-[12px] italic leading-relaxed min-h-[60px]">"{currentPhoto.description || "O herói não deixou relatos..."}"</p>
                <div className="flex justify-between items-center pt-2">
                  <button disabled={viewing.photoIndex === 0} onClick={() => setViewing({ ...viewing, photoIndex: viewing.photoIndex - 1 })} className={`flex items-center gap-1 font-pixel text-[7px] ${viewing.photoIndex === 0 ? 'opacity-0' : 'opacity-100'}`}><ChevronLeft className="w-3 h-3" /> ANTERIOR</button>
                  <button disabled={viewing.photoIndex === currentPoint.photos.length - 1} onClick={() => setViewing({ ...viewing, photoIndex: viewing.photoIndex + 1 })} className={`flex items-center gap-1 font-pixel text-[7px] ${viewing.photoIndex === currentPoint.photos.length - 1 ? 'opacity-0' : 'opacity-100'}`}>PRÓXIMA <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes book-open { 0% { transform: perspective(1000px) rotateY(-90deg); opacity: 0; } 100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; } }
        .animate-book-open { animation: book-open 0.6s ease-out forwards; }
        .custom-rpg-icon { background: none; border: none; }
        .leaflet-container { background: #000 !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </AppShell>
  );
}
