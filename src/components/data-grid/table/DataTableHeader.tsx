
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface DataTableHeaderProps {
  title?: string;
  description?: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: (query: string) => void;
}

export function DataTableHeader({
  title,
  description,
  searchQuery,
  setSearchQuery,
  onSearch,
}: DataTableHeaderProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  if (!title) return null;

  return (
    <CardHeader className="pb-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <form onSubmit={handleSearch} className="max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 pr-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </CardHeader>
  );
}
