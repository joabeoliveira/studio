// src/services/researchService.ts
import { supabase } from '@/lib/supabase';
import type { PriceResearch, PriceDataItem, PriceResearchStatus } from '@/types';

// Tipos auxiliares para conversão de ID
type ResearchFromDB = Omit<PriceResearch, 'id' | 'priceDataItems'> & { id: number; };
type PriceDataItemFromDB = Omit<PriceDataItem, 'id'> & { id: number; research_id: number };

// --- FUNÇÕES EXISTENTES ---

export async function getResearchItems(): Promise<PriceResearch[]> {
  const { data, error } = await supabase
    .from('researches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pesquisas:', error);
    return [];
  }
  
  return data.map((item: ResearchFromDB) => ({
    ...item,
    id: String(item.id), // Converte id para string
    priceDataItems: [],
  }));
}

export async function addResearch(researchData: Partial<Omit<PriceResearch, 'id' | 'priceDataItems'>>): Promise<string> {
  // Mapeia os campos de camelCase (do formulário) para snake_case (do banco de dados)
  const dataForDB = {
    description: researchData.description,
    responsible_agent: researchData.responsibleAgent, // Traduzido
    contract_type: researchData.contractType,       // Traduzido
    status: researchData.status || 'Rascunho'        // Garante um status padrão
  };

  console.log('Enviando para o Supabase:', dataForDB);
  
  const { data, error } = await supabase
    .from('researches')
    .insert([dataForDB]) // Usa o objeto traduzido para o banco de dados
    .select('id')
    .single();

  if (error) {
    console.error('Erro ao adicionar pesquisa:', error);
    throw error;
  }
  return String(data.id);
}


export async function deleteResearch(id: string): Promise<void> {
    const { error } = await supabase
      .from('researches')
      .delete()
      .eq('id', Number(id));
  
    if (error) {
      console.error('Erro ao excluir pesquisa:', error);
      throw error;
    }
}

// --- NOVAS FUNÇÕES ---

export async function getResearchItemById(id: string): Promise<PriceResearch | null> {
  // 1. Busca os detalhes da pesquisa principal
  const { data: researchData, error: researchError } = await supabase
    .from('researches')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (researchError) {
    console.error('Erro ao buscar detalhes da pesquisa:', researchError);
    return null;
  }

  // 2. Busca os itens de preço associados
  const { data: priceItemsData, error: priceItemsError } = await supabase
    .from('price_data_items')
    .select('*')
    .eq('research_id', Number(id));

  if (priceItemsError) {
    console.error('Erro ao buscar itens de preço:', priceItemsError);
    // Retorna a pesquisa mesmo que os itens de preço falhem
    return { ...researchData, id: String(researchData.id), priceDataItems: [] };
  }
  
  const priceDataItems = priceItemsData.map((item: PriceDataItemFromDB) => ({
    ...item,
    id: String(item.id),
  }));

  return { ...researchData, id: String(researchData.id), priceDataItems };
}

export async function updateResearchDetails(id: string, updates: Partial<Omit<PriceResearch, 'id' | 'priceDataItems'>>): Promise<void> {
    const updatesForDB: { [key: string]: any } = {
        last_modified_date: new Date().toISOString()
    };

    if (updates.description !== undefined) updatesForDB.description = updates.description;
    // CORREÇÃO: Mapeando responsibleAgent para responsible_agent
    if (updates.responsibleAgent !== undefined) updatesForDB.responsible_agent = updates.responsibleAgent;
    if (updates.status !== undefined) updatesForDB.status = updates.status;
    // CORREÇÃO: Mapeando contractType para contract_type
    if (updates.contractType !== undefined) updatesForDB.contract_type = updates.contractType;
    if (updates.estimatedPrice !== undefined) updatesForDB.estimated_price = updates.estimatedPrice;
    if (updates.calculationMethod !== undefined) updatesForDB.calculation_method = updates.calculationMethod;
    if (updates.justifications !== undefined) updatesForDB.justifications = updates.justifications;
    
    const { error } = await supabase
        .from('researches')
        .update(updatesForDB)
        .eq('id', Number(id));

    if (error) {
        console.error("Erro ao atualizar detalhes da pesquisa:", error);
        throw error;
    }
}


export async function addPriceDataItem(researchId: string, itemData: Omit<PriceDataItem, 'id'>): Promise<string> {
  const { data, error } = await supabase
    .from('price_data_items')
    // A query já usa '...itemData', então ela incluirá o novo campo automaticamente.
    .insert([{ ...itemData, research_id: Number(researchId) }])
    .select('id')
    .single();
  
  if (error) throw error;
  return String(data.id);
}

export async function updatePriceDataItem(id: string, itemData: Partial<Omit<PriceDataItem, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('price_data_items')
    // A query já usa '...itemData', então ela incluirá o novo campo automaticamente.
    .update(itemData)
    .eq('id', Number(id));
  
  if (error) throw error;
}

export async function deletePriceDataItem(id: string): Promise<void> {
    const { error } = await supabase
        .from('price_data_items')
        .delete()
        .eq('id', Number(id));
    
    if (error) throw error;
}