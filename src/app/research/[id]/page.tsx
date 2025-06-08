"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AiValidationSection } from "@/components/research/ai-validation-section";
import type { PriceResearch, PriceDataItem as PriceDataItemType } from "@/types";
import { ArrowLeft, Edit, Save, PlusCircle, CheckSquare, Sigma, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { addReport } from "@/services/reportService";
import { 
    getResearchItemById,
    updateResearchDetails, 
} from "@/services/researchService";

const sourceTypes = [
    "I - Painel de Preços ou sistemas similares",
    "II - Contratações similares de outros órgãos",
    "III - Mídia especializada ou sites de e-commerce",
    "IV - Pesquisa direta com fornecedores",
    "V - Pesquisa na base de notas fiscais eletrônicas",
];

export default function IndividualResearchPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const researchId = params.id as string;
  const { toast } = useToast();
  
  const [researchItem, setResearchItem] = useState<PriceResearch | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para a aba de Análise
  const [selectedPricesForCalc, setSelectedPricesForCalc] = useState<string[]>([]);
  const [calculationMethod, setCalculationMethod] = useState<'average' | 'median' | 'lowest'>('median');
  const [justifications, setJustifications] = useState({ method: '', desconsideration: '', adjustment: '', lessThanThree: '' });
  const [calculatedEstimatedPrice, setCalculatedEstimatedPrice] = useState<number | null>(null);

  const fetchResearchItem = useCallback(async () => {
    if (!researchId) return;
    setIsLoading(true);
    const item = await getResearchItemById(researchId);
    setResearchItem(item);
    if (item) {
      // Pré-popula os estados da análise com os dados salvos no banco
      setSelectedPricesForCalc(item.priceDataItems.map(pdi => pdi.id));
      setCalculationMethod(item.calculationMethod || 'median');
      setJustifications(item.justifications || { method: '', desconsideration: '', adjustment: '', lessThanThree: '' });
    }
    setIsLoading(false);
  }, [researchId]);

  useEffect(() => {
    fetchResearchItem();
  }, [fetchResearchItem]);
  
  // Efeito para recalcular o preço estimado sempre que os inputs mudarem
  useEffect(() => {
    if (!researchItem) return;
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
    setCalculatedEstimatedPrice(basePrice);
  }, [selectedPricesForCalc, calculationMethod, researchItem]);

  const handleTogglePriceSelection = (priceId: string) => {
    setSelectedPricesForCalc(prev => 
      prev.includes(priceId) ? prev.filter(id => id !== priceId) : [...prev, priceId]
    );
  };
  
  const handleSaveAnalysis = async () => {
    if (!researchItem) return;
    try {
      await updateResearchDetails(researchId, {
        estimatedPrice: calculatedEstimatedPrice ?? undefined,
        calculationMethod: calculationMethod,
        justifications: justifications,
      });
      toast({ title: "Análise Salva!", description: "Os dados da análise foram salvos corretamente." });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível salvar a análise.", variant: "destructive" });
    }
  };

  const handleSaveDetails = async () => {
    if (!researchItem) return;
    setIsEditing(false);
    await updateResearchDetails(researchId, { description: researchItem.description, responsibleAgent: researchItem.responsibleAgent });
    toast({ title: "Detalhes Salvos!" });
  };
  
  const handlePriceDataUpdate = async (updatedData: PriceDataItemType[]) => {
      await fetchResearchItem();
  };

  const handleGenerateReport = async () => {
    if (!researchItem || !userProfile) return;
    try {
      const newReportId = await addReport({
        research_id: Number(researchItem.id),
        research_description: researchItem.description,
        generated_by_id: userProfile.id,
        generated_by_name: userProfile.name || userProfile.email || 'Usuário',
      });
      toast({ title: "Relatório Gerado!", description: "Você será redirecionado para a página do relatório." });
      router.push(`/reports/${newReportId}`);
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível gerar o relatório.", variant: "destructive" });
    }
  };
  
  const handleDetailsChange = (field: keyof PriceResearch, value: string) => {
    if (researchItem) {
        setResearchItem({ ...researchItem, [field]: value });
    }
  };

  if (isLoading) return <AppLayout><div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div></AppLayout>;
  if (!researchItem) return <AppLayout><div>Pesquisa não encontrada.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Link href="/research" className="flex items-center text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista</Link>
            {isEditing ? <Button onClick={handleSaveDetails}><Save className="mr-2 h-4 w-4" /> Salvar</Button> : <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Editar</Button>}
        </div>
        <Card>
            <CardHeader>
                {isEditing ? (
                    <Textarea 
                        value={researchItem.description} 
                        onChange={(e) => handleDetailsChange('description', e.target.value)}
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
                        <Input value={researchItem.responsibleAgent} onChange={(e) => handleDetailsChange('responsibleAgent', e.target.value)} className="inline-w-auto h-8"/> 
                        : researchItem.responsibleAgent
                        }
                    </span>
                    <span><strong>Criado:</strong> {new Date(researchItem.creationDate).toLocaleDateString()}</span>
                </div>
            </CardHeader>
        </Card>

        <Tabs defaultValue="aiValidation" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="aiValidation">Validação IA & Dados</TabsTrigger>
            <TabsTrigger value="analysis">Análise de Preços (Art. 6º)</TabsTrigger>
            <TabsTrigger value="sources">Fontes de Dados (Art. 5º)</TabsTrigger>
            <TabsTrigger value="report">Geração de Relatório</TabsTrigger>
          </TabsList>

          <TabsContent value="aiValidation" className="mt-4">
             <AiValidationSection researchDescription={researchItem.description} initialPriceData={researchItem.priceDataItems} onPriceDataUpdate={handlePriceDataUpdate} />
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Análise e Estimativa de Preços (Art. 6º IN 65/2021)</CardTitle>
                <CardDescription>Aplique métodos estatísticos e justificativas para o preço estimado.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Selecione os Preços para Análise</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                    {researchItem.priceDataItems.map(pdi => (
                      <div key={pdi.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <div>
                          <span className="font-medium">{pdi.source}: R$ {pdi.price.toFixed(2)}</span>
                          <p className="text-xs text-muted-foreground">{pdi.notes || 'Sem notas'}</p>
                        </div>
                        <Button variant={selectedPricesForCalc.includes(pdi.id) ? "default" : "outline"} size="sm" onClick={() => handleTogglePriceSelection(pdi.id)}>
                          {selectedPricesForCalc.includes(pdi.id) ? <CheckSquare className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                          {selectedPricesForCalc.includes(pdi.id) ? 'Incluído' : 'Incluir'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Escolha o Método de Cálculo</h3>
                  <Select value={calculationMethod} onValueChange={(val: 'average' | 'median' | 'lowest') => setCalculationMethod(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="median">Mediana (Recomendado)</SelectItem>
                      <SelectItem value="average">Média Aritmética</SelectItem>
                      <SelectItem value="lowest">Menor Valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {calculatedEstimatedPrice !== null && (
                  <Alert variant="default" className="bg-primary/10 border-primary">
                    <Sigma className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-bold text-primary">Preço Estimado Calculado</AlertTitle>
                    <AlertDescription className="text-2xl font-bold text-primary">R$ {calculatedEstimatedPrice.toFixed(2)}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Adicione as Justificativas</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="justifyMethod">Justificar Método/Critérios (Art. 6º, §1º, II)</Label>
                      <Textarea id="justifyMethod" placeholder="Explique a escolha do método de cálculo..." value={justifications.method} onChange={e => setJustifications({...justifications, method: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="justifyDesconsideration">Justificar Descarte de Preços (Art. 6º, §1º, III)</Label>
                      <Textarea id="justifyDesconsideration" placeholder="Explique por que alguns preços não foram usados (se aplicável)..." value={justifications.desconsideration} onChange={e => setJustifications({...justifications, desconsideration: e.target.value})} />
                    </div>
                     <div>
                      <Label htmlFor="justifyLessThanThree">Justificar se menos de 3 preços (Art. 6º, §3º)</Label>
                      <Textarea id="justifyLessThanThree" placeholder="Se a estimativa se baseia em menos de três preços, justifique aqui..." value={justifications.lessThanThree} onChange={e => setJustifications({...justifications, lessThanThree: e.target.value})} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button onClick={handleSaveAnalysis}><Save className="mr-2 h-4 w-4" /> Salvar Análise</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="sources" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Fontes de Coleta de Dados (Art. 5º IN 65/2021)</CardTitle>
                <CardDescription>Resumo dos preços coletados, agrupados por parâmetro legal.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {sourceTypes.map((type, index) => {
                    const itemsForType = researchItem.priceDataItems.filter(item => item.source_type === type);
                    return (
                      <AccordionItem value={`item-${index + 1}`} key={type}>
                        <AccordionTrigger>
                          <div className="flex justify-between w-full pr-4">
                            <span>{type}</span>
                            <Badge variant={itemsForType.length > 0 ? "default" : "secondary"}>
                              {itemsForType.length} {itemsForType.length === 1 ? 'item' : 'itens'}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {itemsForType.length > 0 ? (
                            <ul className="space-y-2 pl-4 pt-2">
                              {itemsForType.map(item => (
                                <li key={item.id} className="text-sm border-l-2 pl-3 border-primary">
                                  <p><strong>Fonte Específica:</strong> {item.source}</p>
                                  <p><strong>Preço:</strong> R$ {item.price.toFixed(2)}</p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground pl-4 pt-2">Nenhum item de preço adicionado para este parâmetro.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Geração de Relatório Final</CardTitle>
                <CardDescription>Compile todos os dados desta pesquisa em um relatório oficial.</CardDescription>
              </CardHeader>
              <CardContent className="text-center p-8">
                <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
                <Button size="lg" onClick={handleGenerateReport}><FileText className="mr-2 h-4 w-4" /> Gerar e Arquivar Relatório</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}