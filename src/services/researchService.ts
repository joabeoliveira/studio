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
  
  // Mapeia os campos do banco (snake_case) para o frontend (camelCase)
  return data.map((item: any) => ({
    id: String(item.id),
    description: item.description,
    responsibleAgent: item.responsible_agent,
    status: item.status,
    creationDate: item.created_at,
    lastModifiedDate: item.last_modified_date,
    contractType: item.contract_type,
    priceDataItems: [], // Itens de preço são carregados separadamente
    estimatedPrice: item.estimated_price,
    calculationMethod: item.calculation_method,
    justifications: item.justifications,
  }));
}

export async function addResearch(researchData: Partial<Omit<PriceResearch, 'id' | 'priceDataItems'>>): Promise<string> {
  const dataForDB = {
    description: researchData.description,
    responsible_agent: researchData.responsibleAgent,
    contract_type: researchData.contractType,
    status: researchData.status || 'Rascunho'
  };
  
  const { data, error } = await supabase
    .from('researches')
    .insert([dataForDB])
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
  const { data: researchData, error: researchError } = await supabase
    .from('researches')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (researchError) {
    console.error('Erro ao buscar detalhes da pesquisa:', researchError);
    return null;
  }

  const { data: priceItemsData, error: priceItemsError } = await supabase
    .from('price_data_items')
    .select('*')
    .eq('research_id', Number(id));

  if (priceItemsError) {
    console.error('Erro ao buscar itens de preço:', priceItemsError);
    return { 
        id: String(researchData.id),
        description: researchData.description,
        responsibleAgent: researchData.responsible_agent,
        status: researchData.status,
        creationDate: researchData.created_at,
        lastModifiedDate: researchData.last_modified_date,
        contractType: researchData.contract_type,
        priceDataItems: [],
        estimatedPrice: researchData.estimated_price,
        calculationMethod: researchData.calculation_method,
        justifications: researchData.justifications,
    };
  }
  
  const priceDataItems = priceItemsData.map((item: any) => ({
    id: String(item.id),
    source: item.source,
    source_type: item.source_type,
    date: item.date,
    price: item.price,
    notes: item.notes
  }));

  return { 
    id: String(researchData.id),
    description: researchData.description,
    responsibleAgent: researchData.responsible_agent,
    status: researchData.status,
    creationDate: researchData.created_at,
    lastModifiedDate: researchData.last_modified_date,
    contractType: researchData.contract_type,
    priceDataItems,
    estimatedPrice: researchData.estimated_price,
    calculationMethod: researchData.calculation_method,
    justifications: researchData.justifications,
  };
}

export async function updateResearchDetails(id: string, updates: Partial<Omit<PriceResearch, 'id' | 'priceDataItems'>>): Promise<void> {
    const updatesForDB: { [key: string]: any } = {
        last_modified_date: new Date().toISOString()
    };

    if (updates.description !== undefined) updatesForDB.description = updates.description;
    if (updates.responsibleAgent !== undefined) updatesForDB.responsible_agent = updates.responsibleAgent;
    if (updates.status !== undefined) updatesForDB.status = updates.status;
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
    .insert([{ ...itemData, research_id: Number(researchId) }])
    .select('id')
    .single();
  
  if (error) throw error;
  return String(data.id);
}

export async function updatePriceDataItem(id: string, itemData: Partial<Omit<PriceDataItem, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('price_data_items')
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