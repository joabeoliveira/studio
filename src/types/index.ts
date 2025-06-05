
import type { PriceDataItemSchema as AiPriceDataItemSchema } from '@/ai/flows/validate-price-estimates'; // Renamed to avoid conflict if re-exporting a modified version
import { z } from 'zod';


// Define Zod schemas for base types that might be used by AI flows AND UI
// This helps keep AI-facing descriptions in one place.

export const UserRoleSchema = z.enum(["Administrador", "Pesquisador", "Revisor"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const PriceResearchStatusSchema = z.enum(["Rascunho", "Em Andamento", "Pendente de Revisão", "Concluída", "Arquivada"]);
export type PriceResearchStatus = z.infer<typeof PriceResearchStatusSchema>;

export const ContractTypeSchema = z.enum(["Bens", "Serviços"]);
export type ContractType = z.infer<typeof ContractTypeSchema>;

// For UI, we add an 'id'. For AI, it's usually not needed in the input list.
export const PriceDataItemUISchema = AiPriceDataItemSchema.extend({
  id: z.string().describe("Identificador único do item de dado de preço (uso interno da UI).")
});
export type PriceDataItem = z.infer<typeof PriceDataItemUISchema>;


export interface PriceResearch {
  id: string;
  description: string;
  responsibleAgent: string; 
  status: PriceResearchStatus;
  creationDate: string; 
  lastModifiedDate: string; 
  contractType: ContractType;
  attachments?: File[]; 
  priceDataItems: PriceDataItem[];
  estimatedPrice?: number;
  calculationMethod?: "average" | "median" | "lowest"; // These could be translated for display if needed
}

export interface Supplier {
  id: string;
  cnpjCpf: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface QuoteRequest {
  id: string;
  supplierId: string;
  researchId: string;
  requestDate: string;
  responseDeadline: string;
  status: "Enviada" | "Respondida" | "Sem Resposta" | "Recusada"; // Translated status
  proposalFile?: File; 
  proposalDetails?: string; 
}

export interface Report {
  id:string;
  researchId: string;
  researchDescription: string;
  generationDate: string;
  generatedBy: string; 
}
