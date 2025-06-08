"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResearchTable } from "@/components/research/research-table";
import type { PriceResearch, PriceResearchStatus, ContractType } from "@/types";
import { PlusCircle, Search, Filter, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { getResearchItems, addResearch, updateResearchDetails, deleteResearch } from "@/services/researchService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ResearchPage() {
  const [researchItems, setResearchItems] = useState<PriceResearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PriceResearchStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceResearch | null>(null);

  const { toast } = useToast();
  const { userProfile } = useAuth();
  const router = useRouter();

  const [newResearchData, setNewResearchData] = useState<{description: string, responsibleAgent: string, contractType: ContractType}>({
    description: "", responsibleAgent: "", contractType: "Bens"
  });

  const fetchResearch = async () => {
    setIsLoading(true);
    try {
      const items = await getResearchItems();
      setResearchItems(items);
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao carregar pesquisas.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleEdit = (item: PriceResearch) => {
    setEditingItem(item);
    setNewResearchData({ description: item.description, responsibleAgent: item.responsibleAgent, contractType: item.contractType });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este item? Esta ação é irreversível.")) {
      try {
        await deleteResearch(id);
        toast({ title: "Sucesso!", description: "Pesquisa excluída." });
        await fetchResearch();
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível excluir a pesquisa.", variant: "destructive" });
      }
    }
  };

  const handleFormSubmit = async () => {
    if (!userProfile) {
        toast({ title: "Erro de Autenticação", description: "Usuário não encontrado.", variant: "destructive" });
        return;
    }

    try {
      if (editingItem) {
        // Lógica de Edição
        await updateResearchDetails(editingItem.id, {
            description: newResearchData.description,
            responsibleAgent: newResearchData.responsibleAgent,
            contractType: newResearchData.contractType,
        });
        toast({ title: "Sucesso!", description: "Pesquisa atualizada." });
      } else {
        // Lógica de Criação
        const newId = await addResearch({
          ...newResearchData,
          status: "Rascunho", // Status inicial padrão
        });
        toast({ title: "Sucesso!", description: "Nova pesquisa criada." });
        router.push(`/research/${newId}`); // Redireciona para a página da nova pesquisa
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
      await fetchResearch(); // Recarrega a lista
    } catch (error) {
        toast({ title: "Erro ao Salvar", description: "Não foi possível salvar a pesquisa.", variant: "destructive" });
    }
  };
  
  const openNewResearchForm = () => {
    setEditingItem(null);
    setNewResearchData({ description: "", responsibleAgent: userProfile?.name || "", contractType: "Bens" });
    setIsFormOpen(true);
  };

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
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Carregando pesquisas...</p>
              </div>
            ) : filteredItems.length > 0 ? (
                <ResearchTable researchItems={filteredItems} onEdit={handleEdit} onDelete={handleDelete} onViewReport={function (id: string): void {
                  throw new Error("Function not implemented.");
                } } />
            ) : (
                <p className="text-center text-muted-foreground py-8">Nenhuma pesquisa encontrada. Clique em "Nova Pesquisa" para começar.</p>
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