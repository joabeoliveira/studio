"use client";

import { useState } from 'react';
import type { PriceDataItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface PriceDataItemFormProps {
  item?: Partial<PriceDataItem>;
  onSave: (item: PriceDataItem) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
  isExisting: boolean;
}

export function PriceDataItemForm({ item, onSave, onCancel, onDelete, isExisting }: PriceDataItemFormProps) {
  const [formData, setFormData] = useState<Partial<PriceDataItem>>(
    item || { source: '', date: '', price: 0, notes: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.source && formData.date && formData.price != null) {
      onSave({
        id: formData.id || `PDI-${Date.now()}`, // Generate ID if new
        source: formData.source,
        date: formData.date,
        price: formData.price,
        notes: formData.notes,
      });
      if (!isExisting) { // Clear form only if it's for adding new, not editing inline
        setFormData({ source: '', date: '', price: 0, notes: '' });
      }
    } else {
      alert("Please fill in all required fields: Source, Date, and Price.");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className={isExisting ? "py-2 px-4 border-b" : ""}>
        {isExisting && <CardTitle className="text-sm">Edit Price Data</CardTitle>}
      </CardHeader>
      <CardContent className={isExisting ? "pt-4 px-4" : "pt-6"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor={`source-${formData.id || 'new'}`}>Source</Label>
            <Input
              id={`source-${formData.id || 'new'}`}
              name="source"
              value={formData.source || ''}
              onChange={handleChange}
              placeholder="e.g., Painel de Preços, Supplier Quote"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`date-${formData.id || 'new'}`}>Date (YYYY-MM-DD)</Label>
              <Input
                id={`date-${formData.id || 'new'}`}
                name="date"
                type="date"
                value={formData.date || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor={`price-${formData.id || 'new'}`}>Price</Label>
              <Input
                id={`price-${formData.id || 'new'}`}
                name="price"
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`notes-${formData.id || 'new'}`}>Notes</Label>
            <Textarea
              id={`notes-${formData.id || 'new'}`}
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Any qualifications or details"
            />
          </div>
          <div className="flex justify-end space-x-2">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            <Button type="submit">{isExisting ? "Save Changes" : "Add Price Data"}</Button>
            {isExisting && onDelete && formData.id && (
              <Button type="button" variant="destructive" size="icon" onClick={() => onDelete(formData.id!)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
