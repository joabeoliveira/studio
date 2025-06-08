"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { priceDataItemSchema, type PriceDataItemFormData } from "@/lib/validators";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importar Select
import { Trash2 } from 'lucide-react';

const sourceTypes = [
    "I - Painel de Preços ou sistemas similares",
    "II - Contratações similares de outros órgãos",
    "III - Mídia especializada ou sites de e-commerce",
    "IV - Pesquisa direta com fornecedores",
    "V - Pesquisa na base de notas fiscais eletrônicas",
];

// ... (interface e função do componente)
export function PriceDataItemForm({ onSave, onDelete, initialData, isExisting, onCancel }: PriceDataItemFormProps) {
    const form = useForm<PriceDataItemFormData>({
        resolver: zodResolver(priceDataItemSchema),
        defaultValues: initialData || { source: '', source_type: '', date: '', price: 0, notes: '' },
    });
    
    // ... useEffect ...

    const handleSubmit = (data: PriceDataItemFormData) => {
        onSave(data);
        if (!isExisting) {
          form.reset({ source: '', source_type: '', date: '', price: 0, notes: '' });
        }
    };

    return (
        <Card>
            {/* ... CardHeader ... */}
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {/* NOVO CAMPO DE SELEÇÃO */}
                        <FormField
                          control={form.control}
                          name="source_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parâmetro (Art. 5º IN 65/2021) *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo da fonte de pesquisa..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sourceTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="source"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fonte Específica *</FormLabel>
                              <FormControl><Input placeholder="ex: Cotação Empresa X, Contrato 123/2024..." {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* ... Resto dos campos (date, price, notes) e botões ... */}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// DEFINIÇÃO DA INTERFACE PARA AS PROPS
interface PriceDataItemFormProps {
  onSave: (data: PriceDataItemFormData) => void;
  onDelete?: (id: string) => void;
  initialData?: PriceDataItemFormData;
  isExisting: boolean;
  onCancel?: () => void;
}