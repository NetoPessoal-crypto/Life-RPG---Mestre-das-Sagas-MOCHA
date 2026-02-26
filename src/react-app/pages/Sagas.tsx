import { useState } from 'react';
import AppShell from '@/react-app/components/AppShell';
import { useGame } from '@/react-app/context/GameContext';
import { Button } from '@/react-app/components/ui/button';
import { ScrollText, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function SagasPage() {
  const { state, addSaga, deleteSaga } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rawText, setRawText] = useState('');
  const [expandedSaga, setExpandedSaga] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && rawText.trim()) {
      addSaga(name.trim(), rawText.trim());
      setName('');
      setRawText('');
      setShowForm(false);
    }
  };

  return (
    <AppShell>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-pixel text-sm text-primary flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            SAGAS
          </h1>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="font-pixel text-[10px] glow-gold"
          >
            <Plus className="w-4 h-4 mr-1" />
            NOVA SAGA
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card border border-primary/30 rounded-lg p-4 space-y-4">
            <div>
              <label className="block font-pixel text-[10px] text-muted-foreground mb-2">
                NOME DA SAGA
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Rotina Semanal"
                className="w-full bg-muted border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-pixel text-[10px] text-muted-foreground mb-2">
                LISTA DE TAREFAS
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Segunda: Treino A\nTerça: Estudo React\nQuarta: Cardio\nQuinta: Meditação`}
                rows={6}
                className="w-full bg-muted border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
              />
              <p className="text-[10px] text-muted-foreground mt-2">
                Formato: "Dia: Tarefa" separados por linha ou ponto-e-vírgula.
                O app detecta automaticamente o atributo pela palavra-chave.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 font-pixel text-[10px]">
                CRIAR SAGA
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="font-pixel text-[10px]"
              >
                CANCELAR
              </Button>
            </div>
          </form>
        )}

        {/* Sagas List */}
        {state.sagas.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-primary/30 rounded-lg">
            <ScrollText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma saga criada</p>
            <p className="text-xs text-muted-foreground mt-1">
              Clique em "Nova Saga" para começar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.sagas.map(saga => (
              <div key={saga.id} className="bg-card border border-primary/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSaga(expandedSaga === saga.id ? null : saga.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-pixel text-xs text-foreground">{saga.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {saga.quests.length} quests • Criada em {new Date(saga.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {expandedSaga === saga.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                
                {expandedSaga === saga.id && (
                  <div className="border-t border-border p-4 space-y-3">
                    <div className="space-y-2">
                      {saga.quests.map(quest => (
                        <div key={quest.id} className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-2">
                          <span>{quest.title}</span>
                          <span className="text-[10px] font-pixel text-muted-foreground">
                            {quest.day} • {quest.attribute}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSaga(saga.id)}
                      className="w-full font-pixel text-[10px]"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      DELETAR SAGA
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h3 className="font-pixel text-[10px] text-primary mb-2">PALAVRAS-CHAVE</h3>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div><span className="text-red-400">CON:</span> sono, saúde, médico</div>
            <div><span className="text-orange-400">STR:</span> treino, academia, força</div>
            <div><span className="text-green-400">DEX:</span> corrida, cardio, bike</div>
            <div><span className="text-blue-400">INT:</span> estudo, leitura, curso</div>
            <div><span className="text-purple-400">WIS:</span> meditação, terapia</div>
            <div><span className="text-cyan-400">EXPL:</span> passeio, viagem, lazer</div>
            <div><span className="text-yellow-400">GOLD:</span> trabalho, freelance</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
