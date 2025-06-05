"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResearchTable } from "@/components/research/research-table";
import type { PriceResearch, PriceResearchStatus, ContractType } from "@/types";
import { PlusCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialResearchItems: PriceResearch[] = [
  { id: "PR001", description: "Aquisição de 100 Cadeiras de Escritório", responsibleAgent: "Ana Silva", status: "Em Andamento", creationDate: "2024-07-01", lastModifiedDate: "2024-07-15", contractType: "Bens", priceDataItems: [] },
  { id: "PR002", description: "Desenvolvimento do Novo Portal de RH", responsibleAgent: "Carlos Souza", status: "Concluída", creationDate: "2024-05-10", lastModifiedDate: "2024-06-20", contractType: "Serviços", priceDataItems: [] },
  { id: "PR003", description: "Fornecimento de Materiais de Impressão", responsibleAgent: "Beatriz Lima", status: "Rascunho", creationDate: "2024-07-20", lastModifiedDate: "2024-07-20", contractType: "Bens", priceDataItems: [] },
  { id: "PR004", description: "Serviços de Segurança para Edifício Principal", responsibleAgent: "David Costa", status: "Pendente de Revisão", creationDate: "2024-06-01", lastModifiedDate: "2024-07-10", contractType: "Serviços", priceDataItems: [] },
];

export default function ResearchPage() {
  const [researchItems, setResearchItems] = useState<PriceResearch[]>(initialResearchItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PriceResearchStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceResearch | null>(null);

  const [newResearchData, setNewResearchData] = useState<{description: string, responsibleAgent: string, contractType: ContractType}>({
    description: "", responsibleAgent: "", contractType: "Bens"
  });

  const handleEdit = (item: PriceResearch) => {
    setEditingItem(item);
    setNewResearchData({ description: item.description, responsibleAgent: item.responsibleAgent, contractType: item.contractType });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setResearchItems(researchItems.filter(item => item.id !== id));
  };
  
  const handleViewReport = (id: string) => {
    alert(`Visualizando relatório para ${id}`);
  };

  const handleFormSubmit = () => {
    if (editingItem) {
      setResearchItems(researchItems.map(item => item.id === editingItem.id ? { ...item, ...newResearchData, lastModifiedDate: new Date().toISOString() } : item));
    } else {
      const newItem: PriceResearch = {
        id: `PR${String(researchItems.length + 1).padStart(3, '0')}`,
        ...newResearchData,
        status: "Rascunho",
        creationDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        priceDataItems: [],
      };
      setResearchItems([...researchItems, newItem]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
    setNewResearchData({ description: "", responsibleAgent: "", contractType: "Bens" });
  };
  
  const openNewResearchForm = () => {
    setEditingItem(null);
    setNewResearchData({ description: "", responsibleAgent: "", contractType: "Bens" });
    setIsFormOpen(true);
  }

  const filteredItems = researchItems.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || item.status === statusFilter)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Pesquisa de Preços</h1>
          <Button onClick={openNewResearchForm}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Pesquisa
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Gerenciar Projetos de Pesquisa</CardTitle>
            <CardDescription>Criar, visualizar e gerenciar todas as iniciativas de pesquisa de preços.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Buscar por descrição..." 
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: PriceResearchStatus | "all") => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Pendente de Revisão">Pendente de Revisão</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Arquivada">Arquivada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Mais Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredItems.length > 0 ? (
                <ResearchTable researchItems={filteredItems} onEdit={handleEdit} onDelete={handleDelete} onViewReport={handleViewReport} />
            ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum item de pesquisa encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar" : "Criar Nova"} Pesquisa de Preços</DialogTitle>
            <DialogDescription>
              {editingItem ? "Atualize os detalhes da pesquisa de preços." : "Preencha os detalhes para iniciar uma nova pesquisa de preços."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descrição</Label>
              <Textarea 
                id="description" 
                value={newResearchData.description}
                onChange={(e) => setNewResearchData({...newResearchData, description: e.target.value})}
                className="col-span-3" 
                placeholder="Descrição detalhada do objeto"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsibleAgent" className="text-right">Agente Responsável</Label>
              <Input 
                id="responsibleAgent" 
                value={newResearchData.responsibleAgent}
                onChange={(e) => setNewResearchData({...newResearchData, responsibleAgent: e.target.value})}
                className="col-span-3"
                placeholder="Nome do agente ou equipe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contractType" className="text-right">Tipo de Contrato</Label>
              <Select 
                value={newResearchData.contractType}
                onValueChange={(value: ContractType) => setNewResearchData({...newResearchData, contractType: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bens">Bens</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            <Button type="submit" onClick={handleFormSubmit}>{editingItem ? "Salvar Alterações" : "Criar Pesquisa"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
