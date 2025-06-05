"use client";

import type { Report } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Eye } from "lucide-react";
import Link from "next/link";

interface ReportTableProps {
  reports: Report[];
  onDownload: (report: Report) => void;
}

export function ReportTable({ reports, onDownload }: ReportTableProps) {
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
            <TableCell className="font-medium">
              <Link href={`/reports/${report.id}`} passHref>
                <span className="text-primary hover:underline cursor-pointer">{report.id}</span>
              </Link>
            </TableCell>
            <TableCell>{report.researchDescription}</TableCell>
            <TableCell>{new Date(report.generationDate).toLocaleDateString()}</TableCell>
            <TableCell>{report.generatedBy}</TableCell>
            <TableCell className="text-right space-x-2">
              <Link href={`/reports/${report.id}`} passHref>
                <Button variant="outline" size="sm" asChild>
                  <a><Eye className="mr-1 h-4 w-4" /> Visualizar</a>
                </Button>
              </Link>
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
