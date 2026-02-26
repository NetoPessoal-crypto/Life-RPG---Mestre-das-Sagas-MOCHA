import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { Camera, Plus, X, BookOpen, ScrollText, ChevronLeft, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícone padrão do Leaflet (Evita erros de renderização no servidor)
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

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

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h1 className="font-pixel text-primary text-[10px] flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> MAPA MUNDI
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] h-8 glow-gold">
            {showForm ? 'FECHAR' : 'NOVA MISSÃO'}
          </Button>
        </div>

        {(showForm || revisitPointId) && (
          <div className="bg-card border-2 border-primary/30 p-4 rounded-lg space-y-4 z-[1001] relative animate-in zoom-in">
             <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NOME DO LOCAL..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel" />
             <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="DESCRIÇÃO..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel h-16" />
             <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer border-primary/40">
                {tempPhoto ? <img src={tempPhoto} className="w-full h-32 object-cover" /> : <Camera className="w-6 h-6 text-primary opacity-50" />}
                <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
             </label>
             <Button onClick={() => {
                navigator.geolocation.getCurrentPosition((p) => {
                  addMapPoint({ lat: p.coords.latitude, lng: p.coords.longitude, name, iconType: 'default', photos: [{ url: tempPhoto, timestamp: new Date().toISOString(), description }] });
                  setShowForm(false); setName(''); setTempPhoto('');
                });
             }} className="w-full font-pixel text-[10px] py-4">CONFIRMAR</Button>
          </div>
        )}

        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black z-0">
          <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%', filter: 'grayscale(1) invert(0.9)' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={center} />
            {state.mapPoints.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={defaultIcon}>
                <Popup><span className="font-pixel text-[8px]">{p.name}</span></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </AppShell>
  );
}
