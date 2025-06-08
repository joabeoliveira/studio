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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Save, XCircle } from 'lucide-react';

const sourceTypes = [
    "I - Painel de Preços ou sistemas similares",
    "II - Contratações similares de outros órgãos",
    "III - Mídia especializada ou sites de e-commerce",
    "IV - Pesquisa direta com fornecedores",
    "V - Pesquisa na base de notas fiscais eletrônicas",
];

interface PriceDataItemFormProps {
  onSave: (data: PriceDataItemFormData) => void;
  onDelete?: (id: string) => void;
  initialData?: PriceDataItemFormData;
  isExisting: boolean;
  onCancel?: () => void;
}

export function PriceDataItemForm({ onSave, onDelete, initialData, isExisting, onCancel }: PriceDataItemFormProps) {
    const form = useForm<PriceDataItemFormData>({
        resolver: zodResolver(priceDataItemSchema),
        defaultValues: initialData || { source: '', source_type: '', date: '', price: 0, notes: '' },
    });

    useEffect(() => {
        form.reset(initialData || { source: '', source_type: '', date: '', price: 0, notes: '' });
    }, [initialData, form.reset]);

    const handleSubmit = (data: PriceDataItemFormData) => {
        onSave(data);
        if (!isExisting) {
          form.reset({ source: '', source_type: '', date: '', price: 0, notes: '' });
        }
    };

    return (
        <Card className="mb-4 bg-muted/20 border-dashed">
            {isExisting && (
                <CardHeader className="py-2 px-4 border-b flex-row justify-between items-center">
                    <CardTitle className="text-base">Editar Item</CardTitle>
                    {onDelete && initialData?.id && (
                         <Button variant="ghost" size="icon" onClick={() => onDelete(initialData.id!)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                    )}
                </CardHeader>
            )}
            <CardContent className="pt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="source_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Parâmetro (Art. 5º IN 65/2021) *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo..." />
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
                                  <FormControl><Input placeholder="ex: Cotação Empresa X..." {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Data da Coleta *</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Preço (R$) *</FormLabel>
                                    <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Notas</FormLabel>
                                <FormControl><Textarea placeholder="Qualquer observação relevante..." {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex justify-end gap-2">
                           {onCancel && (
                             <Button type="button" variant="ghost" onClick={onCancel}>
                               <XCircle className="mr-2 h-4 w-4"/> Cancelar
                             </Button>
                           )}
                           <Button type="submit">
                                <Save className="mr-2 h-4 w-4"/> Salvar Item
                           </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}