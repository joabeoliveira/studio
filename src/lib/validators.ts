// src/lib/validators.ts
import { z } from 'zod';
import { UserRoleSchema } from '@/types'; // Importando o schema de permissões

// Schema para o formulário de Fornecedores
export const supplierSchema = z.object({
  id: z.string().optional(),
  cnpjCpf: z.string().min(1, { message: "O CNPJ/CPF é obrigatório." }),
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  contactName: z.string().optional(),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;


// Schema para o formulário de Itens de Dados de Preço
export const priceDataItemSchema = z.object({
    id: z.string().optional(),
    source: z.string().min(1, { message: "A fonte é obrigatória." }),
    // Adicionando o novo campo de tipo de fonte
    source_type: z.string().min(1, { message: "Selecione o tipo da fonte." }),
    date: z.string().min(1, { message: "A data é obrigatória." }),
    price: z.coerce.number().positive({ message: "O preço deve ser um número positivo." }),
    notes: z.string().optional(),
});

export type PriceDataItemFormData = z.infer<typeof priceDataItemSchema>;

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  email: z.string().email({ message: "E-mail inválido." }),
  role: UserRoleSchema,
  // A senha é opcional no schema, mas a lógica do formulário exigirá para novos usuários
  password: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
