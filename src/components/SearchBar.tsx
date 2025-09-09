import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  coverUrl?: string;
  type: "game" | "player";
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  className?: string;
}

const SearchBar = ({ 
  placeholder = "Search games, players...", 
  onSearch,
  onSelect,
  className 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock search results for demo
  const mockSearch = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const games = [
      { id: "1", title: "Wingspan", type: "game" as const },
      { id: "2", title: "Catan", type: "game" as const },
      { id: "3", title: "Wingspan: European Expansion", type: "game" as const },
      { id: "4", title: "Azul", type: "game" as const },
    ];

    const players = [
      { id: "p1", title: "Alex (2.1km away)", type: "player" as const },
      { id: "p2", title: "Sarah (3.4km away)", type: "player" as const },
    ];

    const filtered = [
      ...games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())),
      ...players.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    ];

    return filtered.slice(0, 5);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchResults = mockSearch(query);
      setResults(searchResults);
      setIsOpen(query.length > 0 && searchResults.length > 0);
      onSearch?.(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    onSelect?.(result);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-10 bg-card border-border focus:ring-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 glass-panel animate-slide-up">
          <div className="p-2 space-y-1">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 transition-colors flex items-center gap-3"
              >
                {result.coverUrl && (
                  <img
                    src={result.coverUrl}
                    alt=""
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{result.title}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {result.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;