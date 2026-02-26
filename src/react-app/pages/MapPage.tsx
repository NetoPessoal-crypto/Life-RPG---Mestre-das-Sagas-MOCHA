import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Plus, Camera, Compass, Lock } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = () => {
    if (!name.trim()) return;
    
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          addMapPoint({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: name.trim(),
            photo: photo || undefined
          });
          setName('');
          setPhoto('');
          setShowForm(false);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Add with default location for demo
          addMapPoint({
            lat: -23.5505 + (Math.random() - 0.5) * 0.1,
            lng: -46.6333 + (Math.random() - 0.5) * 0.1,
            name: name.trim(),
            photo: photo || undefined
          });
          setName('');
          setPhoto('');
          setShowForm(false);
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      // Fallback for browsers without geolocation
      addMapPoint({
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1,
        name: name.trim(),
        photo: photo || undefined
      });
      setName('');
      setPhoto('');
      setShowForm(false);
      setIsGettingLocation(false);
    }
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-pixel text-sm text-primary flex items-center gap-2">
            <Compass className="w-5 h-5" />
            MAPA DE EXPLORAÇÃO
          </h1>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="font-pixel text-[10px] glow-gold"
          >
            <Plus className="w-4 h-4 mr-1" />
            CHECK-IN
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-4">
            <div>
              <label className="block font-pixel text-[10px] text-muted-foreground mb-2">
                NOME DO LOCAL
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Parque Ibirapuera"
                className="w-full bg-muted border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block font-pixel text-[10px] text-muted-foreground mb-2">
                FOTO (OPCIONAL)
              </label>
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 bg-muted border border-dashed border-border rounded px-3 py-4 cursor-pointer hover:border-primary transition-colors">
                  <Camera className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {photo ? 'Foto selecionada' : 'Adicionar foto'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              {photo && (
                <img src={photo} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
              )}
            </div>

            <Button 
              onClick={handleCheckIn} 
              disabled={!name.trim() || isGettingLocation}
              className="w-full font-pixel text-[10px]"
            >
              {isGettingLocation ? 'OBTENDO LOCALIZAÇÃO...' : 'FAZER CHECK-IN (+10 EXPL)'}
            </Button>
          </div>
        )}

        {/* Map Visualization */}
        <div className="relative bg-card border border-primary/20 rounded-lg overflow-hidden aspect-square">
          {/* Fog overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Revealed areas */}
            {state.mapPoints.map((point, index) => (
              <div
                key={point.id}
                className="absolute w-24 h-24 rounded-full"
                style={{
                  left: `${((point.lng + 180) / 360) * 100}%`,
                  top: `${((90 - point.lat) / 180) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, transparent 30%, rgba(212,168,83,0.1) 70%, transparent 100%)',
                  boxShadow: '0 0 40px 20px rgba(212,168,83,0.1)'
                }}
              />
            ))}
            
            {/* Map pins */}
            {state.mapPoints.map((point, index) => (
              <div
                key={`pin-${point.id}`}
                className="absolute group cursor-pointer"
                style={{
                  left: `${20 + (index % 4) * 20}%`,
                  top: `${20 + Math.floor(index / 4) * 25}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative">
                  <MapPin className="w-8 h-8 text-primary drop-shadow-lg" />
                  {point.photo && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <img 
                        src={point.photo} 
                        alt={point.name}
                        className="w-16 h-16 object-cover rounded border-2 border-primary"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[8px] font-pixel text-center mt-1 text-foreground max-w-[60px] truncate">
                  {point.name}
                </p>
              </div>
            ))}
            
            {/* Empty state */}
            {state.mapPoints.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <Lock className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="font-pixel text-xs text-muted-foreground">TERRITÓRIO INEXPLORADO</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Faça check-in em locais para revelar o mapa
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Discovered Places */}
        {state.mapPoints.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-pixel text-[10px] text-muted-foreground">
              LUGARES DESCOBERTOS ({state.mapPoints.length})
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {state.mapPoints.map(point => (
                <div key={point.id} className="flex items-center gap-3 bg-card border border-border rounded p-2">
                  {point.photo ? (
                    <img src={point.photo} alt={point.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{point.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(point.discoveredAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
