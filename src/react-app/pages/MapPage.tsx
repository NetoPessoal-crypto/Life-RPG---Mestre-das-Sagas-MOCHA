import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { Camera, Plus, X, BookOpen, ScrollText } from 'lucide-react';

export default function MapPage() {
  const { state, addMapPoint, addPhotoToPoint } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewing, setViewing] = useState<{ photo: any, locationName: string } | null>(null);
  const [revisitPointId, setRevisitPointId] = useState<string | null>(null);

  // COMPRESSOR: Evita a tela preta reduzindo a foto para 800px
  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
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
        if (pointId) {
          setRevisitPointId(pointId);
          setTempPhoto(compressed);
        } else {
          setTempPhoto(compressed);
        }
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

  const handleRevisitSubmit = () => {
    if (revisitPointId && tempPhoto) {
      addPhotoToPoint(revisitPointId, tempPhoto, description);
      setRevisitPointId(null);
      setTempPhoto('');
      setDescription('');
    }
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4 pb-24">
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h1 className="font-pixel text-primary text-[10px] flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> LIVRO DE JORNADAS
          </h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-pixel text-[8px]">
            {showForm ? 'FECHAR' : 'NOVO REGISTRO'}
          </Button>
        </div>

        {(showForm || revisitPointId) && (
          <div className="bg-card border-2 border-primary/20 p-4 rounded-lg space-y-4 animate-in fade-in zoom-in">
            <h2 className="font-pixel text-[8px] text-primary">{revisitPointId ? 'NOVA CRÔNICA NO LOCAL' : 'NOVA DESCOBERTA'}</h2>
            {!revisitPointId && <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NOME DO LOCAL..." className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel" />}
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="O QUE ACONTECEU? (OPCIONAL)" className="w-full bg-black border border-primary/40 p-3 text-white text-[10px] outline-none font-pixel h-20 resize-none" />
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer ${tempPhoto ? 'border-green-500 bg-green-500/10' : 'border-primary/40'}`}>
              {tempPhoto ? <img src={tempPhoto} className="w-full h-32 object-cover rounded" /> : <div className="text-center py-2"><Camera className="w-6 h-6 text-primary mx-auto mb-1 opacity-50" /><span className="font-pixel text-[7px] text-primary">{isProcessing ? 'PROCESSANDO...' : 'CAPTURAR IMAGEM'}</span></div>}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e)} className="hidden" />
            </label>
            <Button onClick={revisitPointId ? handleRevisitSubmit : handleCheckIn} disabled={(!name && !revisitPointId) || !tempPhoto || isProcessing} className="w-full font-pixel text-[10px] py-4">{revisitPointId ? 'SALVAR CRÔNICA' : 'REGISTRAR (+25 XP)'}</Button>
            {revisitPointId && <Button onClick={() => setRevisitPointId(null)} variant="ghost" className="w-full font-pixel text-[8px] text-red-500">CANCELAR</Button>}
          </div>
        )}

        <div className="relative aspect-square border-4 border-double border-primary/30 rounded-lg overflow-hidden bg-black opacity-80">
          <iframe width="100%" height="100%" style={{ filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.6)' }} src={`https://www.openstreetmap.org/export/embed.html?bbox=${(state.mapPoints[state.mapPoints.length-1]?.lng || -46.63)-0.003},${(state.mapPoints[state.mapPoints.length-1]?.lat || -23.55)-0.003},${(state.mapPoints[state.mapPoints.length-1]?.lng || -46.63)+0.003},${(state.mapPoints[state.mapPoints.length-1]?.lat || -23.55)+0.003}&layer=mapnik`} />
        </div>

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
                   <div key={i} className="flex-shrink-0 relative cursor-pointer" onClick={() => setViewing({ photo, locationName: p.name })}>
                      <img src={photo.url} className="w-20 h-20 object-cover rounded border border-primary/20" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 p-0.5 text-[5px] font-pixel text-center text-primary">{new Date(photo.timestamp).toLocaleDateString('pt-BR')}</div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>

        {viewing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm" onClick={() => setViewing(null)}>
            <div className="bg-[#f4e4bc] w-full max-w-sm rounded shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-book-open origin-left border-l-[10px] border-[#3d2b1f] relative text-[#3d2b1f]" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-[#3d2b1f]/60" onClick={() => setViewing(null)}><X className="w-6 h-6" /></button>
              <div className="p-6 space-y-4">
                <div className="border-b border-[#3d2b1f]/20 pb-2">
                  <h2 className="font-pixel text-[12px] uppercase">{viewing.locationName}</h2>
                  <p className="text-[10px] opacity-70">{new Date(viewing.photo.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                <img src={viewing.photo.url} className="w-full h-48 object-cover rounded-sm shadow-md" />
                <div className="space-y-2">
                  <ScrollText className="w-4 h-4 opacity-30" />
                  <p className="text-[12px] italic leading-relaxed font-serif">"{viewing.photo.description || "O herói não deixou relatos sobre este momento..."}"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes book-open { 0% { transform: perspective(1000px) rotateY(-90deg); opacity: 0; } 100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; } }
        .animate-book-open { animation: book-open 0.6s ease-out forwards; }
      `}</style>
    </AppShell>
  );
}
