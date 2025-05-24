
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Charge } from '../types/charge';
import { formatCurrency } from '../utils/chargeUtils';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';

interface ChargeListProps {
  charges: Charge[];
  onEditCharge: (charge: Charge) => void;
  onDeleteCharge: (id: string) => void;
}

const ChargeList: React.FC<ChargeListProps> = ({ charges, onEditCharge, onDeleteCharge }) => {
  const getCategoryColor = (categorie: string) => {
    const colors = {
      'energie': 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
      'transport': 'bg-blue-500/20 text-blue-200 border-blue-500/30',
      'fournitures': 'bg-green-500/20 text-green-200 border-green-500/30',
      'services': 'bg-purple-500/20 text-purple-200 border-purple-500/30',
      'maintenance': 'bg-red-500/20 text-red-200 border-red-500/30',
      'frais-de-bouche': 'bg-orange-500/20 text-orange-200 border-orange-500/30',
      'hotel': 'bg-pink-500/20 text-pink-200 border-pink-500/30',
      'airbnb': 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
      'frais-kilometriques': 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
      'autre': 'bg-gray-500/20 text-gray-200 border-gray-500/30'
    };
    return colors[categorie as keyof typeof colors] || colors.autre;
  };

  if (charges.length === 0) {
    return (
      <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up">
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="text-white/60 text-center">
            <Tag className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <h3 className="text-base sm:text-lg font-medium mb-2">Aucune charge enregistrée</h3>
            <p className="text-sm sm:text-base">Commencez par ajouter votre première charge</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
          Liste des charges ({charges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {charges.map((charge, index) => (
            <div 
              key={charge.id} 
              className="glass-card border-white/10 p-3 sm:p-4 rounded-lg card-3d hover:shadow-lg transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white mb-1 text-sm sm:text-base break-words">{charge.description}</h3>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{charge.dateCreation.toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge className={`${getCategoryColor(charge.categorie)} border text-xs`}>
                          {charge.categorie}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                          {charge.typeCharge}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-white/60">HT:</span>
                    <div className="font-medium text-white truncate">{formatCurrency(charge.montantHT)}</div>
                  </div>
                  <div>
                    <span className="text-white/60">TVA ({charge.tauxTVA}%):</span>
                    <div className="font-medium text-white truncate">{formatCurrency(charge.montantTVA)}</div>
                  </div>
                  <div>
                    <span className="text-white/60">TTC:</span>
                    <div className="font-semibold text-white text-sm sm:text-lg truncate">{formatCurrency(charge.montantTTC)}</div>
                  </div>
                  <div className="flex gap-1 sm:gap-2 col-span-2 sm:col-span-1 sm:justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onEditCharge(charge)}
                      className="border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-transform duration-200 h-7 sm:h-8 px-2 sm:px-3 flex-1 sm:flex-none"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 sm:hidden">Modifier</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDeleteCharge(charge.id)}
                      className="border-red-500/20 text-red-300 hover:bg-red-500/10 hover:scale-105 transition-transform duration-200 h-7 sm:h-8 px-2 sm:px-3 flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 sm:hidden">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeList;
