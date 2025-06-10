
'use server';

// src/ai/flows/validate-price-estimates.ts

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PriceDataItemSchema } from '@/types';

// Define e exporta o tipo para itens de dados de preço específicos da IA (sem id da UI)
export type AiPriceDataItem = z.infer<typeof PriceDataItemSchema>;

const ValidatePriceEstimatesInputSchema = z.object({
  description: z.string().describe('Uma descrição detalhada do item ou serviço sendo cotado.'),
  priceData: z.array(PriceDataItemSchema).describe('Um array de dados de preços coletados de várias fontes.'),
});

export type ValidatePriceEstimatesInput = z.infer<typeof ValidatePriceEstimatesInputSchema>;

const ValidatePriceEstimatesOutputSchema = z.object({
  complianceIssues: z.array(z.string()).describe('Uma lista de quaisquer problemas de conformidade encontrados com os dados de preço.'),
  estimatedCost: z.number().describe('O custo estimado calculado usando média/mediana.'),
  calculationDetails: z.string().describe('Detalhes sobre como o custo estimado foi calculado.'),
});

export type ValidatePriceEstimatesOutput = z.infer<typeof ValidatePriceEstimatesOutputSchema>;

export async function validatePriceEstimates(input: ValidatePriceEstimatesInput): Promise<ValidatePriceEstimatesOutput> {
  return validatePriceEstimatesFlow(input);
}

// PROMPT CORRIGIDO
const validatePriceEstimatesPrompt = ai.definePrompt({
  name: 'validatePriceEstimatesPrompt',
  input: {schema: ValidatePriceEstimatesInputSchema},
  output: {schema: ValidatePriceEstimatesOutputSchema},
  prompt: `
  Você é um especialista em compras públicas no Brasil, com foco total na conformidade com a Instrução Normativa SEGES/ME Nº 65, de 07 de julho de 2021. Sua tarefa é analisar os dados de uma pesquisa de preços e fornecer uma avaliação técnica e precisa.

  Item sendo cotado:
  - Descrição: {{{description}}}

  Dados de Preços Coletados:
  {{#each priceData}}
  - Fonte: "{{source}}", Tipo: "{{source_type}}", Data: {{date}}, Preço: R$ {{price}}{{#if notes}}, Notas: "{{notes}}"{{/if}}
  {{/each}}

  Por favor, siga estes passos rigorosamente:

  1.  **Análise de Conformidade (IN 65/2021)**:
      * **Suficiência de Fontes (Art. 5º)**: Verifique se há pelo menos três preços coletados. Se houver menos de três, mencione que é necessária uma justificativa formal do gestor.
      * **Diversidade de Fontes**: Avalie se os preços vêm de fontes diversas (ex: diferentes empresas, e não apenas cotações da mesma empresa ou de um único painel).
      * **Validade dos Preços**: Identifique preços que pareçam muito antigos, inexequíveis (excessivamente baixos) ou sobrepreço (excessivamente altos) em comparação com a média/mediana dos demais. Marque-os como "descartados" para o cálculo.
      * Liste todos os problemas de conformidade encontrados em uma lista clara e objetiva. Se nenhum problema for encontrado, afirme isso explicitamente.

  2.  **Cálculo do Preço Estimado (Art. 6º)**:
      * Utilize **apenas os preços que você considerou válidos** na etapa anterior.
      * Calcule a **Média Aritmética** e a **Mediana** desses preços.
      * Adote a **Mediana** como o "Custo Estimado" final, pois é menos sensível a valores extremos. Se houver apenas dois preços, utilize a média. Se houver apenas um, este será o valor.

  3.  **Detalhamento do Cálculo**:
      * Na sua explicação, liste quais preços foram usados para o cálculo e quais foram descartados, explicando brevemente o porquê (ex: "Preço de R$ 10,00 da Fonte Y foi descartado por ser inexequível").
      * Apresente o valor da média e da mediana calculados.
      * Conclua afirmando que o custo estimado é o valor da mediana.

  Retorne sua análise final estritamente no seguinte formato JSON. Não inclua comentários ou explicações fora do JSON. A estrutura deve ser:
  \`\`\`json
  {
    "complianceIssues": ["Lista de problemas de conformidade aqui"],
    "estimatedCost": 123.45,
    "calculationDetails": "Detalhes sobre o cálculo da média/mediana aqui"
  }
  \`\`\`
  `,
});


const validatePriceEstimatesFlow = ai.defineFlow(
  {
    name: 'validatePriceEstimatesFlow',
    inputSchema: ValidatePriceEstimatesInputSchema,
    outputSchema: ValidatePriceEstimatesOutputSchema,
  },
  async input => {
    const {output} = await validatePriceEstimatesPrompt(input);
    return output!;
  }
);