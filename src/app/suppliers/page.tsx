"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SupplierTable } from "@/components/suppliers/supplier-table";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import type { Supplier } from "@/types";
import { PlusCircle, Search, Filter, Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from "@/services/supplierService";
import { type SupplierFormData } from "@/lib/validators"; // <-- 1. IMPORTAÇÃO ADICIONADA AQUI

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  // 2. O ESTADO DE EDIÇÃO AGORA USA O TIPO DO FORMULÁRIO PARA CONSISTÊNCIA
  const [editingSupplier, setEditingSupplier] = useState<SupplierFormData | null>(null);

  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [quoteTargetSupplier, setQuoteTargetSupplier] = useState<Supplier | null>(null);
  const [quoteDetails, setQuoteDetails] = useState({ subject: "", body: "" });

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const suppliersFromDb = await getSuppliers();
      setSuppliers(suppliersFromDb);
    } catch (error) {
      console.error("Falha ao buscar fornecedores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier: Supplier) => {
    // Ao editar, garantimos que o objeto passado para o formulário corresponda a SupplierFormData
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      await deleteSupplier(id);
      await fetchSuppliers();
    }
  };
  
  const handleOpenSendQuoteRequest = (supplier: Supplier) => {
    setQuoteTargetSupplier(supplier);
    setQuoteDetails({ subject: `Solicitação de Cotação - ${supplier.name}`, body: `Prezado(a) ${supplier.contactName || supplier.name},\n\nSolicitamos cotação para os seguintes itens/serviços: [DETALHAR ITENS/SERVIÇOS AQUI]\n\nPrazo para resposta: [INSERIR PRAZO]\n\nAtenciosamente,\n[SEU NOME/ÓRGÃO]` });
    setIsQuoteFormOpen(true);
  };

  const handleSendQuoteEmail = () => {
    alert(`E-mail de cotação enviado para ${quoteTargetSupplier?.email} (simulado).\nAssunto: ${quoteDetails.subject}`);
    setIsQuoteFormOpen(false);
    setQuoteTargetSupplier(null);
  };

  // 3. A FUNÇÃO DE SALVAR AGORA RECEBE O TIPO CORRETO DO FORMULÁRIO
  const handleSaveSupplier = async (data: SupplierFormData) => {
    // Se o dado tiver um ID, é uma edição
    if (data.id) { 
      const { id, ...dataToUpdate } = data;
      await updateSupplier(id, dataToUpdate);
    } else { 
      // Senão, é uma criação
      await addSupplier(data);
    }
    await fetchSuppliers();
    setIsFormOpen(false);
    setEditingSupplier(null);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cnpjCpf.includes(searchTerm)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Gerenciamento de Fornecedores</h1>
          <Button onClick={() => { setEditingSupplier(null); setIsFormOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Fornecedor
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Fornecedores</CardTitle>
            <CardDescription>Gerencie sua lista de fornecedores potenciais e suas informações de contato.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Buscar por nome ou CNPJ/CPF..." 
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
                    <p className="ml-2">Carregando fornecedores...</p>
                </div>
            ) : filteredSuppliers.length > 0 ? (
                <SupplierTable suppliers={filteredSuppliers} onEdit={handleEdit} onDelete={handleDelete} onSendQuoteRequest={handleOpenSendQuoteRequest} />
            ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum fornecedor encontrado. Clique em "Adicionar Fornecedor" para começar.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <SupplierForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveSupplier}
        initialData={editingSupplier}
      />

      <Dialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen}>
        {/* ... (Conteúdo do diálogo de cotação - sem alterações) ... */}
      </Dialog>
    </AppLayout>
  );
}