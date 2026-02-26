import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { MapPin, Camera, Plus, Clock, X, ScrollText, BookOpen } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Guardamos o objeto da foto e o nome do local para mostrar no Livro
  const [viewing, setViewing] = useState<{ photo: any, locationName: string } | null>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>, pointId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (pointId) {
          const desc = prompt("Adicione uma descrição para esta nova memória (opcional):") || "";
          addPhotoToPoint(pointId, base64, desc);
        } else {
          setTempPhoto(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = () => {
    if (!name.trim() || !tempPhoto) return;
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (p) => {
        addMapPoint({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          name: name.trim().toUpperCase(),
          photos: [{ url: tempPhoto, timestamp: new Date().toISOString(), description }]
        });
        setName(''); setDescription(''); setTempPhoto(''); setShowForm(false); setIsGettingLocation(false);
      },
      () => { alert("GPS desligado!"); setIsGettingLocation(false); },
      { enableHighAccuracy: true }
    );
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h1 className="font-pixel text-primary text-[10px] flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> LIVRO DE JORNADAS
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px] h-8">
            {showForm ? 'FECHAR' : 'NOVO REGISTRO'}
          </Button>
        </div>

        {/* FORMULÁRIO */}
        {showForm && (
          <div className="bg-card border-2 border-primary/20 p-4 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="NOME DO LOCAL (EX: CASTELO DA ACADEMIA)"
              className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel"
            />
            
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="O QUE ACONTECEU NESTA EXPEDIÇÃO? (OPCIONAL)"
              className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel h-20 resize-none"
            />
            
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? <img src={tempPhoto} className="w-full h-32 object-cover rounded shadow-lg" /> : <div className="text-center py-2"><Camera className="w-6 h-6 text-primary mx-auto mb-1 opacity-50" /><span className="font-pixel text-[7px] text-primary">REGISTRAR IMAGEM</span></div>}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>

            <Button onClick={handleCheckIn} disabled={!name || !tempPhoto || isGettingLocation} className="w-full font-pixel text-[10px] py-4">
              {isGettingLocation ? ' mapeando...' : 'ESCRIBIR NA HISTÓRIA (+25 XP)'}
            </Button>
          </div>
        )}

        {/* O MAPA INTERATIVO AINDA AQUI */}
        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black shadow-inner opacity-80">
          <iframe
            width="100%" height="100%"
            style={{ filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.6)' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(state.mapPoints[state.mapPoints.length-1]?.lng || -46.63)-0.003},${(state.mapPoints[state.mapPoints.length-1]?.lat || -23.55)-0.003},${(state.mapPoints[state.mapPoints.length-1]?.lng || -46.63)+0.003},${(state.mapPoints[state.mapPoints.length-1]?.lat || -23.55)+0.003}&layer=mapnik`}
          ></iframe>
        </div>

        {/* LISTA DE REGISTROS */}
        <div className="space-y-6 mt-4">
           {[...state.mapPoints].reverse().map(p => (
             <div key={p.id} className="bg-card border-l-4 border-primary rounded-r-lg shadow-xl">
               <div className="p-3 bg-primary/5 flex justify-between items-center">
                 <span className="font-pixel text-[9px] text-white uppercase tracking-tighter">{p.name}</span>
                 <label className="cursor-pointer bg-primary/20 p-2 rounded-full">
                   <Plus className="w-3 h-3 text-primary" />
                   <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, p.id)} className="hidden" />
                 </label>
               </div>
               
               <div className="flex gap-3 p-3 overflow-x-auto bg-black/30 scrollbar-hide">
                 {p.photos?.map((photo, i) => (
                   <div key={i} className="flex-shrink-0 relative cursor-pointer" onClick={() => setViewing({ photo, locationName: p.name })}>
                      <img src={photo.url} className="w-20 h-20 object-cover rounded border border-primary/20" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 p-0.5 text-[5px] font-pixel text-center text-primary">
                        {new Date(photo.timestamp).toLocaleDateString('pt-BR')}
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>

        {/* --- MODAL ESTILO LIVRO ABRINDO --- */}
        {viewing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm" onClick={() => setViewing(null)}>
            <div 
              className="bg-[#f4e4bc] w-full max-w-sm rounded-sm shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-book-open origin-left border-l-[12px] border-[#3d2b1f] relative text-[#3d2b1f]"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-2 right-2 text-[#3d2b1f]/60" onClick={() => setViewing(null)}>
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 space-y-4 font-serif">
                <div className="border-b border-[#3d2b1f]/20 pb-2">
                  <h2 className="font-pixel text-[12px] uppercase">{viewing.locationName}</h2>
                  <p className="text-[10px] italic flex items-center gap-1 mt-1 opacity-70">
                    <Clock className="w-3 h-3" /> 
                    {new Date(viewing.photo.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="border-2 border-[#3d2b1f]/10 p-1 bg-white/40 shadow-inner">
                  <img src={viewing.photo.url} className="w-full h-48 object-cover rounded-sm" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-40">
                    <ScrollText className="w-4 h-4" />
                    <div className="h-[1px] bg-[#3d2b1f] flex-1" />
                  </div>
                  <p className="text-[12px] leading-relaxed min-h-[60px]">
                    {viewing.photo.description || "Nenhuma crônica registrada para este momento."}
                  </p>
                </div>

                <div className="text-center pt-4 opacity-20">
                  <p className="font-pixel text-[8px]">pág. {Math.floor(Math.random() * 99) + 1}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes book-open {
          0% { transform: perspective(1000px) rotateY(-90deg); opacity: 0; }
          100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; }
        }
        .animate-book-open {
          animation: book-open 0.6s ease-out forwards;
        }
      `}</style>
    </AppShell>
  );
}
