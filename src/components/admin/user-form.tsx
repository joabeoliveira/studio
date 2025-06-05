"use client";

import { useState, useEffect } from "react";
import type { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialData?: User | null;
}

export function UserForm({ isOpen, onClose, onSave, initialData }: UserFormProps) {
  const [user, setUser] = useState<Partial<User>>(initialData || { role: "Pesquisador"});

  useEffect(() => {
    setUser(initialData || { role: "Pesquisador"});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setUser(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = () => {
    if (user.name && user.email && user.role) {
      onSave(user as User); 
    } else {
      alert("Nome, E-mail e Permissão são obrigatórios.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar" : "Adicionar Novo"} Usuário</DialogTitle>
          <DialogDescription>
            {initialData ? "Atualize os detalhes e a permissão do usuário." : "Insira os detalhes para o novo usuário."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input id="name" name="name" value={user.name || ""} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">E-mail</Label>
            <Input id="email" name="email" type="email" value={user.email || ""} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Permissão</Label>
            <Select value={user.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a permissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Pesquisador">Pesquisador</SelectItem>
                <SelectItem value="Revisor">Revisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
           {(!initialData || !user.id) && ( 
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Senha</Label>
                <Input id="password" name="password" type="password" placeholder="Definir senha inicial" onChange={handleChange} className="col-span-3" />
            </div>
           )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Salvar Usuário</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
