"use client";

import { useState } from 'react';
import type { AiPriceDataItem as PriceDataItemTypeForAI } from '@/ai/flows/validate-price-estimates';
import { validatePriceEstimates, type ValidatePriceEstimatesInput, type ValidatePriceEstimatesOutput } from '@/ai/flows/validate-price-estimates';
import type { PriceDataItem as PriceDataItemUIType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Sigma, FileDigit } from 'lucide-react';
import { PriceDataItemForm } from './price-data-item-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { type PriceDataItemFormData } from '@/lib/validators';

interface AiValidationSectionProps {
  researchDescription: string;
  initialPriceData: PriceDataItemUIType[];
  onPriceDataUpdate: (updatedData: PriceDataItemUIType[]) => void;
}

export function AiValidationSection({ researchDescription, initialPriceData, onPriceDataUpdate }: AiValidationSectionProps) {
  const [priceData, setPriceData] = useState<PriceDataItemUIType[]>(initialPriceData);
  const [currentDescription, setCurrentDescription] = useState(researchDescription);
  const [validationResult, setValidationResult] = useState<ValidatePriceEstimatesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  const handleAddPriceDataItem = (item: PriceDataItemFormData) => {
    const newItem: PriceDataItemUIType = {
      ...item,
      id: `temp-${Date.now()}`,
      price: Number(item.price),
      source_type: item.source_type ?? "", // valor padrão vazio ou outro valor padrão
    };
    const updatedData = [...priceData, newItem];
    setPriceData(updatedData);
    onPriceDataUpdate(updatedData); 
    setShowAddItemForm(false);
  };

  const handleUpdatePriceDataItem = (updatedItem: PriceDataItemFormData) => {
    const updatedData = priceData.map(item =>
      item.id === updatedItem.id
        ? {
            ...item,
            ...updatedItem,
            price: Number(updatedItem.price),
            source_type: updatedItem.source_type ?? item.source_type ?? "", // garante que nunca será undefined
          }
        : item
    );
    setPriceData(updatedData);
    onPriceDataUpdate(updatedData); 
  };

  const handleDeletePriceDataItem = (id: string) => {
    const updatedData = priceData.filter(item => item.id !== id);
    setPriceData(updatedData);
    onPriceDataUpdate(updatedData); 
  };

  const handleValidate = async () => {
    if (priceData.length === 0) {
      setError("Adicione pelo menos um item de dado de preço antes da validação.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    const input: ValidatePriceEstimatesInput = {
      description: currentDescription,
      priceData: priceData.map(({ id, ...rest }) => rest as PriceDataItemTypeForAI), 
    };

    try {
      const result = await validatePriceEstimates(input); 
      setValidationResult(result);

    } catch (e) {
      console.error("Validation failed:", e);
      setError("Ocorreu um erro durante a validação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Validação de Preços com IA (IN65/2021)</CardTitle>
        <CardDescription>
          Valide seus dados de preços coletados em relação aos padrões de conformidade e obtenha um custo estimado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="researchItemDescription">Descrição do Item/Serviço</Label>
          <Textarea 
            id="researchItemDescription"
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            placeholder="Descrição detalhada do item ou serviço sendo cotado"
            rows={3}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Itens de Dados de Preço</h3>
          {priceData.length === 0 && !showAddItemForm && (
            <p className="text-sm text-muted-foreground">Nenhum item de dado de preço adicionado ainda.</p>
          )}
          <ScrollArea className="max-h-[300px] pr-3">
            {priceData.map((item) => (
              <PriceDataItemForm
                key={item.id}
                initialData={{
                  ...item,
                  price: Number(item.price),
                  source_type: item.source_type ?? "", // valor padrão para garantir que nunca será undefined
                }}
                onSave={handleUpdatePriceDataItem}
                onDelete={handleDeletePriceDataItem}
                isExisting={true}
              />
            ))}
          </ScrollArea>

          {showAddItemForm && (
            <PriceDataItemForm
              onSave={handleAddPriceDataItem}
              onCancel={() => setShowAddItemForm(false)}
              isExisting={false}
            />
          )}
          {!showAddItemForm && (
            <Button variant="outline" onClick={() => setShowAddItemForm(true)} className="mt-2">
              Adicionar Item de Dado de Preço
            </Button>
          )}
        </div>

        <Button onClick={handleValidate} disabled={isLoading || priceData.length === 0}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sigma className="mr-2 h-4 w-4" />
          )}
          Validar Preços & Estimar Custo
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {validationResult && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-xl font-semibold flex items-center">
              <FileDigit className="mr-2 h-6 w-6 text-primary" />
              Resultados da Validação
            </h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custo Estimado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  R$ {validationResult.estimatedCost.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {validationResult.calculationDetails}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Problemas de Conformidade</CardTitle>
              </CardHeader>
              <CardContent>
                {validationResult.complianceIssues.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {validationResult.complianceIssues.map((issue, index) => (
                      <li key={index} className="text-sm text-destructive-foreground bg-destructive/10 p-2 rounded-md border border-destructive">
                        <AlertCircle className="inline mr-2 h-4 w-4 text-destructive" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Nenhum problema de conformidade maior detectado com base nos dados fornecidos.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Nota: A validação por IA auxilia na identificação de problemas potenciais. A responsabilidade final pela conformidade é do usuário.
        </p>
      </CardFooter>
    </Card>
  );
}