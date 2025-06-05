
import { z } from 'zod';

// Define PriceDataItemSchema aqui
export const PriceDataItemSchema = z.object({
  source: z.string().describe('A fonte do dado de preço (ex: Painel de Preços, cotação de fornecedor).'),
  date: z.string().describe('A data em que o dado de preço foi coletado (AAAA-MM-DD).'),
  price: z.number().describe('O preço do item.'),
  notes: z.string().optional().describe('Quaisquer notas ou qualificações sobre o dado de preço.'),
});

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

// Para UI, nós adicionamos um 'id'.
export const PriceDataItemUISchema = PriceDataItemSchema.extend({
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
  calculationMethod?: "average" | "median" | "lowest"; // Estes podem ser traduzidos para exibição se necessário
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
  status: "Enviada" | "Respondida" | "Sem Resposta" | "Recusada"; // Status traduzido
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
