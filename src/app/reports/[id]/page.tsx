"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DownloadCloud, Printer, Loader2, AlertCircle } from "lucide-react";
import type { Report, PriceResearch } from "@/types";
import { getReportById } from "@/services/reportService";
import { getResearchItemById } from "@/services/researchService"; // Importar
import { ReportContent } from "@/components/reports/ReportContent"; // Importar nosso novo componente

export default function IndividualReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  
  const [report, setReport] = useState<Report | null>(null);
  const [researchItem, setResearchItem] = useState<PriceResearch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportData = useCallback(async () => {
    if (!reportId) return;
    setIsLoading(true);

    // 1. Busca os dados do relatório
    const foundReport = await getReportById(reportId);
    setReport(foundReport);

    // 2. Se encontrou o relatório, busca os dados da pesquisa associada
    if (foundReport) {
      const foundResearch = await getResearchItemById(foundReport.researchId);
      setResearchItem(foundResearch);
    }
    
    setIsLoading(false);
  }, [reportId]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <p>Carregando dados completos do relatório...</p>
        </div>
      </AppLayout>
    );
  }

  if (!report || !researchItem) {
    return (
      <AppLayout>
        <div className="flex flex-col justify-center items-center h-full text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold">Dados Incompletos</h2>
            <p className="text-muted-foreground mb-4">O relatório ou a pesquisa de preços associada não foram encontrados.</p>
            <Button variant="outline" onClick={() => router.push('/reports')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista
            </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 no-print">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <div className="flex gap-2">
                 <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Imprimir
                </Button>
                <Button onClick={handlePrint}>
                    <DownloadCloud className="mr-2 h-4 w-4" /> Baixar como PDF
                </Button>
            </div>
        </div>
        
        {/* Renderiza o componente do relatório */}
        <ReportContent report={report} researchItem={researchItem} />
        
      </div>
    </AppLayout>
  );
}