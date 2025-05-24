
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileJson } from 'lucide-react';
import { Charge } from '../types/charge';
import { useToast } from '@/hooks/use-toast';

interface SessionManagerProps {
  charges: Charge[];
  onImportCharges: (charges: Charge[]) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ charges, onImportCharges }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExportSession = () => {
    try {
      const sessionData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        charges: charges
      };

      const dataStr = JSON.stringify(sessionData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `charges_session_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Session exportée",
        description: "Votre session a été sauvegardée en JSON avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    }
  };

  const handleImportSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner un fichier JSON valide.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const sessionData = JSON.parse(content);

        if (!sessionData.charges || !Array.isArray(sessionData.charges)) {
          throw new Error('Format de session invalide');
        }

        // Validation et conversion des dates
        const validCharges: Charge[] = sessionData.charges.map((charge: any) => ({
          ...charge,
          dateCreation: new Date(charge.dateCreation)
        }));

        onImportCharges(validCharges);
        
        toast({
          title: "Session importée",
          description: `${validCharges.length} charges ont été restaurées avec succès.`,
        });

        // Reset du input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        toast({
          title: "Erreur d'import",
          description: "Le fichier JSON n'est pas valide ou est corrompu.",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="glass-card card-3d shadow-3d border-0 animate-float">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileJson className="h-5 w-5 text-blue-300" />
          Gestion de session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleExportSession}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            disabled={charges.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter session
          </Button>

          <Button
            onClick={triggerFileInput}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer session
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportSession}
          className="hidden"
        />

        <p className="text-xs text-white/60 text-center">
          {charges.length > 0 ? 
            `Session actuelle: ${charges.length} charge(s)` : 
            'Aucune charge dans la session actuelle'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default SessionManager;
