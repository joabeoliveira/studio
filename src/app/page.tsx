"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, PlusCircle, Activity, CheckCircle2, AlertTriangle, FileSearch } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { PriceResearchStatus } from "@/types";

interface DashboardStat {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColorClass: string;
  iconColorClass: string;
}

const stats: DashboardStat[] = [
  { title: "Pesquisas em Andamento", value: "12", icon: Activity, bgColorClass: "bg-blue-100 dark:bg-blue-900", iconColorClass: "text-primary" },
  { title: "Pesquisas Concluídas", value: "45", icon: CheckCircle2, bgColorClass: "bg-green-100 dark:bg-green-900", iconColorClass: "text-accent-foreground" },
  { title: "Ações Pendentes", value: "3", icon: AlertTriangle, bgColorClass: "bg-yellow-100 dark:bg-yellow-900", iconColorClass: "text-yellow-600 dark:text-yellow-400" },
  { title: "Total de Itens Cotados", value: "287", icon: FileSearch, bgColorClass: "bg-indigo-100 dark:bg-indigo-900", iconColorClass: "text-indigo-600 dark:text-indigo-400" },
];

const recentResearch = [
  { id: "R001", description: "Aquisição de Laptops de Escritório Modelo X", status: "Em Andamento" as PriceResearchStatus, date: "2024-07-20", agent: "João Ninguém" },
  { id: "R002", description: "Contratação de Serviços de Limpeza para Prédio A", status: "Concluída" as PriceResearchStatus, date: "2024-07-15", agent: "Joana Silva" },
  { id: "R003", description: "Compra de Resmas de Papel A4", status: "Pendente de Revisão" as PriceResearchStatus, date: "2024-07-22", agent: "Pedro Alves" },
  { id: "R004", description: "Renovação de Licença de Software - CRM", status: "Em Andamento" as PriceResearchStatus, date: "2024-07-18", agent: "Alice Ferreira" },
];

const statusBadgeVariant = (status: PriceResearchStatus) => {
  switch (status) {
    case "Em Andamento": return "secondary";
    case "Concluída": return "default"; 
    case "Pendente de Revisão": return "outline"; 
    case "Rascunho": return "destructive";
    default: return "secondary";
  }
};


export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Painel Principal</h1>
          <Link href="/research/new" passHref>
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Pesquisa de Preços
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-6 w-6 ${stat.iconColorClass}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Pesquisas de Preços Recentes</CardTitle>
            <CardDescription>Visão geral das últimas atividades de pesquisa.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar pesquisas..." className="pl-8 w-full sm:w-[300px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Pendente de Revisão">Pendente de Revisão</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResearch.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.agent}</TableCell>
                    <TableCell>
                      <Link href={`/research/${item.id}`} passHref>
                        <Button variant="outline" size="sm">Ver</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg" data-ai-hint="government building">
          <CardHeader>
            <CardTitle>Visão Geral de Conformidade</CardTitle>
            <CardDescription>Insights sobre a conformidade com a IN 65/2021.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Placeholder de Gráfico de Conformidade"
                width={600}
                height={400}
                className="rounded-md object-cover"
                data-ai-hint="compliance chart"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <p className="text-muted-foreground">Esta seção exibirá gráficos e estatísticas relacionadas à conformidade, como aderência aos parâmetros de coleta de preços, completude das justificativas e prazos de geração de relatórios.</p>
              <Button variant="secondary">Ver Detalhes de Conformidade</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
