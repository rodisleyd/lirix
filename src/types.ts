/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RhymeScheme = 'ABAB' | 'AABB' | 'Livre' | 'Sem Rima';

export type SectionType = 'Verso' | 'Pré-Refrão' | 'Refrão' | 'Ponte' | 'Outro';

export interface SectionConfig {
  id: string; // Único para DND
  type: SectionType;
  lines: number;
}

export type SongStructure = SectionConfig[];

export type CompositionMode = 'Música' | 'Jingle';

export interface LyricRequest {
  mode: CompositionMode;
  tema: string;
  contexto: string;
  referenciaCompositor: string;
  estilo: string;
  emocao: string;
  estrutura: SongStructure;
  rima: RhymeScheme;
  palavrasObrigatorias: string;
  palavrasProibidas: string;
  audioData?: {
    base64: string;
    mimeType: string;
  };
  complexidade: number; // 0 (simples) a 100 (complexo)
  tomPoetico: number; // 0 (comercial) a 100 (poético)
  modoCantor: boolean;
  
  // Campos específicos para Jingle
  marca?: string;
  mensagemPrincipal?: string;
  objetivo?: string;
  publicoAlvo?: string;
  nivelRepeticao?: number;
  duracaoEstimada?: string;
}

export interface LyricResult {
  title: string;
  style?: string;
  vibe?: string;
  composerRef?: string;
  sections: {
    type: string;
    content: string[];
  }[];
}
