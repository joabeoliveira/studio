"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, DownloadCloud, Printer } from "lucide-react";
import type { Report } from "@/types";

// Mock data - em uma aplicação real, isso seria buscado
const mockReports: Report[] = [
  { id: "REP001", researchId: "PR001", researchDescription: "Aquisição de 100 Laptops de Escritório Modelo X2024", generationDate: "2024-07-18", generatedBy: "Ana Silva" },
  { id: "REP002", researchId: "PR002", researchDescription: "Desenvolvimento do Novo Portal de RH", generationDate: "2024-06-25", generatedBy: "Carlos Souza" },
];

export default function IndividualReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (reportId) {
      const foundReport = mockReports.find(r => r.id === reportId);
      setReport(foundReport || null);
    }
  }, [reportId]);

  const handleDownload = () => {
    if (!report) return;
    const reportContent = `
Relatório de Pesquisa de Preços
ID do Relatório: ${report.id}
ID da Pesquisa: ${report.researchId}
Descrição da Pesquisa: ${report.researchDescription}
Gerado em: ${new Date(report.generationDate).toLocaleDateString()}
Gerado por: ${report.generatedBy}

Detalhes da Pesquisa:
[Aqui entrariam os detalhes completos da pesquisa, dados coletados, análises, etc.]

Conclusão:
[Conclusão da pesquisa de preços]
    `;
    const blob = new Blob([reportContent.trim()], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Relatorio_${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!report) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-full">
          <p>Carregando dados do relatório ou relatório não encontrado...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Relatórios
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Relatório: {report.id}</CardTitle>
            <CardDescription>Detalhes do relatório gerado para a pesquisa: {report.researchDescription}</CardDescription>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <span><strong>ID da Pesquisa:</strong> {report.researchId}</span>
              <span><strong>Gerado por:</strong> {report.generatedBy}</span>
              <span><strong>Gerado em:</strong> {new Date(report.generationDate).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-xl font-semibold">Conteúdo do Relatório (Simulado)</h3>
            <div className="p-4 border rounded-md bg-muted/30 whitespace-pre-wrap">
              <p><strong>Relatório de Pesquisa de Preços</strong></p>
              <p><strong>ID do Relatório:</strong> {report.id}</p>
              <p><strong>ID da Pesquisa:</strong> {report.researchId}</p>
              <p><strong>Descrição da Pesquisa:</strong> {report.researchDescription}</p>
              <p><strong>Gerado em:</strong> {new Date(report.generationDate).toLocaleDateString()}</p>
              <p><strong>Gerado por:</strong> {report.generatedBy}</p>
              <br />
              <p><strong>Detalhes da Pesquisa:</strong></p>
              <p className="italic text-muted-foreground">[Aqui entrariam os detalhes completos da pesquisa, incluindo dados de preços coletados, justificativas, método de cálculo do preço estimado, e quaisquer problemas de conformidade encontrados.]</p>
              <p className="italic text-muted-foreground">Por exemplo:</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Preço estimado: R$ XXXX,XX</li>
                <li>Método: Mediana dos preços válidos.</li>
                <li>Fontes consultadas: Painel de Preços, Cotação Fornecedor A, Contrato similar XYZ.</li>
              </ul>
              <br />
              <p><strong>Conformidade (Art. 5º e 6º da IN 65/2021):</strong></p>
              <p className="italic text-muted-foreground">[Avaliação da conformidade, incluindo justificativas para descarte de preços, se menos de 3 cotações foram usadas, etc.]</p>
              <br />
              <p><strong>Conclusão:</strong></p>
              <p className="italic text-muted-foreground">[Conclusão e parecer sobre a pesquisa de preços.]</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
            <Button onClick={handleDownload}>
              <DownloadCloud className="mr-2 h-4 w-4" /> Baixar Relatório (.txt)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
