"use client";

import { useState, useEffect } from "react";
import type { Supplier } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  initialData?: Supplier | null;
}

export function SupplierForm({ isOpen, onClose, onSave, initialData }: SupplierFormProps) {
  const [supplier, setSupplier] = useState<Partial<Supplier>>(initialData || {});

  useEffect(() => {
    setSupplier(initialData || {});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (supplier.cnpjCpf && supplier.name) {
      onSave(supplier as Supplier); 
    } else {
      alert("CNPJ/CPF e Nome são obrigatórios.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar" : "Adicionar Novo"} Fornecedor</DialogTitle>
          <DialogDescription>
            {initialData ? "Atualize os detalhes do fornecedor." : "Insira os detalhes para o novo fornecedor."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cnpjCpf" className="text-right">CNPJ/CPF</Label>
            <Input id="cnpjCpf" name="cnpjCpf" value={supplier.cnpjCpf || ""} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input id="name" name="name" value={supplier.name || ""} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactName" className="text-right">Nome do Contato</Label>
            <Input id="contactName" name="contactName" value={supplier.contactName || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">E-mail</Label>
            <Input id="email" name="email" type="email" value={supplier.email || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Telefone</Label>
            <Input id="phone" name="phone" value={supplier.phone || ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Endereço</Label>
            <Input id="address" name="address" value={supplier.address || ""} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Salvar Fornecedor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
