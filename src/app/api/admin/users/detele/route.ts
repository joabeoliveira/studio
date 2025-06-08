// src/app/api/admin/users/delete/route.ts
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { userIdToDelete } = await req.json();

  if (!userIdToDelete) {
    return NextResponse.json({ error: 'ID do usuário não fornecido' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Lembre-se que o ON DELETE CASCADE na tabela `profiles` cuidará de remover o perfil associado.

  return NextResponse.json({ message: 'Usuário excluído com sucesso' });
}