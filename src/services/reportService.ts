// src/services/reportService.ts
import { supabase } from '@/lib/supabase';
import type { Report } from '@/types';

type ReportForDB = {
  research_id: number;
  research_description: string;
  generated_by_name: string;
  generated_by_id: string;
}

// Mapeia as colunas do banco (snake_case) para o frontend (camelCase)
const mapReportFromDB = (item: any): Report => ({
  id: String(item.id),
  researchId: String(item.research_id),
  researchDescription: item.research_description,
  generationDate: item.generation_date,
  generatedBy: item.generated_by_name,
});


export async function getReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('generation_date', { ascending: false });

  if (error) {
    console.error("Erro ao buscar relatórios:", error);
    return [];
  }

  return data.map(mapReportFromDB);
}

export async function addReport(reportData: ReportForDB): Promise<string> {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select('id')
    .single();

  if (error) {
    console.error("Erro ao adicionar relatório:", error);
    throw error;
  }
  return String(data.id);
}

// NOVA FUNÇÃO ADICIONADA AQUI
export async function getReportById(id: string): Promise<Report | null> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', Number(id))
    .single();
  
  if (error) {
    console.error(`Erro ao buscar relatório ${id}:`, error);
    return null;
  }

  return mapReportFromDB(data);
}