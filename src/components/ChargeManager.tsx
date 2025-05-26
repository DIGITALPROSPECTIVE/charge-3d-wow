import React, { useState, useEffect, useMemo } from 'react';
import { Charge } from '../types/charge';
import { calculateSummary } from '../utils/chargeUtils';
import ChargeForm from './ChargeForm';
import ChargeList from './ChargeList';
import ChargeSummary from './ChargeSummary';
import SessionManager from './SessionManager';
import ChargeFilter from './ChargeFilter';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useToast } from '@/hooks/use-toast';

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
          typeCharge: charge.typeCharge || 'exceptionnelle' // Migration pour les anciennes charges
        }));
        setCharges(parsedCharges);
      } catch (error) {
        console.error('Erreur lors du chargement des charges:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les charges sauvegardées.",
          variant: "destructive"
        });
      }
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* En-tête avec titre */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 animate-slide-up">
            Gestionnaire de 
            <span className="text-gradient block sm:inline"> Charges</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg lg:text-xl animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
            Gérez vos charges avec calcul automatique TTC et export PDF
          </p>
        </div>

        {/* Résumé des charges */}
        <ChargeSummary summary={summary} charges={charges} />

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
  );
};

export default ChargeManager;
