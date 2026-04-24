/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] z-[101] px-4"
          >
            <div className="glass-panel p-6 md:p-10 shadow-2xl overflow-hidden relative flex flex-col bg-[#0d0d0e]/90 border-white/10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center border border-brand-primary/20">
                    <Shield className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-[var(--text-main)] italic">Termos e Privacidade</h2>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">Versão 1.2.0 • Abril 2026</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-[var(--text-muted)] hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8 text-sm text-[var(--text-muted)] leading-relaxed">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[var(--text-main)] font-black uppercase tracking-[0.1em] text-[10px]">
                    <FileText className="w-4 h-4 text-brand-primary" />
                    <h3>Termos de Uso</h3>
                  </div>
                  <p>
                    Bem-vindo ao <strong>Lirix Studio</strong>. Ao utilizar nosso serviço de composição auxiliada por Inteligência Artificial, você concorda com as seguintes diretrizes:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-brand-primary font-bold">•</span>
                      <span>O conteúdo gerado é fruto de uma co-criação entre suas diretrizes criativas e o modelo <strong>Gemini 3.1 Pro</strong> da Google.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-brand-primary font-bold">•</span>
                      <span>Você detém os direitos totais sobre as letras geradas para fins comerciais ou artísticos.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-brand-primary font-bold">•</span>
                      <span>O uso do serviço implica na responsabilidade do usuário sobre o conteúdo final, garantindo que não infrinja direitos de terceiros ou termos éticos.</span>
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[var(--text-main)] font-black uppercase tracking-[0.1em] text-[10px]">
                    <Shield className="w-4 h-4 text-brand-primary" />
                    <h3>Segurança e Dados</h3>
                  </div>
                  <p>
                    Privacidade é o cerne da nossa arquitetura "Client-First":
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <h4 className="text-[10px] font-bold uppercase text-[var(--text-main)] mb-2">Armazenamento Local</h4>
                      <p className="text-xs">Seu histórico de letras e preferências são salvos exclusivamente no armazenamento local do seu navegador (LocalStorage).</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <h4 className="text-[10px] font-bold uppercase text-[var(--text-main)] mb-2">Processamento IA</h4>
                      <p className="text-xs">As solicitações são enviadas diretamente para a API da Google de forma segura. Não processamos nem vendemos seus dados criativos.</p>
                    </div>
                  </div>
                </section>

                <div className="p-5 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 blur-3xl rounded-full" />
                  <p className="text-xs italic relative z-10 text-brand-primary/80">
                    "Nossa missão é democratizar a composição musical através da tecnologia, mantendo a integridade e a privacidade do artista."
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">&copy; 2026 Lirix Project</span>
                <button 
                  onClick={onClose}
                  className="px-10 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-brand-primary/90 transition-all active:scale-95 shadow-xl shadow-brand-primary/20"
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
