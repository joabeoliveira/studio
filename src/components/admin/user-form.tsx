"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "@/lib/validators";
import type { User } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  initialData?: User | null;
}

export function UserForm({ isOpen, onClose, onSave, initialData }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      role: "Pesquisador",
      password: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(initialData || { name: "", email: "", role: "Pesquisador", password: "" });
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = (data: UserFormData) => {
    // Validação extra para o campo de senha ao criar um novo usuário
    if (!initialData && (!data.password || data.password.length < 6)) {
        form.setError("password", { type: "manual", message: "A senha é obrigatória e deve ter no mínimo 6 caracteres." });
        return;
    }
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar" : "Adicionar Novo"} Usuário</DialogTitle>
          <DialogDescription>
            {initialData ? "Atualize os detalhes e a permissão do usuário." : "Insira os detalhes para o novo usuário."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Completo *</FormLabel>
                            <FormControl><Input placeholder="Nome do usuário" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail *</FormLabel>
                            <FormControl><Input type="email" placeholder="usuario@example.gov.br" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Permissão *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Administrador">Administrador</SelectItem>
                                    <SelectItem value="Pesquisador">Pesquisador</SelectItem>
                                    <SelectItem value="Revisor">Revisor</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!initialData && (
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha Inicial *</FormLabel>
                                <FormControl><Input type="password" placeholder="Mínimo de 6 caracteres" {...field} /></FormControl>
                                <FormDescription>O usuário deverá trocar a senha no primeiro login.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Salvar Usuário</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}