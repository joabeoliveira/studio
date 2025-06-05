"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ReportTable } from "@/components/reports/report-table";
import type { Report } from "@/types";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialReports: Report[] = [
  { id: "REP001", researchId: "PR001", researchDescription: "Aquisição de 100 Laptops de Escritório Modelo X2024", generationDate: "2024-07-18", generatedBy: "Ana Silva" },
  { id: "REP002", researchId: "PR002", researchDescription: "Desenvolvimento do Novo Portal de RH", generationDate: "2024-06-25", generatedBy: "Carlos Souza" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (report: Report) => {
    alert(`Visualizando relatório: ${report.id} - ${report.researchDescription}`);
  };

  const handleDownload = (report: Report) => {
    alert(`Baixando relatório: ${report.id} - ${report.researchDescription}.pdf`);
  };

  const filteredReports = reports.filter(report =>
    report.researchDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Relatórios Gerados</h1>
        </div>

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
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
             {filteredReports.length > 0 ? (
                <ReportTable reports={filteredReports} onView={handleView} onDownload={handleDownload} />
            ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum relatório encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
