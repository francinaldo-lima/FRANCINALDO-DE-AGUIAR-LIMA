import React, { useState, useEffect } from 'react';
import { PostDetails, SavedArt, INSTAGRAM_FORMATS } from '../types';
import { Save, Folder, Trash2, Copy, FileCheck, RefreshCw, Calendar, Sparkles } from 'lucide-react';

interface HistoryManagerProps {
  currentDetails: PostDetails;
  onSelectArt: (details: PostDetails) => void;
}

export function HistoryManager({ currentDetails, onSelectArt }: HistoryManagerProps) {
  const [savedArts, setSavedArts] = useState<SavedArt[]>([]);
  const [artName, setArtName] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load saved item database from localStorage on startup
  useEffect(() => {
    const list = localStorage.getItem('ifma_generator_history');
    if (list) {
      try {
        setSavedArts(JSON.parse(list));
      } catch (e) {
        console.error("Erro ao carregar banco local:", e);
      }
    }
  }, []);

  const saveToHistory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const finalName = artName.trim() || `Design - ${currentDetails.title ? currentDetails.title.substring(0, 15) : 'Sem título'}`;
    const newArt: SavedArt = {
      id: Date.now().toString(),
      name: finalName,
      details: { ...currentDetails },
      createdAt: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newArt, ...savedArts];
    setSavedArts(updated);
    localStorage.setItem('ifma_generator_history', JSON.stringify(updated));
    setArtName('');
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const deleteArt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedArts.filter(art => art.id !== id);
    setSavedArts(updated);
    localStorage.setItem('ifma_generator_history', JSON.stringify(updated));
  };

  const duplicateArt = (art: SavedArt, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: SavedArt = {
      ...art,
      id: Date.now().toString(),
      name: `${art.name} (Cópia)`,
      createdAt: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [duplicated, ...savedArts];
    setSavedArts(updated);
    localStorage.setItem('ifma_generator_history', JSON.stringify(updated));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm transition flex flex-col gap-4">
      {/* Header title */}
      <div className="flex items-center gap-2">
        <Folder className="w-5 h-5 text-green-600 animate-pulse" />
        <div>
          <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-wider">
            Histórico & Salvados (Artes)
          </h3>
          <p className="text-3xs text-neutral-400">
            Armazenamento local seguro das composições iniciadas nesta máquina
          </p>
        </div>
      </div>

      {/* Save current snapshot */}
      <form onSubmit={saveToHistory} className="flex gap-2">
        <input
          type="text"
          value={artName}
          onChange={(e) => setArtName(e.target.value)}
          placeholder="Apelido do design (Ex: Post Reunião de Pais)"
          className="flex-1 text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
        />
        <button
          type="submit"
          className="px-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center font-bold text-xs shrink-0"
          title="Salvar Arte Atual"
        >
          <Save className="w-4 h-4 mr-1" />
          Salvar
        </button>
      </form>

      {/* Micro success alert */}
      {saveSuccess && (
        <div className="text-3xs text-green-600 font-bold flex items-center gap-1 self-start">
          <FileCheck className="w-3.5 h-3.5" />
          Design guardado com sucesso!
        </div>
      )}

      {/* List of saved item tags */}
      {savedArts.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
          {savedArts.map((art) => {
            const layoutTag = art.details.layout;
            const formatName = INSTAGRAM_FORMATS[art.details.format]?.name || art.details.format;

            return (
              <div
                key={art.id}
                onClick={() => onSelectArt(art.details)}
                className="group p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-green-600 bg-neutral-50 dark:bg-neutral-950 hover:bg-white dark:hover:bg-black transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex flex-col gap-0.5 truncate max-w-[70%]">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate block">
                    {art.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-3xs text-neutral-400 font-medium">
                    <span className="capitalize">{layoutTag}</span>
                    <span>•</span>
                    <span className="truncate">{formatName}</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono mt-0.5">
                    Modificado {art.createdAt}
                  </span>
                </div>
                
                {/* Actions row visible on group item hovered */}
                <div className="flex items-center gap-1 opacity-90 sm:opacity-40 sm:group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => duplicateArt(art, e)}
                    className="p-1 px-1.5 rounded bg-neutral-200/50 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition text-[9px] font-bold"
                    title="Duplicar Design"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => deleteArt(art.id, e)}
                    className="p-1 px-1.5 rounded bg-red-100 dark:bg-red-950/20 hover:bg-red-200 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition text-[9px] font-bold"
                    title="Remover"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 rounded bg-neutral-50 dark:bg-stone-950/10 border border-neutral-100 dark:border-neutral-800">
          <Folder className="w-6 h-6 text-neutral-300 mx-auto mb-1 opacity-50" />
          <span className="text-3xs text-neutral-500 block">Nenhum rascunho salvo ainda</span>
        </div>
      )}
    </div>
  );
}
export default HistoryManager;
