import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Camera, Plus, Clock, Image as ImageIcon } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');

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
    navigator.geolocation.getCurrentPosition((p) => {
      addMapPoint({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        name: name.toUpperCase(),
        photos: [{ url: tempPhoto, timestamp: new Date().toISOString() }]
      });
      setName(''); setTempPhoto(''); setShowForm(false);
    });
  };

  return (
    <AppShell>
      <div className="p-4 space-y-6 pb-24">
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-primary text-xs flex items-center gap-2">
            <MapPin className="animate-pulse" /> DIÁRIO DE EXPLORAÇÃO
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px]">
            {showForm ? 'CANCELAR' : 'DESCOBRIR'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border-2 border-primary/30 p-4 rounded-lg space-y-4">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="NOME DO TERRITÓRIO..."
              className="w-full bg-black border border-primary/40 p-3 text-white text-xs outline-none"
            />
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? <img src={tempPhoto} className="w-full h-32 object-cover rounded" /> : <><Camera className="w-8 h-8 text-primary mb-2" /><span className="font-pixel text-[8px] text-primary">FOTO OBRIGATÓRIA</span></>}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>
            <Button onClick={handleNewCheckIn} disabled={!name || !tempPhoto} className="w-full font-pixel text-[10px]">
              RECLAMAR TERRITÓRIO (+20 XP)
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {[...state.mapPoints].reverse().map(point => (
            <div key={point.id} className="bg-card border-l-4 border-primary rounded-r-lg overflow-hidden shadow-xl">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-pixel text-[10px] text-white">{point.name}</h3>
                  <p className="text-[7px] text-muted-foreground uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {point.photos.length} REGISTROS NESSA ÁREA
                  </p>
                </div>
                <label className="bg-primary/20 p-2 rounded-full cursor-pointer hover:bg-primary/40">
                  <Plus className="w-4 h-4 text-primary" />
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, point.id)} className="hidden" />
                </label>
              </div>

              <div className="flex gap-2 p-3 overflow-x-auto bg-black/20">
                {point.photos.map((photo, i) => (
                  <div key={i} className="flex-shrink-0 relative">
                    <img src={photo.url} className="w-28 h-28 object-cover rounded border border-primary/10" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1 text-[6px] font-pixel text-center text-primary leading-tight">
                      {new Date(photo.timestamp).toLocaleDateString('pt-BR')}<br/>
                      {new Date(photo.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
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
