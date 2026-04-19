
import React, { useState, useEffect, useMemo } from 'react';
import { Charge } from '../types/charge';
import { calculateSummary } from '../utils/chargeUtils';
import ChargeForm from './ChargeForm';
import ChargeList from './ChargeList';
import ChargeSummary from './ChargeSummary';
import SessionManager from './SessionManager';
import ChargeFilter from './ChargeFilter';
import ChargeCalendar from './ChargeCalendar';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import WebGLFogBackground from './WebGLFogBackground';
import ChargeCharts from './ChargeCharts';
import { generateId, calculateTTC } from '../utils/chargeUtils';

const DEMO_CHARGES: Charge[] = [
  { id: generateId(), description: 'Loyer bureau', montantHT: 1200, tauxTVA: 20, ...calculateTTC(1200, 20), categorie: 'Immobilier', typeCharge: 'mensuelle', dateCreation: new Date('2026-01-05') },
  { id: generateId(), description: 'Abonnement internet', montantHT: 35, tauxTVA: 20, ...calculateTTC(35, 20), categorie: 'Télécom', typeCharge: 'mensuelle', dateCreation: new Date('2026-01-10') },
  { id: generateId(), description: 'Logiciels SaaS', montantHT: 250, tauxTVA: 20, ...calculateTTC(250, 20), categorie: 'Informatique', typeCharge: 'mensuelle', dateCreation: new Date('2026-01-15') },
  { id: generateId(), description: 'Électricité', montantHT: 180, tauxTVA: 5.5, ...calculateTTC(180, 5.5), categorie: 'Énergie', typeCharge: 'mensuelle', dateCreation: new Date('2026-02-01') },
  { id: generateId(), description: 'Fournitures bureau', montantHT: 90, tauxTVA: 20, ...calculateTTC(90, 20), categorie: 'Fournitures', typeCharge: 'exceptionnelle', dateCreation: new Date('2026-02-10') },
  { id: generateId(), description: 'Assurance pro', montantHT: 320, tauxTVA: 0, ...calculateTTC(320, 0), categorie: 'Assurance', typeCharge: 'mensuelle', dateCreation: new Date('2026-02-20') },
  { id: generateId(), description: 'Formation React', montantHT: 600, tauxTVA: 20, ...calculateTTC(600, 20), categorie: 'Formation', typeCharge: 'exceptionnelle', dateCreation: new Date('2026-03-05') },
  { id: generateId(), description: 'Téléphonie mobile', montantHT: 45, tauxTVA: 20, ...calculateTTC(45, 20), categorie: 'Télécom', typeCharge: 'mensuelle', dateCreation: new Date('2026-03-10') },
  { id: generateId(), description: 'Maintenance serveur', montantHT: 150, tauxTVA: 20, ...calculateTTC(150, 20), categorie: 'Informatique', typeCharge: 'mensuelle', dateCreation: new Date('2026-03-20') },
  { id: generateId(), description: 'Déplacement client', montantHT: 210, tauxTVA: 20, ...calculateTTC(210, 20), categorie: 'Transport', typeCharge: 'exceptionnelle', dateCreation: new Date('2026-04-02') },
];

const ChargeManager: React.FC = () => {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chargeToDelete, setChargeToDelete] = useState<Charge | null>(null);
  const { toast } = useToast();

  // Charger les charges depuis le localStorage au démarrage
  useEffect(() => {
    const savedCharges = localStorage.getItem('charges');
    if (savedCharges) {
      try {
        const parsedCharges = JSON.parse(savedCharges).map((charge: any) => ({
          ...charge,
          dateCreation: new Date(charge.dateCreation),
          dateEcheance: charge.dateEcheance ? new Date(charge.dateEcheance) : undefined,
          typeCharge: charge.typeCharge || 'exceptionnelle'
        }));
        setCharges(parsedCharges.length > 0 ? parsedCharges : DEMO_CHARGES);
      } catch (error) {
        console.error('Erreur lors du chargement des charges:', error);
        setCharges(DEMO_CHARGES);
      }
    } else {
      setCharges(DEMO_CHARGES);
    }
  }, [toast]);

  // Sauvegarder les charges dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('charges', JSON.stringify(charges));
  }, [charges]);

  // Filtrer les charges selon les critères de recherche
  const filteredCharges = useMemo(() => {
    return charges.filter(charge => {
      const matchesSearch = charge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          charge.categorie.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || charge.categorie === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [charges, searchTerm, selectedCategory]);

  const handleAddCharge = (charge: Charge) => {
    if (editingCharge) {
      setCharges(charges.map(c => c.id === charge.id ? charge : c));
      setEditingCharge(null);
      toast({
        title: "Charge modifiée",
        description: "La charge a été modifiée avec succès.",
      });
    } else {
      setCharges([charge, ...charges]);
      toast({
        title: "Charge ajoutée",
        description: "La nouvelle charge a été ajoutée avec succès.",
      });
    }
  };

  const handleEditCharge = (charge: Charge) => {
    setEditingCharge(charge);
    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = (chargeId: string) => {
    const charge = charges.find(c => c.id === chargeId);
    if (charge) {
      setChargeToDelete(charge);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (chargeToDelete) {
      setCharges(charges.filter(c => c.id !== chargeToDelete.id));
      toast({
        title: "Charge supprimée",
        description: "La charge a été supprimée avec succès.",
        variant: "destructive"
      });
    }
    setDeleteDialogOpen(false);
    setChargeToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditingCharge(null);
  };

  const handleImportCharges = (importedCharges: Charge[]) => {
    setCharges(importedCharges);
    setEditingCharge(null);
    // Réinitialiser les filtres après import
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const summary = calculateSummary(charges);

  return (
    <>
    <WebGLFogBackground />
    <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* En-tête avec titre */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="h-24 flex items-center justify-center animate-slide-up">
            <GooeyText
              texts={["Application test", "Gestionnaire", "Charges TTC", "Export PDF"]}
              morphTime={1.5}
              cooldownTime={2}
              className="h-24 w-full"
              textClassName="font-bold text-white text-5xl lg:text-6xl"
            />
          </div>
          <p className="text-white/80 text-base sm:text-lg lg:text-xl animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
            Gérez vos charges avec calcul automatique TTC et export PDF
          </p>
        </div>

        {/* Résumé des charges */}
        <ChargeSummary summary={summary} charges={charges} />

        {/* Graphiques */}
        <ChargeCharts charges={charges} />

        {/* Calendrier des échéances */}
        <ChargeCalendar charges={charges} />

        {/* Gestion de session */}
        <SessionManager charges={charges} onImportCharges={handleImportCharges} />

        {/* Formulaire d'ajout/modification */}
        <ChargeForm 
          onAddCharge={handleAddCharge}
          editingCharge={editingCharge}
          onCancelEdit={handleCancelEdit}
        />

        {/* Filtres de recherche */}
        <ChargeFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onClearFilters={handleClearFilters}
          totalResults={filteredCharges.length}
        />

        {/* Liste des charges */}
        <ChargeList 
          charges={filteredCharges}
          onEditCharge={handleEditCharge}
          onDeleteCharge={handleDeleteRequest}
        />

        {/* Dialog de confirmation de suppression */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          chargeDescription={chargeToDelete?.description || ''}
        />
      </div>
    </div>
    </>
  );
};

export default ChargeManager;
