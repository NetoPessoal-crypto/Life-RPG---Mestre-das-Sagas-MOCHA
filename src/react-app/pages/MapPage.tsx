import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { Camera, Plus, X, BookOpen, ScrollText, ChevronLeft, ChevronRight, Sword, Book, Dumbbell, Coffee, Palmtree, Briefcase } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';

// --- LÓGICA DE ÍCONES DE RPG ---

const getRPGIcon = (name: string) => {
  const n = name.toLowerCase();
  let iconNode = <MapPin className="text-primary" />; // Padrão

  if (n.includes('academia') || n.includes('treino') || n.includes('gym')) iconNode = <Dumbbell className="text-red-500" />;
  if (n.includes('estudo') || n.includes('aula') || n.includes('biblioteca')) iconNode = <Book className="text-blue-500" />;
  if (n.includes('trabalho') || n.includes('trampo') || n.includes('escritório')) iconNode = <Briefcase className="text-yellow-600" />;
  if (n.includes('café') || n.includes('restaurante') || n.includes('comida')) iconNode = <Coffee className="text-orange-400" />;
  if (n.includes('parque') || n.includes('praça') || n.includes('viagem')) iconNode = <Palmtree className="text-green-500" />;

  const iconHTML = renderToStaticMarkup(
    <div className="bg-black/80 p-1.5 rounded-full border-2 border-primary shadow-[0_0_10px_rgba(212,168,83,0.5)]">
      {iconNode}
    </div>
  );

  return L.divIcon({
    html: iconHTML,
    className: 'custom-rpg-icon',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
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
  const [description, setDescription] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewing, setViewing] = useState<{ pointId: string, photoIndex: number } | null>(null);
  const [revisitPointId, setRevisitPointId] = useState<string | null>(null);

  const lastPoint = state.mapPoints[state.mapPoints.length - 1];
  const center: [number, number] = [lastPoint?.lat || -23.55, lastPoint?.lng || -46.63];

  // ... (Manter as funções de compressImage e handleCapture que já usamos)

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h1 className="font-pixel text-primary text-[10px] flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> MAPA MUNDI
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] h-8 glow-gold">
            {showForm ? 'FECHAR' : 'NOVA EXPEDIÇÃO'}
          </Button>
        </div>

        {/* MAPA INTERATIVO COM PINS TEMÁTICOS */}
        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black z-0 shadow-2xl">
          <MapContainer 
            center={center} 
            zoom={15} 
            zoomControl={false}
            style={{ height: '100%', width: '100%', filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.6)' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={center} />
            
            {state.mapPoints.map((point) => (
              <Marker 
                key={point.id} 
                position={[point.lat, point.lng]} 
                icon={getRPGIcon(point.name)}
              >
                <Popup>
                  <div className="p-1 text-center">
                    <p className="font-pixel text-[8px] uppercase font-bold">{point.name}</p>
                    <p className="text-[7px] text-muted-foreground mt-1">
                      {point.photos.length} Registos
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Overlay de Vinheta para dar profundidade */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-[400]" />
        </div>

        {/* FORMULÁRIO E LISTA DE CARDS (Mantém a lógica de fotos e descrições) */}
        {/* ... (O resto do código que já tínhamos para a lista e o livro) */}
        
      </div>

      <style>{`
        .custom-rpg-icon { background: none; border: none; }
        .leaflet-popup-content-wrapper { background: #1a1a1a; color: #fff; border: 1px solid #d4a853; border-radius: 4px; }
        .leaflet-popup-tip { background: #d4a853; }
        @keyframes book-open { 0% { transform: perspective(1000px) rotateY(-90deg); opacity: 0; } 100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; } }
        .animate-book-open { animation: book-open 0.6s ease-out forwards; }
      `}</style>
    </AppShell>
  );
}
