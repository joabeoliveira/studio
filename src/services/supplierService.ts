// src/services/supplierService.ts
import { supabase } from '@/lib/supabase';
import type { Supplier } from '@/types';

// O Supabase retorna `id` como um número, então ajustamos na hora de retornar.
interface SupplierFromDB extends Omit<Supplier, 'id'> {
  id: number;
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return [];
  }

  // Converte o id para string para ser compatível com o tipo `Supplier`
  return data.map(item => ({...item, id: String(item.id)}));
}

export async function addSupplier(supplierData: Omit<Supplier, 'id'>): Promise<string> {
  // Remove o campo 'id' se ele existir no objeto, pois o DB gera automaticamente
  const { id, ...dataToInsert } = supplierData as Supplier;

  const { data, error } = await supabase
    .from('suppliers')
    .insert([dataToInsert])
    .select('id')
    .single();

  if (error) {
    console.error('Erro ao adicionar fornecedor:', error);
    throw error;
  }
  
  return String(data.id);
}

export async function updateSupplier(id: string, supplierData: Partial<Omit<Supplier, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('suppliers')
    .update(supplierData)
    .eq('id', Number(id)); // Converte o ID de volta para número para a query

  if (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    throw error;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', Number(id));

  if (error) {
    console.error('Erro ao excluir fornecedor:', error);
    throw error;
  }
}