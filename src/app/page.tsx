"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Activity, CheckCircle2, AlertTriangle, FileSearch, Loader2 } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import type { PriceResearch, PriceResearchStatus } from "@/types";
import { getDashboardStats, getRecentResearch } from "@/services/dashboardService";

const chartConfig = {
  percentual: { label: "Percentual (%)" },
  prazos: { label: "Aderência a Prazos", color: "hsl(var(--chart-1))" },
  coletas: { label: "Coletas Válidas", color: "hsl(var(--chart-2))" },
  justificativas: { label: "Justificativas", color: "hsl(var(--chart-3))" },
  documental: { label: "Documentação", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const complianceChartData = [
  { category: 'Aderência a Prazos', percentual: 85, fill: "var(--color-prazos)" },
  { category: 'Coletas Válidas', percentual: 92, fill: "var(--color-coletas)" },
  { category: 'Justificativas Completas', percentual: 78, fill: "var(--color-justificativas)" },
  { category: 'Conformidade Documental', percentual: 88, fill: "var(--color-documental)" },
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
  const [stats, setStats] = useState({ inProgress: 0, completed: 0, pendingReview: 0, totalResearches: 0 });
  const [recentResearch, setRecentResearch] = useState<PriceResearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      const [statsData, recentData] = await Promise.all([
        getDashboardStats(),
        getRecentResearch()
      ]);
      setStats(statsData);
      setRecentResearch(recentData);
      setIsLoading(false);
    }
    loadDashboardData();
  }, []);

  const statsCards = [
    { title: "Pesquisas em Andamento", value: stats.inProgress, icon: Activity },
    { title: "Pesquisas Concluídas", value: stats.completed, icon: CheckCircle2 },
    { title: "Ações Pendentes", value: stats.pendingReview, icon: AlertTriangle },
    { title: "Total de Pesquisas", value: stats.totalResearches, icon: FileSearch },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Painel Principal</h1>
          <Link href="/research" passHref>
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Pesquisa de Preços
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-6 w-6 text-muted-foreground" />
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
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>{item.responsibleAgent}</TableCell>
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
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Visão Geral de Conformidade</CardTitle>
            <CardDescription>Insights sobre a conformidade com a IN 65/2021.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceChartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis label={{ value: 'Percentual (%)', angle: -90, position: 'insideLeft', offset: -5 }} tickFormatter={(value) => `${value}%`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="percentual" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}