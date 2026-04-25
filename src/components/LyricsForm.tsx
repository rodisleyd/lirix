/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic2, Sparkles, ChevronDown, GripVertical, Trash2, Copy, Plus, Upload, Music, X, Sliders, Settings2, Zap } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MUSICAL_STYLES, EMOTIONS } from '../constants';
import { LyricRequest, RhymeScheme, SongStructure, SectionConfig, SectionType } from '../types';

interface Props {
  formData: LyricRequest;
  setFormData: React.Dispatch<React.SetStateAction<LyricRequest>>;
  onSubmit: () => void;
  isLoading: boolean;
}

// Sub-componente para item arrastável
interface SortableSectionItemProps {
  id?: string;
  section: SectionConfig;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdateLines: (id: string, lines: number) => void;
}

function SortableSectionItem({ 
  section, 
  onRemove, 
  onDuplicate, 
  onUpdateLines 
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-4 rounded-2xl border transition-all ${
        isDragging 
          ? 'bg-brand-primary/20 border-brand-primary shadow-2xl scale-[1.02] opacity-90 rotate-1' 
          : 'bg-[var(--glass-surface)] border-[var(--glass-border)] hover:border-brand-primary/30'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-brand-primary transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
              section.type === 'Refrão' 
                ? 'bg-brand-primary text-white' 
                : 'bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--glass-border)]'
            }`}>
              {section.type}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => onDuplicate(section.id)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary transition-all">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => onRemove(section.id)} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              className="flex-1 accent-brand-primary h-1.5 bg-black/20 dark:bg-white/5 rounded-lg cursor-pointer appearance-none"
              value={section.lines}
              onChange={e => onUpdateLines(section.id, parseInt(e.target.value))}
            />
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] min-w-[60px] text-right bg-[var(--bg-app)] px-2 py-1 rounded border border-[var(--glass-border)]">
              {section.lines} LINHAS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LyricsForm({ formData, setFormData, onSubmit, isLoading }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form id="lyrics-composition-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <div className="group">
          <label className="block text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 group-focus-within:text-brand-primary transition-colors">
            Título ou Tema Central
          </label>
          <input
            required
            type="text"
            placeholder="Ex: Amor de verão, Saudade..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all text-sm"
            value={formData.tema}
            onChange={e => setFormData({ ...formData, tema: e.target.value })}
          />
        </div>

        <div className="group">
          <label className="block text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 group-focus-within:text-brand-primary transition-colors">
            Contexto da Letra
          </label>
          <textarea
            placeholder="Descreva a história ou mensagem..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all text-sm h-32 resize-none custom-scrollbar"
            value={formData.contexto}
            onChange={e => setFormData({ ...formData, contexto: e.target.value })}
          />
        </div>

        <div className="group">
          <label className="block text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 group-focus-within:text-brand-primary transition-colors">
            Influência / Artista
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ex: Caetano Veloso..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
              value={formData.referenciaCompositor}
              onChange={e => setFormData({ ...formData, referenciaCompositor: e.target.value })}
            />
            <Mic2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-brand-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="group">
            <label className="block text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 group-focus-within:text-brand-primary transition-colors">
              Estilo Musical
            </label>
            <select
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary/50 transition-all text-sm appearance-none"
              value={formData.estilo}
              onChange={e => setFormData({ ...formData, estilo: e.target.value })}
            >
              <option value="" disabled className="bg-[var(--bg-app)] text-[var(--text-main)]">Selecione o estilo</option>
              {MUSICAL_STYLES.map(style => (
                <option key={style} value={style} className="bg-[var(--bg-app)] text-[var(--text-main)]">{style}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className="block text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 group-focus-within:text-brand-primary transition-colors">
              Emoção / Vibe
            </label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary/50 transition-all text-sm appearance-none"
              value={formData.emocao}
              onChange={e => setFormData({ ...formData, emocao: e.target.value })}
            >
              {EMOTIONS.map(emotion => (
                <option key={emotion} value={emotion} className="bg-[var(--bg-app)] text-[var(--text-main)]">{emotion}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload de Áudio Instrumental */}
        <div className="pt-4 border-t border-white/5">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-4">
            Modo Instrumental (Opcional)
          </label>
          
          {!formData.audioData ? (
            <div 
              className="relative group/upload cursor-pointer"
              onClick={() => document.getElementById('audio-upload')?.click()}
            >
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all">
                <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary mb-3 group-hover/upload:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[var(--text-main)] mb-1">Subir Instrumental</span>
                <span className="text-[10px] text-[var(--text-muted)]">MP3 ou WAV (Máx 10MB)</span>
              </div>
              <input 
                id="audio-upload"
                type="file" 
                accept="audio/mp3,audio/wav,audio/mpeg"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      alert("Arquivo muito grande. O limite é 10MB.");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      setFormData({ 
                        ...formData, 
                        audioData: { base64, mimeType: file.type } 
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-primary text-white">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Áudio Carregado</div>
                    <div className="text-[9px] text-[var(--text-muted)]">A IA analisará o ritmo e a vibe</div>
                  </div>
                </div>
                <button 
                  onClick={() => setFormData({ ...formData, audioData: undefined })}
                  className="p-1.5 hover:bg-red-500/20 hover:text-red-500 text-[var(--text-muted)] rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <audio 
                controls 
                className="w-full h-8 accent-brand-primary"
                src={`data:${formData.audioData.mimeType};base64,${formData.audioData.base64}`}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

// Componente para a coluna da direita (Estrutura e Opções Avançadas)
LyricsForm.Advanced = function({ formData, setFormData, onSubmit, isLoading }: { 
  formData: LyricRequest, 
  setFormData: React.Dispatch<React.SetStateAction<LyricRequest>>,
  onSubmit?: () => void,
  isLoading?: boolean
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.estrutura.findIndex((s) => s.id === active.id);
        const newIndex = prev.estrutura.findIndex((s) => s.id === over.id);
        return {
          ...prev,
          estrutura: arrayMove(prev.estrutura, oldIndex, newIndex),
        };
      });
    }
  };

  const addSection = (type: SectionType) => {
    const id = `${type.toLowerCase()}-${Date.now()}`;
    const newSection: SectionConfig = { id, type, lines: type === 'Refrão' || type === 'Verso' ? 4 : 2 };
    setFormData(prev => ({
      ...prev,
      estrutura: [...prev.estrutura, newSection]
    }));
  };

  const removeSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      estrutura: prev.estrutura.filter(s => s.id !== id)
    }));
  };

  const duplicateSection = (id: string) => {
    setFormData(prev => {
      const idx = prev.estrutura.findIndex(s => s.id === id);
      const section = prev.estrutura[idx];
      const newSection = { ...section, id: `${section.type.toLowerCase()}-${Date.now()}` };
      const newStructure = [...prev.estrutura];
      newStructure.splice(idx + 1, 0, newSection);
      return { ...prev, estrutura: newStructure };
    });
  };

  const updateSectionLines = (id: string, lines: number) => {
    setFormData(prev => ({
      ...prev,
      estrutura: prev.estrutura.map(s => s.id === id ? { ...s, lines } : s)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Seção 1: Estrutura */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
            Estrutura da Música
          </label>
          {formData.audioData && (
            <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full border border-brand-primary/20 animate-pulse">
              AUTO-DETECT ATIVO
            </span>
          )}
        </div>
        
        <div className={`flex flex-wrap gap-2 transition-opacity duration-300 ${formData.audioData ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {(['Verso', 'Pré-Refrão', 'Refrão', 'Ponte', 'Outro'] as SectionType[]).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => addSection(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-brand-primary/10 hover:border-brand-primary/50 text-[9px] font-bold uppercase transition-all"
            >
              <Plus className="w-3 h-3 text-brand-primary" />
              {type}
            </button>
          ))}
        </div>

        <div className="max-h-[400px] overflow-y-auto pr-1 custom-scrollbar space-y-3">
          {formData.audioData ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-brand-primary/20 bg-brand-primary/5 flex flex-col items-center justify-center text-center space-y-3">
              <Sparkles className="w-8 h-8 text-brand-primary animate-pulse" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">Estrutura Inteligente</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                  O Lirix analisará o áudio para definir automaticamente versos e refrões sincronizados.
                </p>
              </div>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={formData.estrutura.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {formData.estrutura.map((section) => (
                  <SortableSectionItem 
                    key={section.id} 
                    section={section} 
                    onRemove={removeSection}
                    onDuplicate={duplicateSection}
                    onUpdateLines={updateSectionLines}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Seção 2: Ajustes Premium e Opções */}
      <div className="border-t border-[var(--glass-border)] pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Settings2 className="w-4 h-4" />
            <label className="block text-[10px] font-black uppercase tracking-[0.2em]">Escalabilidade Artística</label>
          </div>
          <div className="space-y-4 px-2">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono uppercase text-[var(--text-muted)]">
                <span>Mais Comercial</span>
                <span>Mais Poético</span>
              </div>
              <input type="range" className="w-full accent-brand-primary h-1.5 bg-black/20 rounded-lg appearance-none" value={formData.tomPoetico} onChange={e => setFormData({ ...formData, tomPoetico: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono uppercase text-[var(--text-muted)]">
                <span>Mais Simples</span>
                <span>Mais Complexo</span>
              </div>
              <input type="range" className="w-full accent-brand-primary h-1.5 bg-black/20 rounded-lg appearance-none" value={formData.complexidade} onChange={e => setFormData({ ...formData, complexidade: parseInt(e.target.value) })} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Modo Performance</label>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, modoCantor: !formData.modoCantor })}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.modoCantor ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-white/5 border-white/10 text-[var(--text-muted)]'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${formData.modoCantor ? 'bg-brand-primary text-white' : 'bg-white/5'}`}><Mic2 className="w-4 h-4" /></div>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider">Modo Cantor</div>
                <div className="text-[8px] opacity-70">Pausas, Respiração e Sílabas</div>
              </div>
            </div>
            {formData.modoCantor && <Zap className="w-4 h-4 fill-current animate-pulse" />}
          </button>
        </div>

        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">Tipo de Rima</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none text-sm appearance-none" value={formData.rima} onChange={e => setFormData({ ...formData, rima: e.target.value as RhymeScheme })}>
            <option value="ABAB" className="bg-zinc-900">ABAB (Cruzada)</option>
            <option value="AABB" className="bg-zinc-900">AABB (Emparelhada)</option>
            <option value="Livre" className="bg-zinc-900">Livre</option>
            <option value="Sem Rima" className="bg-zinc-900">Sem Rima</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Palavras Obrigatórias</label>
            <input type="text" placeholder="Separadas por vírgula..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm" value={formData.palavrasObrigatorias} onChange={e => setFormData({ ...formData, palavrasObrigatorias: e.target.value })} />
          </div>
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Evitar Palavras</label>
            <input type="text" placeholder="Termos indesejados..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm" value={formData.palavrasProibidas} onChange={e => setFormData({ ...formData, palavrasProibidas: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Botão Principal */}
      <button
        form="lyrics-composition-form"
        type="submit"
        disabled={isLoading || !formData.tema || !formData.estilo || (formData.estrutura.length === 0 && !formData.audioData)}
        className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><Sparkles className="w-5 h-5" />COMPOR AGORA</>
        )}
      </button>
    </div>
  );
};
