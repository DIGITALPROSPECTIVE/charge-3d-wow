
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Charge } from '../types/charge';
import { calculateTTC, generateId } from '../utils/chargeUtils';
import { Plus, Edit, Calculator, AlertCircle } from 'lucide-react';

interface ChargeFormProps {
  onAddCharge: (charge: Charge) => void;
  editingCharge?: Charge | null;
  onCancelEdit: () => void;
}

interface FormErrors {
  description?: string;
  montantHT?: string;
  categorie?: string;
}

const ChargeForm: React.FC<ChargeFormProps> = ({ onAddCharge, editingCharge, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [montantHT, setMontantHT] = useState('');
  const [tauxTVA, setTauxTVA] = useState('20');
  const [categorie, setCategorie] = useState('');
  const [montantTTC, setMontantTTC] = useState(0);
  const [montantTVA, setMontantTVA] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingCharge) {
      setDescription(editingCharge.description);
      setMontantHT(editingCharge.montantHT.toString());
      setTauxTVA(editingCharge.tauxTVA.toString());
      setCategorie(editingCharge.categorie);
      setMontantTTC(editingCharge.montantTTC);
      setMontantTVA(editingCharge.montantTVA);
    }
  }, [editingCharge]);

  useEffect(() => {
    const ht = parseFloat(montantHT) || 0;
    const tva = parseFloat(tauxTVA) || 0;
    const { montantTTC: ttc, montantTVA: tvaAmount } = calculateTTC(ht, tva);
    setMontantTTC(ttc);
    setMontantTVA(tvaAmount);
  }, [montantHT, tauxTVA]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (description.trim().length < 3) {
      newErrors.description = 'La description doit contenir au moins 3 caractères';
    }

    if (!montantHT) {
      newErrors.montantHT = 'Le montant HT est obligatoire';
    } else if (parseFloat(montantHT) <= 0) {
      newErrors.montantHT = 'Le montant HT doit être supérieur à 0';
    } else if (parseFloat(montantHT) > 999999) {
      newErrors.montantHT = 'Le montant HT ne peut pas dépasser 999 999 €';
    }

    if (!categorie) {
      newErrors.categorie = 'La catégorie est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const charge: Charge = {
      id: editingCharge ? editingCharge.id : generateId(),
      description: description.trim(),
      montantHT: parseFloat(montantHT),
      tauxTVA: parseFloat(tauxTVA),
      montantTTC,
      montantTVA,
      categorie,
      dateCreation: editingCharge ? editingCharge.dateCreation : new Date()
    };

    onAddCharge(charge);
    
    if (!editingCharge) {
      // Réinitialiser le formulaire uniquement lors d'un ajout
      setDescription('');
      setMontantHT('');
      setTauxTVA('20');
      setCategorie('');
      setErrors({});
    }
  };

  const handleCancel = () => {
    setDescription('');
    setMontantHT('');
    setTauxTVA('20');
    setCategorie('');
    setErrors({});
    onCancelEdit();
  };

  return (
    <Card className="glass-card card-3d shadow-3d border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {editingCharge ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {editingCharge ? 'Modifier la charge' : 'Ajouter une nouvelle charge'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/80">Description *</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors({ ...errors, description: undefined });
                  }
                }}
                placeholder="Ex: Facture électricité"
                className={`glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categorie" className="text-white/80">Catégorie *</Label>
              <Select 
                value={categorie} 
                onValueChange={(value) => {
                  setCategorie(value);
                  if (errors.categorie) {
                    setErrors({ ...errors, categorie: undefined });
                  }
                }}
              >
                <SelectTrigger className={`glass-card border-white/20 text-white ${
                  errors.categorie ? 'border-red-500' : ''
                }`}>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="energie">Énergie</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="fournitures">Fournitures</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.categorie && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.categorie}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montantHT" className="text-white/80">Montant HT (€) *</Label>
              <Input
                id="montantHT"
                type="number"
                value={montantHT}
                onChange={(e) => {
                  setMontantHT(e.target.value);
                  if (errors.montantHT) {
                    setErrors({ ...errors, montantHT: undefined });
                  }
                }}
                placeholder="0.00"
                step="0.01"
                min="0"
                max="999999"
                className={`glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 ${
                  errors.montantHT ? 'border-red-500' : ''
                }`}
              />
              {errors.montantHT && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.montantHT}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tauxTVA" className="text-white/80">Taux TVA (%)</Label>
              <Select value={tauxTVA} onValueChange={setTauxTVA}>
                <SelectTrigger className="glass-card border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5.5">5.5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Montant TTC (€)
              </Label>
              <div className="glass-card border-white/20 p-3 rounded-md">
                <span className="text-white font-semibold text-lg">
                  {montantTTC.toFixed(2)} €
                </span>
                <div className="text-white/60 text-xs mt-1">
                  TVA: {montantTVA.toFixed(2)} €
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {editingCharge ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {editingCharge ? 'Modifier' : 'Ajouter'}
            </Button>
            
            {editingCharge && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
            )}
          </div>

          <div className="text-xs text-white/60 mt-4">
            * Champs obligatoires
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChargeForm;
