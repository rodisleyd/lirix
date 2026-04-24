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

export interface LyricRequest {
  tema: string;
  contexto: string;
  referenciaCompositor: string;
  estilo: string;
  emocao: string;
  estrutura: SongStructure;
  rima: RhymeScheme;
  palavrasObrigatorias: string;
  palavrasProibidas: string;
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
