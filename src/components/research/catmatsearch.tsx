"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { searchCatmatByText } from "@/services/researchService";
import { ScrollArea } from "@/components/ui/scroll-area";

type CatmatItem = {
  codigo_catmat: number;
  descricao: string;
};

interface CatmatSearchProps {
  onItemSelected: (item: CatmatItem) => void;
}

export function CatmatSearch({ onItemSelected }: CatmatSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatmatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    const searchResults = await searchCatmatByText(query);
    setResults(searchResults);
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="search"
          placeholder="Digite a descrição do item (ex: parafuso aço)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Buscar</span>
        </Button>
      </div>

      <ScrollArea className="h-60 w-full rounded-md border p-2">
        {results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((item) => (
              <li 
                key={item.codigo_catmat} 
                onClick={() => onItemSelected(item)}
                className="p-2 rounded-md hover:bg-muted cursor-pointer"
              >
                <p className="font-semibold">{item.codigo_catmat}</p>
                <p className="text-sm text-muted-foreground">{item.descricao}</p>
              </li>
            ))}
          </ul>
        ) : (
          hasSearched && !isLoading && <p className="text-center text-sm text-muted-foreground p-4">Nenhum resultado encontrado.</p>
        )}
      </ScrollArea>
    </div>
  );
}