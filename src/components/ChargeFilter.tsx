
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
    <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up mb-4 sm:mb-6">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
            <span className="text-sm sm:text-base">Recherche et filtres</span>
          </div>
          <span className="text-xs sm:text-sm font-normal text-white/60 sm:ml-auto">
            {totalResults} résultat(s)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-white/80 text-xs sm:text-sm">Rechercher</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Description de la charge..."
                className="glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 pl-8 sm:pl-10 text-sm h-9 sm:h-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-white/80 text-xs sm:text-sm">Catégorie</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="glass-card border-white/20 text-white h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20 z-50">
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
          
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-white/80 text-xs sm:text-sm">Actions</label>
            <Button
              onClick={onClearFilters}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 h-9 sm:h-10 text-sm"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Effacer les filtres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeFilter;
