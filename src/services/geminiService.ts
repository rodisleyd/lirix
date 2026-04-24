/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { LyricRequest, LyricResult } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateLyrics(request: LyricRequest): Promise<LyricResult> {
  if (!apiKey) {
    throw new Error("API Key do Gemini não encontrada. Configure-a no arquivo .env ou nos Secrets.");
  }
  const ai = new GoogleGenAI({ apiKey });
  const { 
    tema, contexto, referenciaCompositor, estilo, emocao, estrutura, 
    rima, palavrasObrigatorias, palavrasProibidas 
  } = request;

  const descritivoEstrutura = estrutura
    .map((section, index) => `${index + 1}. ${section.type} (${section.lines} linhas)`)
    .join(", ");

  const prompt = `Crie uma letra de música profissional em Português com as seguintes características:
- Tema: ${tema}
${contexto ? `- Contexto Adicional: ${contexto}` : ""}
${referenciaCompositor ? `- Estilo de Escrita/Referência: Inspirado em ${referenciaCompositor}` : ""}
- Estilo Musical: ${estilo}
- Emoção/Vibe: ${emocao}
- Estrutura e métrica detalhada (ORDEM OBRIGATÓRIA): ${descritivoEstrutura}
- Esquema de rimas: ${rima === 'Sem Rima' ? 'Versos Brancos (Sem rimas obrigatórias, foco total na métrica, cadência e encaixe poético das palavras)' : rima}
${palavrasObrigatorias ? `- Palavras OBRIGATÓRIAS a incluir: ${palavrasObrigatorias}` : ""}
${palavrasProibidas ? `- Palavras PROIBIDAS (NÃO use de jeito nenhum): ${palavrasProibidas}` : ""}

Orientações de métrica e estilo: 
1. Respeite rigorosamente a quantidade de linhas solicitada para cada seção.
2. Siga exatamente a ordem das seções definida acima.
3. Adapte o vocabulário, as gírias, a cadência e as figuras de linguagem especificamente para o gênero "${estilo}".
${rima === 'Sem Rima' ? '4. PRIORIDADE: Como solicitado "Sem Rima", não force rimas fonéticas. Foque no ritmo interno das frases, como nas letras de Djavan ou Legião Urbana, onde a sonoridade vem do encaixe das frases e não do final das palavras.' : ""}
${referenciaCompositor ? `${rima === 'Sem Rima' ? '5' : '4'}. Além do gênero, procure captar a essência lírica e a profundidade poética de ${referenciaCompositor}.` : ""}

Formate a resposta estritamente como um objeto JSON válido com a seguinte estrutura:
{
  "title": "Sugestão de título",
  "sections": [
    { "type": "Verso 1", "content": ["linha 1", "linha 2"] },
    { "type": "Refrão", "content": ["linha 1", "linha 2"] }
  ]
}

Importante: Retorne APENAS o JSON, sem markdown ou explicações.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  content: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["type", "content"]
              }
            }
          },
          required: ["title", "sections"]
        }
      }
    });

    const text = response.text || "";
    if (!text) throw new Error("A IA retornou uma resposta vazia.");
    
    const result = JSON.parse(text) as LyricResult;
    result.style = estilo; // Garante que o estilo exibido é o escolhido
    result.vibe = emocao; // Garante que a vibe exibida é a escolhida
    result.composerRef = referenciaCompositor; // Preserva a referência para o UI
    return result;
  } catch (error) {
    console.error("Erro ao gerar letra:", error);
    throw new Error("Não foi possível gerar a letra. Tente novamente.");
  }
}
