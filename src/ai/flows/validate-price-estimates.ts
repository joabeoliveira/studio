'use server';

/**
 * @fileOverview This file defines a Genkit flow for validating price estimates against IN65/2021 compliance standards.
 *
 * - validatePriceEstimates - A function that validates price estimates and suggests an estimated cost using average/median calculation.
 * - ValidatePriceEstimatesInput - The input type for the validatePriceEstimates function.
 * - ValidatePriceEstimatesOutput - The return type for the validatePriceEstimates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PriceDataItemSchema = z.object({
  source: z.string().describe('The source of the price data (e.g., Painel de Preços, supplier quote).'),
  date: z.string().describe('The date the price data was collected (YYYY-MM-DD).'),
  price: z.number().describe('The price of the item.'),
  notes: z.string().optional().describe('Any notes or qualifications about the price data.'),
});

const ValidatePriceEstimatesInputSchema = z.object({
  description: z.string().describe('A detailed description of the item or service being priced.'),
  priceData: z.array(PriceDataItemSchema).describe('An array of price data collected from various sources.'),
});

export type ValidatePriceEstimatesInput = z.infer<typeof ValidatePriceEstimatesInputSchema>;

const ValidatePriceEstimatesOutputSchema = z.object({
  complianceIssues: z.array(z.string()).describe('A list of any compliance issues found with the price data.'),
  estimatedCost: z.number().describe('The estimated cost calculated using average/median.'),
  calculationDetails: z.string().describe('Details on how the estimated cost was calculated.'),
});

export type ValidatePriceEstimatesOutput = z.infer<typeof ValidatePriceEstimatesOutputSchema>;

export async function validatePriceEstimates(input: ValidatePriceEstimatesInput): Promise<ValidatePriceEstimatesOutput> {
  return validatePriceEstimatesFlow(input);
}

const validatePriceEstimatesPrompt = ai.definePrompt({
  name: 'validatePriceEstimatesPrompt',
  input: {schema: ValidatePriceEstimatesInputSchema},
  output: {schema: ValidatePriceEstimatesOutputSchema},
  prompt: `You are an expert in Brazilian public procurement, specializing in compliance with Instrução Normativa SEGES/ME Nº 65/2021.

  Review the provided price data for the following item/service:
  Description: {{{description}}}

  Price Data:
  {{#each priceData}}
  - Source: {{{source}}}, Date: {{{date}}}, Price: {{{price}}}, Notes: {{{notes}}}
  {{/each}}

  Identify any compliance issues based on IN65/2021. Calculate an estimated cost using both the average and median of the provided prices.  Document the methodology used.  Return results in the following JSON format.
  Output format: ```
  {
    "complianceIssues": ["List any compliance issues here"],
    "estimatedCost": "The estimated cost",
    "calculationDetails": "Details on average/median calculation"
  }
  ```
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
