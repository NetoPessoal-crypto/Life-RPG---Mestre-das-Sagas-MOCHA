import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { Camera, Plus, X, BookOpen, ScrollText, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
// Importamos o Leaflet para pins reais
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuração do Ícone do Pin (Estilo RPG)
const rpgIcon = new L.Icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Componente para centralizar o mapa automaticamente
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [viewing, setViewing] = useState<{ pointId: string, photoIndex: number } | null>(null);
  const [revisitPointId, setRevisitPointId] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const lastPoint = state.mapPoints[state.mapPoints.length - 1];
  const center: [number, number] = [lastPoint?.lat || -23.55, lastPoint?.lng || -46.63];

  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
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
        photos: [{ url: tempPhoto, timestamp: new Date().toISOString(), description }]
      });
      setName(''); setDescription(''); setTempPhoto(''); setShowForm(false);
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
          <div className="bg-card border-2 border-primary/20 p-4 rounded-lg space-y-4 animate-in fade-in zoom-in z-[1001] relative">
            <h2 className="font-pixel text-[8px] text-primary uppercase">{revisitPointId ? 'Adicionar Crônica' : 'Nova Descoberta'}</h2>
            {!revisitPointId && <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NOME DO LOCAL..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel" />}
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="O QUE ACONTECEU? (DESCRIÇÃO...)" className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel h-20 resize-none" />
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? <img src={tempPhoto} className="w-full h-32 object-cover rounded shadow-lg" /> : <div className="text-center py-2"><Camera className="w-6 h-6 text-primary mx-auto mb-1 opacity-50" /><span className="font-pixel text-[7px] text-primary">{isProcessing ? 'PROCESSANDO...' : 'REGISTRAR IMAGEM'}</span></div>}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>
            <Button onClick={revisitPointId ? () => { addPhotoToPoint(revisitPointId, tempPhoto, description); setRevisitPointId(null); setTempPhoto(''); setDescription(''); } : handleCheckIn} disabled={(!name && !revisitPointId) || !tempPhoto || isProcessing} className="w-full font-pixel text-[10px] py-4 shadow-lg">CONFIRMAR REGISTRO</Button>
          </div>
        )}

        {/* MAPA INTERATIVO COM MÚLTIPLOS PINS */}
        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black z-0">
          <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%', filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.6)' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={center} />
            
            {/* GERADOR DE PINS DINÂMICOS */}
            {state.mapPoints.map((point) => (
              <Marker key={point.id} position={[point.lat, point.lng]} icon={rpgIcon}>
                <Popup>
                  <div className="font-pixel text-[8px] uppercase text-black">{point.name}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* LISTA DE REGISTROS (CARDS) */}
        <div className="space-y-6">
           {[...state.mapPoints].reverse().map(p => (
             <div key={p.id} className="bg-card border-l-4 border-primary rounded-r-lg shadow-xl overflow-hidden">
               <div className="p-3 bg-primary/5 flex justify-between items-center">
                 <span className="font-pixel text-[9px] text-white uppercase">{p.name}</span>
                 <label className="cursor-pointer bg-primary/20 p-2 rounded-full hover:bg-primary/40">
                   <Plus className="w-3 h-3 text-primary" /><input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, p.id)} className="hidden" />
                 </label>
               </div>
               <div className="flex gap-3 p-3 overflow-x-auto bg-black/30 scrollbar-hide">
                 {p.photos?.map((photo, i) => (
                   <div key={i} className="flex-shrink-0 relative cursor-pointer" onClick={() => setViewing({ pointId: p.id, photoIndex: i })}>
                      <img src={photo.url} className="w-20 h-20 object-cover rounded border border-primary/20" />
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>

        {/* MODAL DO LIVRO (MANTIDO IGUAL) */}
        {viewing && currentPoint && currentPhoto && (
          <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md" onClick={() => setViewing(null)}>
            <div className="bg-[#f4e4bc] w-full max-w-sm rounded shadow-xl animate-book-open origin-left border-l-[10px] border-[#3d2b1f] relative text-[#3d2b1f]" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-[#3d2b1f]/60 z-10" onClick={() => setViewing(null)}><X className="w-6 h-6" /></button>
              <div className="p-6 space-y-4 font-serif">
                <div className="border-b border-[#3d2b1f]/20 pb-2">
                  <h2 className="font-pixel text-[11px] uppercase">{currentPoint.name}</h2>
                  <p className="text-[8px] opacity-60">Página {viewing.photoIndex + 1}</p>
                </div>
                <img src={currentPhoto.url} className="w-full h-44 object-cover rounded-sm" />
                <p className="text-[12px] italic leading-relaxed">"{currentPhoto.description || "Sem relatos..."}"</p>
                
                <div className="flex justify-between pt-4">
                  <Button disabled={viewing.photoIndex === 0} onClick={() => setViewing({ ...viewing, photoIndex: viewing.photoIndex - 1 })} className="font-pixel text-[7px]">Anterior</Button>
                  <Button disabled={viewing.photoIndex === currentPoint.photos.length - 1} onClick={() => setViewing({ ...viewing, photoIndex: viewing.photoIndex + 1 })} className="font-pixel text-[7px]">Próxima</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes book-open { 0% { transform: perspective(1000px) rotateY(-90deg); opacity: 0; } 100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; } }
        .animate-book-open { animation: book-open 0.6s ease-out forwards; }
        .leaflet-container { background: #000 !important; }
      `}</style>
    </AppShell>
  );
}
