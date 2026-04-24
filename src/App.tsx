/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music2, Mic2, Sparkles, Layers, Info, Sun, Moon } from 'lucide-react';
import LyricsForm from './components/LyricsForm';
import LyricsDisplay from './components/LyricsDisplay';
import { generateLyrics } from './services/geminiService';
import { LyricRequest, LyricResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'estudio' | 'historico' | 'comunidade'>('estudio');
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('lirix_theme');
    return saved ? saved === 'dark' : true;
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingTime, setLoadingTime] = React.useState(0);
  const [result, setResult] = React.useState<LyricResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<LyricResult[]>(() => {
    const saved = localStorage.getItem('lirix_history');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('light', !isDarkMode);
    localStorage.setItem('lirix_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  React.useEffect(() => {
    localStorage.setItem('lirix_history', JSON.stringify(history));
  }, [history]);

  const [formData, setFormData] = React.useState<LyricRequest>({
    tema: '',
    contexto: '',
    referenciaCompositor: '',
    estilo: '',
    emocao: 'Inspiradora',
    estrutura: [
      { id: 'v1', type: 'Verso', lines: 4 },
      { id: 'pr1', type: 'Pré-Refrão', lines: 2 },
      { id: 'c1', type: 'Refrão', lines: 4 },
      { id: 'v2', type: 'Verso', lines: 4 },
      { id: 'c2', type: 'Refrão', lines: 4 },
      { id: 'o1', type: 'Outro', lines: 2 }
    ],
    rima: 'ABAB',
    palavrasObrigatorias: '',
    palavrasProibidas: ''
  });

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingTime(0);
      interval = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const lyricResult = await generateLyrics(formData);
      setResult(lyricResult);
      setHistory(prev => [lyricResult, ...prev].slice(0, 20)); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const NavLink = ({ tab, label }: { tab: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`hover:text-brand-primary transition-colors relative py-1 ${
        activeTab === tab ? 'text-brand-primary font-bold' : ''
      }`}
    >
      {label}
      {activeTab === tab && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary" 
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen lyric-gradient relative overflow-hidden flex flex-col">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-zinc-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation / Header */}
      <header className="relative z-10 px-6 py-8 md:px-12 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <img 
            src={isDarkMode ? "/logo-lirix-branca.png" : "/logo-lirix-preta.png"} 
            alt="Lirix Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden md:flex gap-6 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            <NavLink tab="estudio" label="Estúdio" />
            <NavLink tab="historico" label="Histórico" />
            <NavLink tab="comunidade" label="Comunidade" />
          </nav>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-full bg-glass-surface border border-glass-border text-zinc-400 hover:text-brand-primary transition-all active:scale-95"
            title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 container mx-auto px-4 max-w-[1600px] flex flex-col py-6 md:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'estudio' && (
            <motion.div
              key="estudio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Coluna 1: Formulário Base */}
              <section className="lg:col-span-3 xl:col-span-3 space-y-6 order-2 lg:order-1">
                <div className="glass-panel p-6 shadow-2xl relative overflow-hidden">
                   <LyricsForm 
                     formData={formData} 
                     setFormData={setFormData} 
                     onSubmit={handleGenerate} 
                     isLoading={isLoading} 
                   />
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm italic text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </section>

              {/* Coluna 2: Visualização (Centro) */}
              <section className="lg:col-span-6 xl:col-span-6 order-1 lg:order-2 h-full lg:min-h-[750px]">
                <div className="glass-panel min-h-[500px] h-full p-6 md:p-10 shadow-inner relative overflow-hidden group">
                  <AnimatePresence mode="wait">
                    {result ? (
                      <LyricsDisplay result={result} onReset={() => setResult(null)} />
                    ) : isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-6"
                      >
                        <div className="relative">
                          <div className="w-32 h-32 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-mono font-bold text-brand-primary">{loadingTime}s</span>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Compilando</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-xl font-medium text-[var(--text-main)] italic">Afinando os instrumentos...</h3>
                            <p className="text-[var(--text-muted)] text-sm font-mono uppercase tracking-widest">O Gemini está compondo sua obra prima</p>
                          </div>
                          {/* Barra de progresso simulada */}
                          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden mx-auto border border-white/5">
                            <motion.div 
                              initial={{ width: "0%" }}
                              animate={{ width: "95%" }}
                              transition={{ duration: 15, ease: "easeOut" }}
                              className="h-full bg-brand-primary shadow-[0_0_10px_rgba(255,78,0,0.5)]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-brand-primary/5 transition-colors">
                          <Layers className="w-10 h-10 text-zinc-500 group-hover:text-brand-primary/50 transition-colors" />
                        </div>
                        <div className="max-w-xs">
                          <h3 className="text-lg font-medium text-[var(--text-main)]">Sua letra aparecerá aqui</h3>
                          <p className="text-[var(--text-muted)] text-sm mt-2">
                            Ajuste as configurações e a estrutura musical e clique em compor.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />
                </div>
              </section>

              {/* Coluna 3: Estrutura Musical (Direita) */}
              <section className="lg:col-span-3 xl:col-span-3 space-y-6 order-3">
                 <div className="glass-panel p-6 shadow-2xl relative overflow-hidden">
                    <LyricsForm.Advanced 
                      formData={formData} 
                      setFormData={setFormData} 
                      onSubmit={handleGenerate}
                      isLoading={isLoading}
                    />
                 </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'historico' && (
            <motion.div
              key="historico"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-[700px] flex flex-col"
            >
                <div className="mb-8">
                  <h2 className="text-3xl font-serif text-[var(--text-main)]">Seu Acervo <span className="italic text-brand-primary italic">Musical</span></h2>
                  <p className="text-[var(--text-muted)] text-sm font-mono uppercase tracking-widest mt-2">Últimas 20 letras compostas por você</p>
                </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="glass-panel p-6 cursor-pointer hover:border-brand-primary/40 transition-all group"
                        onClick={() => {
                          setResult(item);
                          setActiveTab('estudio');
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex flex-col gap-1">
                              <Music2 className="w-5 h-5 text-brand-primary" />
                              {item.style && (
                                <span className="px-1.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-[8px] font-bold text-brand-primary uppercase w-fit">
                                  {item.style}
                                </span>
                              )}
                              {item.vibe && (
                                <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/5 text-[8px] font-bold text-zinc-500 uppercase w-fit">
                                  {item.vibe}
                                </span>
                              )}
                              {item.composerRef && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-900/20 border border-amber-500/20 text-[8px] font-bold text-amber-500 uppercase w-fit">
                                  {item.composerRef}
                                </span>
                              )}
                           </div>
                           <span className="text-[10px] font-mono text-zinc-600">{new Date().toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-serif text-zinc-200 group-hover:text-white transition-colors mb-2">{item.title}</h3>
                        <p className="text-zinc-500 text-xs line-clamp-3">
                          {item.sections[0]?.content[0]}...
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Ver no Estúdio</span>
                          <Sparkles className="w-3 h-3" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full h-full flex flex-col items-center justify-center text-zinc-600 py-20 border border-dashed border-white/5 rounded-3xl">
                       <Layers className="w-12 h-12 mb-4 opacity-20" />
                       <p className="font-mono text-xs uppercase tracking-widest">Nenhuma letra no acervo ainda</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'comunidade' && (
            <motion.div
              key="comunidade"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[600px] flex flex-col items-center justify-center text-center space-y-8"
            >
               <div className="w-32 h-32 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20 relative">
                  <div className="absolute inset-0 border-2 border-brand-primary/30 rounded-full animate-ping" />
                  <Sparkles className="w-12 h-12 text-brand-primary" />
               </div>
               <div className="max-w-md space-y-4">
                  <h2 className="text-4xl font-serif text-white italic">Palco Aberto</h2>
                  <p className="text-zinc-400 leading-relaxed italic">
                    Estamos preparando um espaço para você compartilhar suas letras, descobrir novos talentos e colaborar com outros compositores.
                  </p>
               </div>
               <div className="px-6 py-2 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-brand-primary text-[10px] font-mono uppercase tracking-widest font-bold">
                  Em Breve &bull; Próxima Versão
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 px-8 py-6 flex flex-col md:flex-row justify-between items-center bg-black/40 backdrop-blur-sm mt-auto gap-4">
        <div className="flex gap-6 text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
          <span>&copy; 2026 Lirix Project</span>
          <span className="hidden md:inline">Powered by Google Gemini 3.1 Pro</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors cursor-help group">
              <Info className="w-4 h-4" />
              <span className="text-[10px] uppercase font-mono tracking-widest">Termos e Privacidade</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
