
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
      'autre': 'bg-gray-500/20 text-gray-200 border-gray-500/30'
    };
    return colors[categorie as keyof typeof colors] || colors.autre;
  };

  if (charges.length === 0) {
    return (
      <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-white/60 text-center">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucune charge enregistrée</h3>
            <p>Commencez par ajouter votre première charge</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Liste des charges ({charges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {charges.map((charge, index) => (
            <div 
              key={charge.id} 
              className="glass-card border-white/10 p-4 rounded-lg card-3d hover:shadow-lg transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{charge.description}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="w-4 h-4" />
                        {charge.dateCreation.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <Badge className={`${getCategoryColor(charge.categorie)} border`}>
                      {charge.categorie}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">HT:</span>
                      <div className="font-medium text-white">{formatCurrency(charge.montantHT)}</div>
                    </div>
                    <div>
                      <span className="text-white/60">TVA ({charge.tauxTVA}%):</span>
                      <div className="font-medium text-white">{formatCurrency(charge.montantTVA)}</div>
                    </div>
                    <div>
                      <span className="text-white/60">TTC:</span>
                      <div className="font-semibold text-white text-lg">{formatCurrency(charge.montantTTC)}</div>
                    </div>
                    <div className="flex gap-2 md:justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onEditCharge(charge)}
                        className="border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-transform duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onDeleteCharge(charge.id)}
                        className="border-red-500/20 text-red-300 hover:bg-red-500/10 hover:scale-105 transition-transform duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
