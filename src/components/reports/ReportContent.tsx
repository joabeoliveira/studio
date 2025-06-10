"use client";

import type { Report, PriceResearch } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ReportContentProps {
  report: Report;
  researchItem: PriceResearch;
}

// Função auxiliar para formatar moeda
const formatCurrency = (value?: number) => {
  if (value === null || value === undefined) return "N/A";
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function ReportContent({ report, researchItem }: ReportContentProps) {
  const validPrices = researchItem.priceDataItems; // Assumindo que a lógica de descarte já foi feita

  return (
    // O ID "report-content" é usado pelo CSS de impressão
    <div id="report-content" className="p-4 bg-background">
      <Card className="shadow-none border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">NOTA TÉCNICA DE PESQUISA DE PREÇOS</CardTitle>
          <CardDescription>Processo Administrativo nº [INSERIR Nº PROCESSO]</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-sm">

          {/* Seção I - Objeto */}
          <section>
            <h2 className="text-lg font-bold mb-2 border-b pb-1">I - OBJETO DA CONTRATAÇÃO</h2>
            <p>{researchItem.description}</p>
          </section>

          {/* Seção II - Fontes Consultadas */}
          <section>
            <h2 className="text-lg font-bold mb-2 border-b pb-1">II - FONTES CONSULTADAS</h2>
            <p className="mb-2">
              Para a definição do valor estimado da contratação foram utilizados os seguintes parâmetros da IN SEGES/ME nº 65/2021:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {/* Lista dinâmica dos tipos de fontes usados */}
              {[...new Set(validPrices.map(p => p.source_type))].map(sourceType => (
                <li key={sourceType}>{sourceType}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              {/* Exemplo de justificativa, que viria do formulário */}
              <strong>Justificativa:</strong> {researchItem.justifications?.method || "Não foi necessário justificar a não priorização dos incisos I e II do Art. 5º."}
            </p>
          </section>

          {/* Seção III - Série de Preços Coletados */}
          <section>
            <h2 className="text-lg font-bold mb-2 border-b pb-1">III - SÉRIE DE PREÇOS COLETADOS</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fonte da Pesquisa</TableHead>
                  <TableHead>Fonte Específica</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor Encontrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {researchItem.priceDataItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.source_type}</TableCell>
                    <TableCell>{item.source}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          {/* Seção IV - Metodologia */}
          <section>
            <h2 className="text-lg font-bold mb-2 border-b pb-1">IV - METODOLOGIA PARA OBTENÇÃO DO PREÇO ESTIMADO</h2>
            <p className="mb-2">
              A obtenção do preço estimado deu-se com base na <strong>{researchItem.calculationMethod || 'Não definido'}</strong> dos valores válidos obtidos na pesquisa de preços.
            </p>
            <div className="bg-muted/50 p-3 rounded-md space-y-2">
              <p><strong>Justificativa da Metodologia:</strong> {researchItem.justifications?.method || "Metodologia padrão aplicada."}</p>
              <p><strong>Justificativa para Descarte de Preços:</strong> {researchItem.justifications?.desconsideration || "Não houve descarte de preços."}</p>
              <p><strong>Justificativa para Cesta com Menos de 3 Preços:</strong> {researchItem.justifications?.lessThanThree || "A cesta de preços contém três ou mais cotações válidas."}</p>
            </div>
          </section>

          {/* Seção V - Memória de Cálculo e Conclusão */}
          <section>
            <h2 className="text-lg font-bold mb-2 border-b pb-1">V - MEMÓRIA DE CÁLCULO E CONCLUSÃO</h2>
            <p className="mb-2">O preço estimado da contratação é de <strong>{formatCurrency(researchItem.estimatedPrice)}</strong>.</p>
            <div className="bg-primary/10 p-4 rounded-md text-center">
              <p className="font-semibold">Valor Estimado Final: <span className="text-xl font-bold">{formatCurrency(researchItem.estimatedPrice)}</span></p>
            </div>
            <p className="mt-4">
              Após a realização de pesquisa de preços em conformidade com a IN SEGES/ME nº 65/2021, certifica-se que o preço estimado para a presente contratação é compatível com os praticados no mercado.
            </p>
          </section>

          {/* Seção VI - Identificação */}
          <section>
            <h2 className="text-lg font-bold mb-2 border-b pb-1">VI - IDENTIFICAÇÃO DO AGENTE RESPONSÁVEL</h2>
            <p>A presente pesquisa de preços foi conduzida por: <strong>{researchItem.responsibleAgent}</strong>.</p>
          </section>

          {/* Assinatura */}
          <footer className="pt-10 text-center">
            <div className="inline-block">
                <p className="border-t pt-2">______________________________________</p>
                <p>{researchItem.responsibleAgent}</p>
                <p className="text-xs text-muted-foreground">[Cargo do Agente]</p>
            </div>
            <p className="mt-8 text-xs">{report.id} - Gerado em: {new Date(report.generationDate).toLocaleString('pt-BR')}</p>
          </footer>

        </CardContent>
      </Card>
    </div>
  );
}