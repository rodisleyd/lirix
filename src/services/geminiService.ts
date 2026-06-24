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

  const prompt = request.mode === 'Jingle' ? `
Você é um redator publicitário sênior especializado em Jingles.
Crie um JINGLE publicitário profissional em Português com as seguintes características:

- Marca/Produto: ${request.marca}
- Mensagem Principal: ${request.mensagemPrincipal}
- Objetivo: ${request.objetivo}
- Público-Alvo: ${request.publicoAlvo}
- Estilo Musical: ${request.estilo}
- Duração Estimada: ${request.duracaoEstimada}
- Nível de Repetição (Chiclete): ${request.nivelRepeticao}% (Onde 100% significa repetição extrema da marca e rimas muito simples)

REGRAS OBRIGATÓRIAS PARA JINGLE:
1. FRASES CURTAS: No máximo 6 palavras por linha para garantir memorização.
2. REPETIÇÃO DA MARCA: O nome "${request.marca}" deve aparecer pelo menos 3 vezes no jingle.
3. ESTRUTURA PUBLICITÁRIA: 
   - Gancho (Hook) inicial atraente.
   - Apresentação da Marca.
   - Benefício principal (Mensagem).
   - Repetição da marca + Call to Action (Chamada para ação).
4. SONORIDADE: Use rimas simples e fonemas fáceis de cantar. Evite palavras complexas.
${request.nivelRepeticao && request.nivelRepeticao > 70 ? '5. MODO CHICLETE ATIVO: Use onomatopeias, aliterações e repita a frase principal múltiplas vezes.' : ''}

${request.audioData ? `
ATENÇÃO - MODO INSTRUMENTAL ATIVO:
O usuário enviou um áudio de fundo. Adapte o jingle para caber EXATAMENTE no tempo do áudio.
Se o áudio for curto (ex: 15s), seja extremamente conciso.
` : ''}

Formate a resposta como um objeto JSON:
{
  "title": "Nome do Jingle",
  "sections": [
    { "type": "Intro/Hook", "content": ["..."] },
    { "type": "Corpo", "content": ["..."] },
    { "type": "Assinatura/Marca", "content": ["..."] }
  ]
}
` : `Crie uma letra de música profissional em Português com as seguintes características:
- Tema: ${tema}
${contexto ? `- Contexto Adicional: ${contexto}` : ""}
${referenciaCompositor ? `- Estilo de Escrita/Referência: Inspirado em ${referenciaCompositor}` : ""}
- Estilo Musical: ${estilo}
- Emoção/Vibe: ${emocao}
- Tom da Escrita: ${request.tomPoetico > 70 ? 'Altamente Poético e Metafórico' : request.tomPoetico < 30 ? 'Direto, Comercial e Chiclete' : 'Equilibrado'}
- Nível de Vocabulário: ${request.complexidade > 70 ? 'Rico, Erudito e Complexo' : request.complexidade < 30 ? 'Simples, Coloquial e Acessível' : 'Médio'}
${request.modoCantor ? `
- RECURSOS DE PERFORMANCE (ATIVO): 
  1. Inclua marcações de (pausa) e [respiração] onde for natural cantar.
  2. Faça a divisão silábica (ex: "mú-si-ca") em palavras que exijam uma articulação rítmica específica.
  3. Adicione timestamps sugeridos no início de cada seção, ex: [00:00], baseados no andamento da música.
` : ""}
${request.audioData ? `- Estrutura: [IGNORE A ESTRUTURA MANUAL ABAIXO E CRIE UMA BASEADA NO ÁUDIO]` : `- Estrutura e métrica detalhada (ORDEM OBRIGATÓRIA): ${descritivoEstrutura}`}
- Esquema de rimas: ${rima === 'Sem Rima' ? 'Versos Brancos (Sem rimas obrigatórias, foco total na métrica, cadência e encaixe poético das palavras)' : rima}
${palavrasObrigatorias ? `- Palavras OBRIGATÓRIAS a incluir: ${palavrasObrigatorias}` : ""}
${palavrasProibidas ? `- Palavras PROIBIDAS (NÃO use de jeito nenhum): ${palavrasProibidas}` : ""}

${request.audioData ? `
ATENÇÃO - MODO INSTRUMENTAL ATIVO: 
1. Analise o arquivo de áudio fornecido.
2. Identifique a estrutura real da música (Intro, Versos, Refrão, Ponte, Solo, Outro).
3. Determine a quantidade exata de linhas para cada seção baseando-se no tempo disponível no instrumental.
4. Escreva a letra respeitando as pausas e as explosões rítmicas do áudio.
5. Se o áudio tiver uma parte de solo ou instrumental longo, indique como {Solo Instrumental} ou similar.
` : `
Orientações de métrica e estilo: 
1. Respeite rigorosamente a quantidade de linhas solicitada para cada seção.
2. Siga exatamente a ordem das seções definida acima.
`}
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
    const contents = request.audioData 
      ? [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: request.audioData.mimeType,
                  data: request.audioData.base64
                }
              }
            ]
          }
        ]
      : [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
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
