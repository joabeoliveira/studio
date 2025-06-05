"use client";

import { useState, useEffect } from "react";
import { useParams }_from 'next/navigation';
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiValidationSection } from "@/components/research/ai-validation-section";
import type { PriceResearch, PriceDataItem as PriceDataItemType } from "@/types";
import { ArrowLeft, Edit, Save, PlusCircle, Paperclip, FileText, CheckSquare, Trash2, Sigma, BarChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock data for a single research item - replace with actual data fetching
const mockResearchItems: PriceResearch[] = [
  { id: "PR001", description: "Acquisition of 100 Office Laptops Model X2024", responsibleAgent: "Ana Silva", status: "Ongoing", creationDate: "2024-07-01", lastModifiedDate: "2024-07-15", contractType: "Goods", 
    priceDataItems: [
        {id: "pdi1", source: "Painel de Preços", date: "2024-07-10", price: 3200.00, notes: "Median price for similar config"},
        {id: "pdi2", source: "Supplier A Quote", date: "2024-07-12", price: 3150.00, notes: "Bulk discount applied"},
    ]
  },
   { id: "PR003", description: "Supply of Printing Materials (A4 Paper, Toner)", responsibleAgent: "Beatriz Lima", status: "Draft", creationDate: "2024-07-20", lastModifiedDate: "2024-07-20", contractType: "Goods", priceDataItems: [] },
];


export default function IndividualResearchPage() {
  const params = useParams();
  const researchId = params.id as string;
  const [researchItem, setResearchItem] = useState<PriceResearch | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // States for Art. 6º - Analysis and Calculation
  const [selectedPricesForCalc, setSelectedPricesForCalc] = useState<string[]>([]);
  const [calculationMethod, setCalculationMethod] = useState<'average' | 'median' | 'lowest'>('median');
  const [adjustmentPercentage, setAdjustmentPercentage] = useState<number>(0);
  const [justifications, setJustifications] = useState({
    method: '',
    desconsideration: '',
    adjustment: '',
    lessThanThree: '',
  });
  const [calculatedEstimatedPrice, setCalculatedEstimatedPrice] = useState<number | null>(null);


  useEffect(() => {
    if (researchId) {
      const item = mockResearchItems.find(r => r.id === researchId);
      setResearchItem(item || null);
      if (item) {
        // Initialize selectedPricesForCalc with all item IDs
        setSelectedPricesForCalc(item.priceDataItems.map(pdi => pdi.id));
      }
    }
  }, [researchId]);

  const handlePriceDataUpdate = (updatedData: PriceDataItemType[]) => {
    if (researchItem) {
      setResearchItem({ ...researchItem, priceDataItems: updatedData });
      // Autosave or prompt for save here in a real app
    }
  };
  
  const handleTogglePriceSelection = (priceId: string) => {
    setSelectedPricesForCalc(prev => 
      prev.includes(priceId) ? prev.filter(id => id !== priceId) : [...prev, priceId]
    );
  };

  const calculateEstimate = () => {
    if (!researchItem || researchItem.priceDataItems.length === 0) {
      setCalculatedEstimatedPrice(null);
      return;
    }
    const pricesToConsider = researchItem.priceDataItems
      .filter(pdi => selectedPricesForCalc.includes(pdi.id))
      .map(pdi => pdi.price);

    if (pricesToConsider.length === 0) {
      setCalculatedEstimatedPrice(null);
      return;
    }
    
    let basePrice = 0;
    switch (calculationMethod) {
      case 'average':
        basePrice = pricesToConsider.reduce((sum, p) => sum + p, 0) / pricesToConsider.length;
        break;
      case 'median':
        const sortedPrices = [...pricesToConsider].sort((a, b) => a - b);
        const mid = Math.floor(sortedPrices.length / 2);
        basePrice = sortedPrices.length % 2 !== 0 ? sortedPrices[mid] : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
        break;
      case 'lowest':
        basePrice = Math.min(...pricesToConsider);
        break;
    }
    const finalPrice = basePrice * (1 + adjustmentPercentage / 100);
    setCalculatedEstimatedPrice(finalPrice);
  };

  useEffect(calculateEstimate, [selectedPricesForCalc, calculationMethod, adjustmentPercentage, researchItem]);


  if (!researchItem) {
    return <AppLayout><div className="flex justify-center items-center h-full"><p>Loading research data or research not found...</p></div></AppLayout>;
  }

  const handleSaveDetails = () => {
    // API call to save researchItem details
    setIsEditing(false);
    alert("Details saved (mock)!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/research" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Research List
          </Link>
          {isEditing ? (
            <Button onClick={handleSaveDetails}><Save className="mr-2 h-4 w-4" /> Save Details</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit Details</Button>
          )}
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            {isEditing ? (
              <Textarea 
                value={researchItem.description} 
                onChange={(e) => setResearchItem({...researchItem, description: e.target.value})}
                className="text-2xl font-bold font-headline p-2 border rounded-md" 
              />
            ) : (
              <CardTitle className="text-3xl font-bold font-headline">{researchItem.description}</CardTitle>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <span><strong>ID:</strong> {researchItem.id}</span>
              <span><strong>Status:</strong> {researchItem.status}</span>
              <span><strong>Type:</strong> {researchItem.contractType}</span>
              <span><strong>Agent:</strong> 
                {isEditing ? 
                  <Input value={researchItem.responsibleAgent} onChange={(e) => setResearchItem({...researchItem, responsibleAgent: e.target.value})} className="inline-w-auto h-8"/> 
                  : researchItem.responsibleAgent
                }
              </span>
              <span><strong>Created:</strong> {new Date(researchItem.creationDate).toLocaleDateString()}</span>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="aiValidation" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="aiValidation">AI Validation & Data</TabsTrigger>
            <TabsTrigger value="analysis">Price Analysis (Art. 6)</TabsTrigger>
            <TabsTrigger value="sources">Data Sources (Art. 5)</TabsTrigger>
            <TabsTrigger value="report">Report Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="aiValidation" className="mt-4">
             <AiValidationSection 
                researchDescription={researchItem.description}
                initialPriceData={researchItem.priceDataItems}
                onPriceDataUpdate={handlePriceDataUpdate}
             />
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Price Analysis & Estimation (Art. 6º IN 65/2021)</CardTitle>
                <CardDescription>Apply statistical methods and justifications for the estimated price.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Collected Prices</h3>
                  {researchItem.priceDataItems.length === 0 ? (
                     <p className="text-muted-foreground">No price data items collected yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {researchItem.priceDataItems.map(pdi => (
                        <div key={pdi.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <span className="font-medium">{pdi.source}: R$ {pdi.price.toFixed(2)}</span>
                            <p className="text-xs text-muted-foreground">{pdi.notes || 'No notes'}</p>
                          </div>
                          <Button 
                            variant={selectedPricesForCalc.includes(pdi.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTogglePriceSelection(pdi.id)}
                          >
                            {selectedPricesForCalc.includes(pdi.id) ? <CheckSquare className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            {selectedPricesForCalc.includes(pdi.id) ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calculationMethod">Calculation Method</Label>
                    <Select value={calculationMethod} onValueChange={(val: 'average' | 'median' | 'lowest') => setCalculationMethod(val)}>
                      <SelectTrigger id="calculationMethod">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="median">Median</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="lowest">Lowest Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="adjustmentPercentage">Adjustment (%)</Label>
                    <Input 
                      id="adjustmentPercentage" 
                      type="number" 
                      value={adjustmentPercentage}
                      onChange={(e) => setAdjustmentPercentage(parseFloat(e.target.value))}
                      placeholder="e.g., 5 for 5% increase" 
                    />
                  </div>
                </div>

                {calculatedEstimatedPrice !== null && (
                  <Alert variant="default" className="bg-primary/10 border-primary text-primary-foreground">
                    <Sigma className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-bold text-primary">Calculated Estimated Price</AlertTitle>
                    <AlertDescription className="text-2xl font-bold text-primary">
                      R$ {calculatedEstimatedPrice.toFixed(2)}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="justifyMethod">Justify Method/Criteria (Art. 6º, §1º, II)</Label>
                    <Textarea id="justifyMethod" placeholder="Explain the choice of calculation method..." value={justifications.method} onChange={e => setJustifications({...justifications, method: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="justifyDesconsideration">Justify Desconsideration of Prices (Art. 6º, §1º, III)</Label>
                    <Textarea id="justifyDesconsideration" placeholder="Explain any prices not used in calculation..." value={justifications.desconsideration} onChange={e => setJustifications({...justifications, desconsideration: e.target.value})} />
                  </div>
                   <div>
                    <Label htmlFor="justifyLessThanThree">Justify if less than 3 prices (Art. 6º, §3º)</Label>
                    <Textarea id="justifyLessThanThree" placeholder="Explain if estimation is based on less than three prices..." value={justifications.lessThanThree} onChange={e => setJustifications({...justifications, lessThanThree: e.target.value})} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button onClick={calculateEstimate}>
                    <BarChart className="mr-2 h-4 w-4" /> Recalculate Estimate
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Data Collection Sources (Art. 5º IN 65/2021)</CardTitle>
                <CardDescription>Manage and document prices from various official parameters.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    { title: "I - Official Systems (Painel de Preços, etc.)", content: "Interface for searching/linking official system data.", hint: "official data" },
                    { title: "II - Similar Public Contracts", content: "Module to upload/link similar contract data.", hint: "contracts document" },
                    { title: "III - Specialized Media/Sites", content: "Form to input prices from media, tables, e-commerce.", hint: "website research" },
                    { title: "IV - Direct Supplier Quotes", content: "Manage supplier quote requests and responses.", hint: "supplier meeting" },
                    { title: "V - National NFe Database", content: "Interface for NFe data (if available).", hint: "invoice database" },
                  ].map((item, index) => (
                    <AccordionItem value={`item-${index+1}`} key={index}>
                      <AccordionTrigger>{item.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 border rounded-md bg-muted/20">
                           <Image 
                            src={`https://placehold.co/400x200.png`}
                            alt={`${item.title} Placeholder`}
                            width={400}
                            height={200}
                            className="rounded-md object-cover mb-4 w-full h-auto max-w-sm mx-auto"
                            data-ai-hint={item.hint}
                          />
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                          <Button variant="secondary" className="mt-2">Access Module</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Report Generation</CardTitle>
                <CardDescription>Generate the formal price research report compliant with IN 65/2021.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
                <p className="mb-4 text-muted-foreground">All data collected and analyses performed will be compiled into the official report.</p>
                <Button size="lg">
                  <FileText className="mr-2 h-4 w-4" /> Generate Report (PDF/DOCX)
                </Button>
              </CardContent>
               <CardFooter className="text-xs text-muted-foreground">
                Ensure all sections are complete and justifications are provided before generating the final report.
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// Minimal Accordion components if not available globally, or import from shadcn
const Accordion = ({ children, ...props }: React.ComponentProps<'div'> & {type?: string, collapsible?: boolean}) => <div {...props}>{children}</div>;
const AccordionItem = ({ children, ...props }: React.ComponentProps<'div'> & {value: string}) => <div {...props} className="border-b">{children}</div>;
const AccordionTrigger = ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props} className="flex w-full items-center justify-between py-4 font-medium hover:underline">{children}<span>{/* Icon */}</span></button>;
const AccordionContent = ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props} className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"><div className="pb-4 pt-0">{children}</div></div>;

