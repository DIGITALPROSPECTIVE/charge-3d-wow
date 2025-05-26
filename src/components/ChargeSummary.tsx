
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChargeSummary, Charge } from '../types/charge';
import { formatCurrency, exportToPDF } from '../utils/chargeUtils';
import { Download, TrendingUp, Calculator, Receipt } from 'lucide-react';

interface ChargeSummaryProps {
  summary: ChargeSummary;
  charges: Charge[];
}

const ChargeSummaryComponent: React.FC<ChargeSummaryProps> = ({ summary, charges }) => {
  const handleExportPDF = async () => {
    try {
      await exportToPDF(charges, summary);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <Card className="glass-card card-3d shadow-3d border-0 animate-float">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Nombre de charges
          </CardTitle>
          <Receipt className="h-4 w-4 text-purple-300" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{summary.nombreCharges}</div>
          <p className="text-xs text-white/60 mt-1">
            charges enregistrées
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card card-3d shadow-3d border-0 animate-float" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Total HT
          </CardTitle>
          <Calculator className="h-4 w-4 text-blue-300" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{formatCurrency(summary.totalHT)}</div>
          <p className="text-xs text-white/60 mt-1">
            hors taxes
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card card-3d shadow-3d border-0 animate-float" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Total TVA
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-300" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{formatCurrency(summary.totalTVA)}</div>
          <p className="text-xs text-white/60 mt-1">
            taxes
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card card-3d shadow-3d border-0 animate-float animate-glow" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Total TTC
          </CardTitle>
          <Download className="h-4 w-4 text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{formatCurrency(summary.totalTTC)}</div>
          <Button 
            onClick={handleExportPDF}
            size="sm" 
            className="mt-2 w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 h-10 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChargeSummaryComponent;
