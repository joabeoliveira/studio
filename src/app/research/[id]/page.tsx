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
import type { PriceResearch, PriceDataItem as PriceDataItemType, ContractType, PriceResearchStatus } from "@/types";
import { ArrowLeft, Edit, Save, PlusCircle, Paperclip, FileText, CheckSquare, Trash2, Sigma, BarChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const mockResearchItems: PriceResearch[] = [
  { 
    id: "PR001", 
    description: "Aquisição de 100 Laptops de Escritório Modelo X2024", 
    responsibleAgent: "Ana Silva", 
    status: "Em Andamento" as PriceResearchStatus, 
    creationDate: "2024-07-01", 
    lastModifiedDate: "2024-07-15", 
    contractType: "Bens" as ContractType, 
    priceDataItems: [
        {id: "pdi1", source: "Painel de Preços", date: "2024-07-10", price: 3200.00, notes: "Preço mediano para configuração similar"},
        {id: "pdi2", source: "Cotação Fornecedor A", date: "2024-07-12", price: 3150.00, notes: "Desconto por volume aplicado"},
    ]
  },
   { 
    id: "PR003", 
    description: "Fornecimento de Materiais de Impressão (Papel A4, Toner)", 
    responsibleAgent: "Beatriz Lima", 
    status: "Rascunho" as PriceResearchStatus, 
    creationDate: "2024-07-20", 
    lastModifiedDate: "2024-07-20", 
    contractType: "Bens" as ContractType, 
    priceDataItems: [] 
  },
];


export default function IndividualResearchPage() {
  const params = useParams();
  const researchId = params.id as string;
  const [researchItem, setResearchItem] = useState<PriceResearch | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
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
        setSelectedPricesForCalc(item.priceDataItems.map(pdi => pdi.id));
      }
    }
  }, [researchId]);

  const handlePriceDataUpdate = (updatedData: PriceDataItemType[]) => {
    if (researchItem) {
      setResearchItem({ ...researchItem, priceDataItems: updatedData });
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
    return <AppLayout><div className="flex justify-center items-center h-full"><p>Carregando dados da pesquisa ou pesquisa não encontrada...</p></div></AppLayout>;
  }

  const handleSaveDetails = () => {
    setIsEditing(false);
    alert("Detalhes salvos (simulado)!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/research" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Pesquisas
          </Link>
          {isEditing ? (
            <Button onClick={handleSaveDetails}><Save className="mr-2 h-4 w-4" /> Salvar Detalhes</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Editar Detalhes</Button>
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
              <span><strong>Tipo:</strong> {researchItem.contractType}</span>
              <span><strong>Responsável:</strong> 
                {isEditing ? 
                  <Input value={researchItem.responsibleAgent} onChange={(e) => setResearchItem({...researchItem, responsibleAgent: e.target.value})} className="inline-w-auto h-8"/> 
                  : researchItem.responsibleAgent
                }
              </span>
              <span><strong>Criado:</strong> {new Date(researchItem.creationDate).toLocaleDateString()}</span>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="aiValidation" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="aiValidation">Validação IA & Dados</TabsTrigger>
            <TabsTrigger value="analysis">Análise de Preços (Art. 6º)</TabsTrigger>
            <TabsTrigger value="sources">Fontes de Dados (Art. 5º)</TabsTrigger>
            <TabsTrigger value="report">Geração de Relatório</TabsTrigger>
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
                <CardTitle>Análise e Estimativa de Preços (Art. 6º IN 65/2021)</CardTitle>
                <CardDescription>Aplicar métodos estatísticos e justificativas para o preço estimado.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Preços Coletados</h3>
                  {researchItem.priceDataItems.length === 0 ? (
                     <p className="text-muted-foreground">Nenhum item de dado de preço coletado ainda.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {researchItem.priceDataItems.map(pdi => (
                        <div key={pdi.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <span className="font-medium">{pdi.source}: R$ {pdi.price.toFixed(2)}</span>
                            <p className="text-xs text-muted-foreground">{pdi.notes || 'Sem notas'}</p>
                          </div>
                          <Button 
                            variant={selectedPricesForCalc.includes(pdi.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTogglePriceSelection(pdi.id)}
                          >
                            {selectedPricesForCalc.includes(pdi.id) ? <CheckSquare className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            {selectedPricesForCalc.includes(pdi.id) ? 'Selecionado' : 'Selecionar'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calculationMethod">Método de Cálculo</Label>
                    <Select value={calculationMethod} onValueChange={(val: 'average' | 'median' | 'lowest') => setCalculationMethod(val)}>
                      <SelectTrigger id="calculationMethod">
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="median">Mediana</SelectItem>
                        <SelectItem value="average">Média</SelectItem>
                        <SelectItem value="lowest">Menor Valor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="adjustmentPercentage">Ajuste (%)</Label>
                    <Input 
                      id="adjustmentPercentage" 
                      type="number" 
                      value={adjustmentPercentage}
                      onChange={(e) => setAdjustmentPercentage(parseFloat(e.target.value))}
                      placeholder="ex: 5 para 5% de aumento" 
                    />
                  </div>
                </div>

                {calculatedEstimatedPrice !== null && (
                  <Alert variant="default" className="bg-primary/10 border-primary">
                    <Sigma className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-bold text-primary">Preço Estimado Calculado</AlertTitle>
                    <AlertDescription className="text-2xl font-bold text-primary">
                      R$ {calculatedEstimatedPrice.toFixed(2)}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="justifyMethod">Justificar Método/Critérios (Art. 6º, §1º, II)</Label>
                    <Textarea id="justifyMethod" placeholder="Explique a escolha do método de cálculo..." value={justifications.method} onChange={e => setJustifications({...justifications, method: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="justifyDesconsideration">Justificar Desconsideração de Preços (Art. 6º, §1º, III)</Label>
                    <Textarea id="justifyDesconsideration" placeholder="Explique quaisquer preços não utilizados no cálculo..." value={justifications.desconsideration} onChange={e => setJustifications({...justifications, desconsideration: e.target.value})} />
                  </div>
                   <div>
                    <Label htmlFor="justifyLessThanThree">Justificar se menos de 3 preços (Art. 6º, §3º)</Label>
                    <Textarea id="justifyLessThanThree" placeholder="Explique se a estimativa é baseada em menos de três preços..." value={justifications.lessThanThree} onChange={e => setJustifications({...justifications, lessThanThree: e.target.value})} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button onClick={calculateEstimate}>
                    <BarChart className="mr-2 h-4 w-4" /> Recalcular Estimativa
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Fontes de Coleta de Dados (Art. 5º IN 65/2021)</CardTitle>
                <CardDescription>Gerenciar e documentar preços de diversos parâmetros oficiais.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    { title: "I - Sistemas Oficiais (Painel de Preços, etc.)", content: "Interface para buscar/vincular dados de sistemas oficiais.", hint: "official data" },
                    { title: "II - Contratos Públicos Similares", content: "Módulo para carregar/vincular dados de contratos similares.", hint: "contracts document" },
                    { title: "III - Mídia Especializada/Sites", content: "Formulário para inserir preços de mídias, tabelas, e-commerce.", hint: "website research" },
                    { title: "IV - Cotações Diretas com Fornecedores", content: "Gerenciar solicitações e respostas de cotações de fornecedores.", hint: "supplier meeting" },
                    { title: "V - Banco de Dados Nacional de NF-e", content: "Interface para dados de NF-e (se disponível).", hint: "invoice database" },
                  ].map((item, index) => (
                    <AccordionItem value={`item-${index+1}`} key={index}>
                      <AccordionTrigger>{item.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 border rounded-md bg-muted/20">
                           <Image 
                            src={`https://placehold.co/400x200.png`}
                            alt={`Placeholder ${item.title}`}
                            width={400}
                            height={200}
                            className="rounded-md object-cover mb-4 w-full h-auto max-w-sm mx-auto"
                            data-ai-hint={item.hint}
                          />
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                          <Button variant="secondary" className="mt-2">Acessar Módulo</Button>
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
                <CardTitle>Geração de Relatório</CardTitle>
                <CardDescription>Gerar o relatório formal de pesquisa de preços em conformidade com a IN 65/2021.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
                <p className="mb-4 text-muted-foreground">Todos os dados coletados e análises realizadas serão compilados no relatório oficial.</p>
                <Button size="lg">
                  <FileText className="mr-2 h-4 w-4" /> Gerar Relatório (PDF/DOCX)
                </Button>
              </CardContent>
               <CardFooter className="text-xs text-muted-foreground">
                Certifique-se de que todas as seções estão completas e as justificativas fornecidas antes de gerar o relatório final.
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
