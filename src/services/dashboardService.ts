// src/services/dashboardService.ts
import { supabase } from '@/lib/supabase';
import type { PriceResearch } from '@/types';

interface DashboardStats {
  inProgress: number;
  completed: number;
  pendingReview: number;
  totalResearches: number;
}

// Busca as estatísticas agregadas
export async function getDashboardStats(): Promise<DashboardStats> {
  // Usamos { count: 'exact', head: true } para apenas contar as linhas sem baixar os dados
  const { count: inProgress } = await supabase
    .from('researches')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Em Andamento');

  const { count: completed } = await supabase
    .from('researches')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Concluída');

  const { count: pendingReview } = await supabase
    .from('researches')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Pendente de Revisão');
    
  const { count: totalResearches } = await supabase
    .from('researches')
    .select('*', { count: 'exact', head: true });

  return {
    inProgress: inProgress ?? 0,
    completed: completed ?? 0,
    pendingReview: pendingReview ?? 0,
    totalResearches: totalResearches ?? 0,
  };
}

// Busca as pesquisas mais recentes
export async function getRecentResearch(limit = 4): Promise<PriceResearch[]> {
  const { data, error } = await supabase
    .from('researches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar pesquisas recentes:', error);
    return [];
  }
  
  // Converte o ID para string para manter a consistência do tipo
  return data.map(item => ({...item, id: String(item.id), priceDataItems: []}));
}