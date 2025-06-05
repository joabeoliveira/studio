
'use server';

/**
 * @fileOverview This file defines a Genkit flow for validating price estimates against IN65/2021 compliance standards.
 *
 * - validatePriceEstimates - A function that validates price estimates and suggests an estimated cost using average/median calculation.
 * - AiPriceDataItem - The type for individual price data items used by the AI flow.
 * - ValidatePriceEstimatesInput - The input type for the validatePriceEstimates function.
 * - ValidatePriceEstimatesOutput - The return type for the validatePriceEstimates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PriceDataItemSchema } from '@/types'; // Importa o schema Zod de src/types

// Define e exporta o tipo para itens de dados de preço específicos da IA (sem id da UI)
export type AiPriceDataItem = z.infer<typeof PriceDataItemSchema>;

const ValidatePriceEstimatesInputSchema = z.object({
  description: z.string().describe('Uma descrição detalhada do item ou serviço sendo cotado.'),
  priceData: z.array(PriceDataItemSchema).describe('Um array de dados de preços coletados de várias fontes.'), // Usa PriceDataItemSchema importado
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

const validatePriceEstimatesPrompt = ai.definePrompt({
  name: 'validatePriceEstimatesPrompt',
  input: {schema: ValidatePriceEstimatesInputSchema},
  output: {schema: ValidatePriceEstimatesOutputSchema},
  prompt: `Você é um especialista em compras públicas brasileiras, especializado em conformidade com a Instrução Normativa SEGES/ME Nº 65/2021.

  Revise os dados de preços fornecidos para o seguinte item/serviço:
  Descrição: {{{description}}}

  Dados de Preços:
  {{#each priceData}}
  - Fonte: {{{source}}}, Data: {{{date}}}, Preço: {{{price}}}, Notas: {{{notes}}}
  {{/each}}

  Identifique quaisquer problemas de conformidade com base na IN65/2021. Calcule um custo estimado usando a média e a mediana dos preços fornecidos. Documente a metodologia utilizada. Retorne os resultados no seguinte formato JSON.
  Output format: \`\`\`
  {
    "complianceIssues": ["List any compliance issues here"],
    "estimatedCost": "The estimated cost",
    "calculationDetails": "Details on average/median calculation"
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
