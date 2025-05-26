
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Charge } from '../types/charge';
import { formatCurrency } from '../utils/chargeUtils';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChargeCalendarProps {
  charges: Charge[];
}

const ChargeCalendar: React.FC<ChargeCalendarProps> = ({ charges }) => {
  const chargesWithDueDate = useMemo(() => {
    return charges
      .filter(charge => charge.dateEcheance)
      .sort((a, b) => {
        if (!a.dateEcheance || !b.dateEcheance) return 0;
        return a.dateEcheance.getTime() - b.dateEcheance.getTime();
      });
  }, [charges]);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Aujourd\'hui';
    if (isTomorrow(date)) return 'Demain';
    if (isThisWeek(date)) return format(date, 'EEEE', { locale: fr });
    return format(date, 'dd/MM/yyyy', { locale: fr });
  };

  const getUrgencyColor = (date: Date) => {
    const today = new Date();
    const daysDiff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'bg-red-500/20 text-red-200 border-red-500/30';
    if (daysDiff <= 3) return 'bg-orange-500/20 text-orange-200 border-orange-500/30';
    if (daysDiff <= 7) return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
    return 'bg-green-500/20 text-green-200 border-green-500/30';
  };

  if (chargesWithDueDate.length === 0) {
    return (
      <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendrier des échéances
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-white/60 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucune échéance programmée</h3>
            <p>Ajoutez des dates d'échéance à vos charges pour les voir ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Calendrier des échéances ({chargesWithDueDate.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chargesWithDueDate.map((charge) => {
            const dateEcheance = charge.dateEcheance!;
            const isOverdue = dateEcheance < new Date();
            
            return (
              <div 
                key={charge.id} 
                className="glass-card border-white/10 p-4 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{charge.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Clock className="w-4 h-4" />
                          {getDateLabel(dateEcheance)}
                          {isOverdue && (
                            <div className="flex items-center gap-1 text-red-400">
                              <AlertTriangle className="w-4 h-4" />
                              En retard
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getUrgencyColor(dateEcheance)} border text-xs`}>
                        {charge.categorie}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-white">
                        {formatCurrency(charge.montantTTC)}
                      </div>
                      <div className="text-sm text-white/60">
                        {charge.typeCharge === 'mensuelle' ? 'Mensuelle' : 'Exceptionnelle'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeCalendar;
