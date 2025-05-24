
import React, { useState, useEffect } from 'react';
import { Charge } from '../types/charge';
import { calculateSummary } from '../utils/chargeUtils';
import ChargeForm from './ChargeForm';
import ChargeList from './ChargeList';
import ChargeSummary from './ChargeSummary';
import SessionManager from './SessionManager';
import { useToast } from '@/hooks/use-toast';

const ChargeManager: React.FC = () => {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const { toast } = useToast();

  // Charger les charges depuis le localStorage au démarrage
  useEffect(() => {
    const savedCharges = localStorage.getItem('charges');
    if (savedCharges) {
      try {
        const parsedCharges = JSON.parse(savedCharges).map((charge: any) => ({
          ...charge,
          dateCreation: new Date(charge.dateCreation)
        }));
        setCharges(parsedCharges);
      } catch (error) {
        console.error('Erreur lors du chargement des charges:', error);
      }
    }
  }, []);

  // Sauvegarder les charges dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('charges', JSON.stringify(charges));
  }, [charges]);

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

  const handleDeleteCharge = (id: string) => {
    setCharges(charges.filter(c => c.id !== id));
    toast({
      title: "Charge supprimée",
      description: "La charge a été supprimée avec succès.",
      variant: "destructive"
    });
  };

  const handleCancelEdit = () => {
    setEditingCharge(null);
  };

  const handleImportCharges = (importedCharges: Charge[]) => {
    setCharges(importedCharges);
    setEditingCharge(null);
  };

  const summary = calculateSummary(charges);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête avec titre */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
            Gestionnaire de 
            <span className="text-gradient block md:inline"> Charges</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
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

        {/* Liste des charges */}
        <ChargeList 
          charges={charges}
          onEditCharge={handleEditCharge}
          onDeleteCharge={handleDeleteCharge}
        />
      </div>
    </div>
  );
};

export default ChargeManager;
