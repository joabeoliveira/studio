
import type { PriceDataItemSchema } from '@/ai/flows/validate-price-estimates';

export type UserRole = "Admin" | "Researcher" | "Reviewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type PriceResearchStatus = "Draft" | "Ongoing" | "Pending Review" | "Completed" | "Archived";
export type ContractType = "Goods" | "Services";

export interface PriceResearch {
  id: string;
  description: string;
  responsibleAgent: string; // User ID or name
  status: PriceResearchStatus;
  creationDate: string; // ISO Date string
  lastModifiedDate: string; // ISO Date string
  contractType: ContractType;
  attachments?: File[]; // Placeholder for file objects
  priceDataItems: PriceDataItem[];
  estimatedPrice?: number;
  calculationMethod?: "average" | "median" | "lowest";
}

// Re-exporting from AI flow for consistency, but potentially extending it for UI needs
export type PriceDataItem = Zod.infer<typeof PriceDataItemSchema> & { id: string };


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
  status: "Sent" | "Responded" | "No Response" | "Declined";
  proposalFile?: File; // Placeholder
  proposalDetails?: string; // Manual entry
}

export interface Report {
  id:string;
  researchId: string;
  researchDescription: string;
  generationDate: string;
  generatedBy: string; // User ID or name
  // Url to the report, or mock data
}
