// src/services/profileService.ts
import { supabase } from '@/lib/supabase';
import type { User as Profile } from '@/types'; // Reutilizando o tipo User como Profile

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
  return data as Profile;
}

// --- NOVA FUNÇÃO ---
// Busca todos os perfis de usuários do banco de dados
export async function getProfiles(): Promise<Profile[]> {
  // Chamando a função do banco de dados via RPC (Remote Procedure Call)
  const { data, error } = await supabase.rpc('get_all_users_with_profiles');
    
  if (error) {
    console.error('Erro ao buscar perfis:', error);
    return [];
  }
  return data as Profile[];
}

// --- NOVA FUNÇÃO ---
// Atualiza os dados de um perfil específico (ex: nome, permissão)
export async function updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'email'>>): Promise<void> {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    
    if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw error;
    }
}