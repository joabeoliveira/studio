"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ReportTable } from "@/components/reports/report-table";
import type { Report } from "@/types";
import { Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReports } from "@/services/reportService";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true);
      const data = await getReports();
      setReports(data);
      setIsLoading(false);
    }
    fetchReports();
  }, []);

  const handleDownload = (report: Report) => {
    // Simula o download de um arquivo de texto
    alert(`Simulando download do relatório ${report.id}`);
  };

  const filteredReports = reports.filter(report =>
    report.researchDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Relatórios Gerados</h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Relatórios</CardTitle>
            <CardDescription>Visualizar e baixar relatórios de pesquisa de preços gerados.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar relatórios..."
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
                  <p className="ml-2">Carregando relatórios...</p>
              </div>
            ) : filteredReports.length > 0 ? (
                <ReportTable reports={filteredReports} onDownload={handleDownload} />
            ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum relatório encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}