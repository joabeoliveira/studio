"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResearchTable } from "@/components/research/research-table";
import type { PriceResearch, PriceResearchStatus, ContractType } from "@/types";
import { PlusCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialResearchItems: PriceResearch[] = [
  { id: "PR001", description: "Acquisition of 100 Office Chairs", responsibleAgent: "Ana Silva", status: "Ongoing", creationDate: "2024-07-01", lastModifiedDate: "2024-07-15", contractType: "Goods", priceDataItems: [] },
  { id: "PR002", description: "Development of New HR Portal", responsibleAgent: "Carlos Souza", status: "Completed", creationDate: "2024-05-10", lastModifiedDate: "2024-06-20", contractType: "Services", priceDataItems: [] },
  { id: "PR003", description: "Supply of Printing Materials", responsibleAgent: "Beatriz Lima", status: "Draft", creationDate: "2024-07-20", lastModifiedDate: "2024-07-20", contractType: "Goods", priceDataItems: [] },
  { id: "PR004", description: "Security Services for Main Building", responsibleAgent: "David Costa", status: "Pending Review", creationDate: "2024-06-01", lastModifiedDate: "2024-07-10", contractType: "Services", priceDataItems: [] },
];

export default function ResearchPage() {
  const [researchItems, setResearchItems] = useState<PriceResearch[]>(initialResearchItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PriceResearchStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceResearch | null>(null);

  const [newResearchData, setNewResearchData] = useState<{description: string, responsibleAgent: string, contractType: ContractType}>({
    description: "", responsibleAgent: "", contractType: "Goods"
  });

  const handleEdit = (item: PriceResearch) => {
    setEditingItem(item);
    setNewResearchData({ description: item.description, responsibleAgent: item.responsibleAgent, contractType: item.contractType });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // Add confirmation dialog here in a real app
    setResearchItems(researchItems.filter(item => item.id !== id));
  };
  
  const handleViewReport = (id: string) => {
    // Navigate to report page or open report
    alert(`Viewing report for ${id}`);
  };

  const handleFormSubmit = () => {
    if (editingItem) {
      setResearchItems(researchItems.map(item => item.id === editingItem.id ? { ...item, ...newResearchData, lastModifiedDate: new Date().toISOString() } : item));
    } else {
      const newItem: PriceResearch = {
        id: `PR${String(researchItems.length + 1).padStart(3, '0')}`,
        ...newResearchData,
        status: "Draft",
        creationDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        priceDataItems: [],
      };
      setResearchItems([...researchItems, newItem]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
    setNewResearchData({ description: "", responsibleAgent: "", contractType: "Goods" });
  };
  
  const openNewResearchForm = () => {
    setEditingItem(null);
    setNewResearchData({ description: "", responsibleAgent: "", contractType: "Goods" });
    setIsFormOpen(true);
  }

  const filteredItems = researchItems.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || item.status === statusFilter)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Price Research</h1>
          <Button onClick={openNewResearchForm}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Research
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Manage Research Projects</CardTitle>
            <CardDescription>Create, view, and manage all price research initiatives.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search by description..." 
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: PriceResearchStatus | "all") => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> More Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredItems.length > 0 ? (
                <ResearchTable researchItems={filteredItems} onEdit={handleEdit} onDelete={handleDelete} onViewReport={handleViewReport} />
            ) : (
                <p className="text-center text-muted-foreground py-8">No research items found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Create New"} Price Research</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the details of the price research." : "Fill in the details to start a new price research."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea 
                id="description" 
                value={newResearchData.description}
                onChange={(e) => setNewResearchData({...newResearchData, description: e.target.value})}
                className="col-span-3" 
                placeholder="Detailed description of the object"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsibleAgent" className="text-right">Responsible Agent</Label>
              <Input 
                id="responsibleAgent" 
                value={newResearchData.responsibleAgent}
                onChange={(e) => setNewResearchData({...newResearchData, responsibleAgent: e.target.value})}
                className="col-span-3"
                placeholder="Name of the agent or team"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contractType" className="text-right">Contract Type</Label>
              <Select 
                value={newResearchData.contractType}
                onValueChange={(value: ContractType) => setNewResearchData({...newResearchData, contractType: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Goods">Goods</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
             {/* Add attachments field if needed */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleFormSubmit}>{editingItem ? "Save Changes" : "Create Research"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
