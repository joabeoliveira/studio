"use client";

import type { PriceResearch } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";

interface ResearchTableProps {
  researchItems: PriceResearch[];
  onEdit: (item: PriceResearch) => void;
  onDelete: (id: string) => void;
  onViewReport: (id: string) => void;
}

const statusBadgeVariant = (status: PriceResearchStatus) => {
  switch (status) {
    case "Ongoing": return "secondary";
    case "Completed": return "default";
    case "Pending Review": return "outline";
    case "Draft": return "destructive";
    default: return "secondary";
  }
};


export function ResearchTable({ researchItems, onEdit, onDelete, onViewReport }: ResearchTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {researchItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              <Link href={`/research/${item.id}`} className="text-primary hover:underline">
                {item.id}
              </Link>
            </TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>
              <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
            </TableCell>
            <TableCell>{item.contractType}</TableCell>
            <TableCell>{item.responsibleAgent}</TableCell>
            <TableCell>{new Date(item.lastModifiedDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewReport(item.id)}>
                    <FileText className="mr-2 h-4 w-4" /> View Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
