"use client";

import type { Supplier } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Mail } from "lucide-react";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onSendQuoteRequest: (supplier: Supplier) => void;
}

export function SupplierTable({ suppliers, onEdit, onDelete, onSendQuoteRequest }: SupplierTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>CNPJ/CPF</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="font-medium">{supplier.cnpjCpf}</TableCell>
            <TableCell>{supplier.name}</TableCell>
            <TableCell>{supplier.contactName || "-"}</TableCell>
            <TableCell>{supplier.email || "-"}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(supplier)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSendQuoteRequest(supplier)}>
                    <Mail className="mr-2 h-4 w-4" /> Enviar Pedido de Cotação
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(supplier.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
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
