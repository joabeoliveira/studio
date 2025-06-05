"use client";

import { useState } from 'react';
import type { PriceDataItem, ValidatePriceEstimatesInput, ValidatePriceEstimatesOutput } from '@/ai/flows/validate-price-estimates';
import { validatePriceEstimates } from '@/ai/flows/validate-price-estimates'; // Assuming this can be called client-side or via server action
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Sigma, FileDigit } from 'lucide-react';
import { PriceDataItemForm } from './price-data-item-form'; // For managing price data items
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface AiValidationSectionProps {
  researchDescription: string;
  initialPriceData: PriceDataItem[];
  onPriceDataUpdate: (updatedData: PriceDataItem[]) => void;
}

export function AiValidationSection({ researchDescription, initialPriceData, onPriceDataUpdate }: AiValidationSectionProps) {
  const [priceData, setPriceData] = useState<PriceDataItem[]>(initialPriceData);
  const [currentDescription, setCurrentDescription] = useState(researchDescription);
  const [validationResult, setValidationResult] = useState<ValidatePriceEstimatesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  const handleAddPriceDataItem = (item: PriceDataItem) => {
    const updatedData = [...priceData, item];
    setPriceData(updatedData);
    onPriceDataUpdate(updatedData); // Notify parent
    setShowAddItemForm(false);
  };

  const handleUpdatePriceDataItem = (updatedItem: PriceDataItem) => {
    const updatedData = priceData.map(item => item.id === updatedItem.id ? updatedItem : item);
    setPriceData(updatedData);
    onPriceDataUpdate(updatedData); // Notify parent
  };

  const handleDeletePriceDataItem = (id: string) => {
    const updatedData = priceData.filter(item => item.id !== id);
    setPriceData(updatedData);
    onPriceDataUpdate(updatedData); // Notify parent
  };


  const handleValidate = async () => {
    if (priceData.length === 0) {
      setError("Please add at least one price data item before validation.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    const input: ValidatePriceEstimatesInput = {
      description: currentDescription,
      priceData: priceData.map(({ id, ...rest }) => rest), // Remove client-side ID before sending
    };

    try {
      // In a real app, this would be a server action or API call
      // For now, directly call if it's set up to work, or mock
      // const result = await validatePriceEstimates(input);
      // Mock result for UI development:
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      const mockResult: ValidatePriceEstimatesOutput = {
        complianceIssues: priceData.length < 3 ? ["Less than 3 prices collected. Justification needed if this is the final set."] : [],
        estimatedCost: priceData.reduce((sum, item) => sum + item.price, 0) / (priceData.length || 1),
        calculationDetails: `Average of ${priceData.length} prices. Median could also be calculated. Prices ranged from X to Y.`,
      };
      if (Math.random() > 0.7) { // Simulate occasional other issues
        mockResult.complianceIssues.push("Some prices seem unusually high/low compared to the average.");
      }
      setValidationResult(mockResult);

    } catch (e) {
      console.error("Validation failed:", e);
      setError("An error occurred during validation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI-Powered Price Validation (IN65/2021)</CardTitle>
        <CardDescription>
          Validate your collected price data against compliance standards and get an estimated cost.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="researchItemDescription">Item/Service Description</Label>
          <Textarea 
            id="researchItemDescription"
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            placeholder="Detailed description of the item or service being priced"
            rows={3}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Price Data Items</h3>
          {priceData.length === 0 && !showAddItemForm && (
            <p className="text-sm text-muted-foreground">No price data items added yet.</p>
          )}
          <ScrollArea className="max-h-[300px] pr-3">
          {priceData.map((item) => (
            <PriceDataItemForm
              key={item.id}
              item={item}
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
              Add Price Data Item
            </Button>
          )}
        </div>

        <Button onClick={handleValidate} disabled={isLoading || priceData.length === 0}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sigma className="mr-2 h-4 w-4" />
          )}
          Validate Prices & Estimate Cost
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {validationResult && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-xl font-semibold flex items-center">
              <FileDigit className="mr-2 h-6 w-6 text-primary" />
              Validation Results
            </h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estimated Cost</CardTitle>
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
                <CardTitle className="text-lg">Compliance Issues</CardTitle>
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
                    No major compliance issues detected based on provided data.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Note: AI validation assists in identifying potential issues. Final compliance responsibility rests with the user.
        </p>
      </CardFooter>
    </Card>
  );
}
