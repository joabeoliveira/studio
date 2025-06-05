"use client";

import type { Report } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Eye } from "lucide-react";

interface ReportTableProps {
  reports: Report[];
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
}

export function ReportTable({ reports, onView, onDownload }: ReportTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID do Relatório</TableHead>
          <TableHead>Descrição da Pesquisa</TableHead>
          <TableHead>Gerado Em</TableHead>
          <TableHead>Gerado Por</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="font-medium">{report.id}</TableCell>
            <TableCell>{report.researchDescription}</TableCell>
            <TableCell>{new Date(report.generationDate).toLocaleDateString()}</TableCell>
            <TableCell>{report.generatedBy}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onView(report)}>
                <Eye className="mr-1 h-4 w-4" /> Visualizar
              </Button>
              <Button variant="default" size="sm" onClick={() => onDownload(report)}>
                <DownloadCloud className="mr-1 h-4 w-4" /> Baixar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
