"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/admin/user-table";
import { UserForm } from "@/components/admin/user-form";
import type { User } from "@/types";
import { PlusCircle, Search, Filter, Loader2 } from "lucide-react";
import { getProfiles, updateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { type UserFormData } from "@/lib/validators"; // <-- AQUI ESTÁ A IMPORTAÇÃO QUE FALTAVA

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    const profiles = await getProfiles();
    setUsers(profiles as User[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Atenção: Esta ação é irreversível. Deseja realmente excluir este usuário?")) {
      try {
        const response = await fetch('/api/admin/users/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIdToDelete: id }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }

        toast({ title: "Usuário Excluído!", description: "O usuário foi removido do sistema." });
        await fetchUsers();
      } catch (error: any) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleSaveUser = async (data: UserFormData) => {
    // Lógica de Edição (Update)
    if (data.id) { 
      try {
        await updateProfile(data.id, { name: data.name, role: data.role });
        toast({ title: "Usuário Atualizado!", description: `Os dados de ${data.name} foram atualizados.`});
        await fetchUsers();
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível atualizar o usuário.", variant: "destructive" });
      }
    } else {
      // Lógica de Criação (Create)
      try {
        const response = await fetch('/api/admin/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            fullName: data.name,
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Falha ao criar usuário.');
        }
        
        toast({ title: "Usuário Criado!", description: `${data.email} foi adicionado ao sistema.`});
        await fetchUsers();
      } catch (error: any) {
         toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Gerenciamento de Usuários</h1>
          <Button onClick={() => { setEditingUser(null); setIsFormOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Usuário
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>Gerenciar usuários da aplicação e suas permissões.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Buscar por nome ou e-mail..." 
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
                 <UserTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
            ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum usuário encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <UserForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveUser}
        initialData={editingUser}
      />
    </AppLayout>
  );
}