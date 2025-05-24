
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface ChargeFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const ChargeFilter: React.FC<ChargeFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  totalResults
}) => {
  return (
    <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-300" />
          Recherche et filtres
          <span className="text-sm font-normal text-white/60 ml-auto">
            {totalResults} résultat(s)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-white/80 text-sm">Rechercher</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Description de la charge..."
                className="glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-white/80 text-sm">Catégorie</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="glass-card border-white/20 text-white">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="energie">Énergie</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="fournitures">Fournitures</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="frais-de-bouche">Frais de bouche</SelectItem>
                <SelectItem value="hotel">Hôtel</SelectItem>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="frais-kilometriques">Frais kilométriques</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-white/80 text-sm">Actions</label>
            <Button
              onClick={onClearFilters}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer les filtres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeFilter;
