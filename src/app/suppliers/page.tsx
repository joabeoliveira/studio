"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SupplierTable } from "@/components/suppliers/supplier-table";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import type { Supplier } from "@/types";
import { PlusCircle, Search, Filter, Mail } from "lucide-react";
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


const initialSuppliers: Supplier[] = [
  { id: "S001", cnpjCpf: "12.345.678/0001-99", name: "Tech Solutions Ltda", contactName: "Carlos Pereira", email: "carlos@techsolutions.com", phone: "(11) 98765-4321", address: "Rua Inovação, 123, São Paulo, SP" },
  { id: "S002", cnpjCpf: "98.765.432/0001-11", name: "Office Supplies Inc.", contactName: "Mariana Costa", email: "mariana.costa@officesupplies.com", phone: "(21) 91234-5678", address: "Av. Central, 456, Rio de Janeiro, RJ" },
  { id: "S003", cnpjCpf: "111.222.333-44", name: "Consultoria Global", contactName: "Roberto Almeida", email: "roberto@consultglobal.com", phone: "(31) 99999-8888", address: "Praça da Liberdade, 789, Belo Horizonte, MG" },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [quoteTargetSupplier, setQuoteTargetSupplier] = useState<Supplier | null>(null);
  const [quoteDetails, setQuoteDetails] = useState({ subject: "", body: "" });

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
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

  const handleSaveSupplier = (supplier: Supplier) => {
    if (supplier.id) { 
      setSuppliers(suppliers.map(s => s.id === supplier.id ? supplier : s));
    } else { 
      const newSupplier = { ...supplier, id: `S${String(suppliers.length + 1).padStart(3, '0')}` };
      setSuppliers([...suppliers, newSupplier]);
    }
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
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSuppliers.length > 0 ? (
                <SupplierTable suppliers={filteredSuppliers} onEdit={handleEdit} onDelete={handleDelete} onSendQuoteRequest={handleOpenSendQuoteRequest} />
            ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum fornecedor encontrado.</p>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Solicitação de Cotação para {quoteTargetSupplier?.name}</DialogTitle>
            <DialogDescription>
              Revise e envie o e-mail de solicitação de cotação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="quoteSubject">Assunto</Label>
              <Input id="quoteSubject" value={quoteDetails.subject} onChange={(e) => setQuoteDetails({...quoteDetails, subject: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="quoteBody">Corpo do E-mail</Label>
              <Textarea id="quoteBody" value={quoteDetails.body} onChange={(e) => setQuoteDetails({...quoteDetails, body: e.target.value})} rows={10} />
            </div>
            <div className="text-sm text-muted-foreground">
              Isso simulará o envio de um e-mail. Em uma aplicação real, isso seria integrado a um serviço de e-mail.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuoteFormOpen(false)}>Cancelar</Button>
            <Button onClick={handleSendQuoteEmail}><Mail className="mr-2 h-4 w-4" /> Enviar E-mail</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AppLayout>
  );
}
