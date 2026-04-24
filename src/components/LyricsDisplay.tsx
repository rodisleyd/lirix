/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Copy, Check, RotateCcw, Download, Mic2 } from 'lucide-react';
import { LyricResult } from '../types';

interface Props {
  result: LyricResult;
  onReset: () => void;
}

export default function LyricsDisplay({ result, onReset }: Props) {
  const [localResult, setLocalResult] = React.useState<LyricResult>(result);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setLocalResult(result);
  }, [result]);

  const mapSectionToTag = (type: string, index: number, allSections: any[]): string => {
    const t = type.toLowerCase();
    const sameTypeSections = allSections.filter(s => s.type.toLowerCase() === t);
    const typeIndex = sameTypeSections.indexOf(allSections[index]) + 1;
    const multi = sameTypeSections.length > 1;

    let tag = type;
    if (t.includes('verso')) tag = 'Verse';
    else if (t.includes('refrão')) tag = 'Chorus';
    else if (t.includes('pré-refrão') || t.includes('pre-refrao')) tag = 'Pre-Chorus';
    else if (t.includes('ponte')) tag = 'Bridge';
    else if (t.includes('outro')) tag = 'Outro';

    return multi ? `${tag} ${typeIndex}` : tag;
  };

  const copyToClipboard = () => {
    const text = localResult.sections
      .map((s, idx) => `[${mapSectionToTag(s.type, idx, localResult.sections).toUpperCase()}]\n${s.content.join('\n')}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(`${localResult.title}\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateLine = (sectionIdx: number, lineIdx: number, newVal: string) => {
    setLocalResult(prev => {
      const newSections = [...prev.sections];
      const newContent = [...newSections[sectionIdx].content];
      newContent[lineIdx] = newVal;
      newSections[sectionIdx] = { ...newSections[sectionIdx], content: newContent };
      return { ...prev, sections: newSections };
    });
  };

  const updateTitle = (newTitle: string) => {
    setLocalResult(prev => ({ ...prev, title: newTitle }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold">Título Sugerido</span>
             {result.style && (
               <span className="px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-bold text-brand-primary uppercase tracking-tighter">
                 {result.style}
               </span>
             )}
             {localResult.vibe && (
               <span className="px-2 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                 {localResult.vibe}
               </span>
             )}
             {localResult.composerRef && (
               <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-tighter flex items-center gap-1">
                 <Mic2 className="w-2 h-2" />
                 {localResult.composerRef}
               </span>
             )}
          </div>
          <input
            className="text-3xl font-serif font-medium leading-tight bg-transparent border-none focus:outline-none focus:ring-0 w-full hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 transition-colors text-[var(--text-main)]"
            value={localResult.title}
            onChange={(e) => updateTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-zinc-400 hover:text-white"
            title="Copiar Letra"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={onReset}
            className="p-2.5 rounded-full bg-white/5 hover:bg-zinc-800 transition-colors border border-white/10 text-zinc-400 hover:text-white"
            title="Gerar Nova"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-12 pb-10">
        {localResult.sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 font-bold">
                {section.type}
              </span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            
            <div className="space-y-2">
              {section.content.map((line, lIdx) => (
                <input
                  key={lIdx}
                  className="w-full font-serif text-lg md:text-xl text-[var(--text-main)] leading-relaxed bg-transparent border-none focus:outline-none focus:ring-0 hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded transition-all text-center md:text-left"
                  value={line}
                  onChange={(e) => updateLine(idx, lIdx, e.target.value)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-center">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          Composto com Lirix AI &bull; 2026
        </p>
      </div>
    </motion.div>
  );
}
