
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Charge } from '../types/charge';
import { calculateTTC, generateId } from '../utils/chargeUtils';
import { calculateMileageAmount } from '../utils/mileageUtils';
import { Plus, Edit, Calculator, AlertCircle, Car, Clock, Zap } from 'lucide-react';

interface ChargeFormProps {
  onAddCharge: (charge: Charge) => void;
  editingCharge?: Charge | null;
  onCancelEdit: () => void;
}

interface FormErrors {
  description?: string;
  montantHT?: string;
  categorie?: string;
  typeCharge?: string;
  distanceKm?: string;
  puissanceCV?: string;
  distanceTotaleAnnuelle?: string;
}

const ChargeForm: React.FC<ChargeFormProps> = ({ onAddCharge, editingCharge, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [montantHT, setMontantHT] = useState('');
  const [tauxTVA, setTauxTVA] = useState('20');
  const [categorie, setCategorie] = useState('');
  const [typeCharge, setTypeCharge] = useState<'mensuelle' | 'exceptionnelle'>('exceptionnelle');
  const [montantTTC, setMontantTTC] = useState(0);
  const [montantTVA, setMontantTVA] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Champs spécifiques aux frais kilométriques
  const [distanceKm, setDistanceKm] = useState('');
  const [puissanceCV, setPuissanceCV] = useState('');
  const [distanceTotaleAnnuelle, setDistanceTotaleAnnuelle] = useState('');

  const isKilometricExpense = categorie === 'frais-kilometriques';

  useEffect(() => {
    if (editingCharge) {
      setDescription(editingCharge.description);
      setMontantHT(editingCharge.montantHT.toString());
      setTauxTVA(editingCharge.tauxTVA.toString());
      setCategorie(editingCharge.categorie);
      setTypeCharge(editingCharge.typeCharge);
      setMontantTTC(editingCharge.montantTTC);
      setMontantTVA(editingCharge.montantTVA);
      setDistanceKm(editingCharge.distanceKm?.toString() || '');
      setPuissanceCV(editingCharge.puissanceCV?.toString() || '');
      setDistanceTotaleAnnuelle(editingCharge.distanceTotaleAnnuelle?.toString() || '');
    }
  }, [editingCharge]);

  useEffect(() => {
    let ht = parseFloat(montantHT) || 0;
    
    // Calcul automatique pour les frais kilométriques
    if (isKilometricExpense && distanceKm && puissanceCV && distanceTotaleAnnuelle) {
      const calculatedAmount = calculateMileageAmount(
        parseFloat(distanceKm),
        parseInt(puissanceCV),
        parseFloat(distanceTotaleAnnuelle)
      );
      ht = calculatedAmount;
      setMontantHT(calculatedAmount.toFixed(2));
    }
    
    const tva = parseFloat(tauxTVA) || 0;
    const { montantTTC: ttc, montantTVA: tvaAmount } = calculateTTC(ht, tva);
    setMontantTTC(ttc);
    setMontantTVA(tvaAmount);
  }, [montantHT, tauxTVA, distanceKm, puissanceCV, distanceTotaleAnnuelle, isKilometricExpense]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (description.trim().length < 3) {
      newErrors.description = 'La description doit contenir au moins 3 caractères';
    }

    if (!isKilometricExpense) {
      if (!montantHT) {
        newErrors.montantHT = 'Le montant HT est obligatoire';
      } else if (parseFloat(montantHT) <= 0) {
        newErrors.montantHT = 'Le montant HT doit être supérieur à 0';
      } else if (parseFloat(montantHT) > 999999) {
        newErrors.montantHT = 'Le montant HT ne peut pas dépasser 999 999 €';
      }
    } else {
      if (!distanceKm) {
        newErrors.distanceKm = 'La distance est obligatoire';
      } else if (parseFloat(distanceKm) <= 0) {
        newErrors.distanceKm = 'La distance doit être supérieure à 0';
      }

      if (!puissanceCV) {
        newErrors.puissanceCV = 'La puissance est obligatoire';
      }

      if (!distanceTotaleAnnuelle) {
        newErrors.distanceTotaleAnnuelle = 'La distance totale annuelle est obligatoire';
      } else if (parseFloat(distanceTotaleAnnuelle) <= 0) {
        newErrors.distanceTotaleAnnuelle = 'La distance totale annuelle doit être supérieure à 0';
      }
    }

    if (!categorie) {
      newErrors.categorie = 'La catégorie est obligatoire';
    }

    if (!typeCharge) {
      newErrors.typeCharge = 'Le type de charge est obligatoire';
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
      typeCharge,
      dateCreation: editingCharge ? editingCharge.dateCreation : new Date(),
      ...(isKilometricExpense && {
        distanceKm: parseFloat(distanceKm),
        puissanceCV: parseInt(puissanceCV),
        distanceTotaleAnnuelle: parseFloat(distanceTotaleAnnuelle)
      })
    };

    onAddCharge(charge);
    
    if (!editingCharge) {
      // Réinitialiser le formulaire uniquement lors d'un ajout
      setDescription('');
      setMontantHT('');
      setTauxTVA('20');
      setCategorie('');
      setTypeCharge('exceptionnelle');
      setDistanceKm('');
      setPuissanceCV('');
      setDistanceTotaleAnnuelle('');
      setErrors({});
    }
  };

  const handleCancel = () => {
    setDescription('');
    setMontantHT('');
    setTauxTVA('20');
    setCategorie('');
    setTypeCharge('exceptionnelle');
    setDistanceKm('');
    setPuissanceCV('');
    setDistanceTotaleAnnuelle('');
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
              <Label htmlFor="typeCharge" className="text-white/80 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Type de charge *
              </Label>
              <Select 
                value={typeCharge} 
                onValueChange={(value: 'mensuelle' | 'exceptionnelle') => {
                  setTypeCharge(value);
                  if (errors.typeCharge) {
                    setErrors({ ...errors, typeCharge: undefined });
                  }
                }}
              >
                <SelectTrigger className={`glass-card border-white/20 text-white ${
                  errors.typeCharge ? 'border-red-500' : ''
                }`}>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="exceptionnelle">Exceptionnelle</SelectItem>
                  <SelectItem value="mensuelle">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
              {errors.typeCharge && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.typeCharge}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categorie" className="text-white/80">Catégorie *</Label>
            <Select 
              value={categorie} 
              onValueChange={(value) => {
                setCategorie(value);
                if (value !== 'frais-kilometriques') {
                  setDistanceKm('');
                  setPuissanceCV('');
                  setDistanceTotaleAnnuelle('');
                }
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
                <SelectItem value="frais-de-bouche">Frais de bouche</SelectItem>
                <SelectItem value="hotel">Hôtel</SelectItem>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="frais-kilometriques">Frais kilométriques</SelectItem>
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

          {isKilometricExpense && (
            <div className="space-y-4 p-4 glass-card border border-white/20 rounded-lg">
              <div className="flex items-center gap-2 text-white/80 mb-4">
                <Car className="w-5 h-5" />
                <span className="font-semibold">Calcul automatique des frais kilométriques</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distanceKm" className="text-white/80">Distance (km) *</Label>
                  <Input
                    id="distanceKm"
                    type="number"
                    value={distanceKm}
                    onChange={(e) => {
                      setDistanceKm(e.target.value);
                      if (errors.distanceKm) {
                        setErrors({ ...errors, distanceKm: undefined });
                      }
                    }}
                    placeholder="Ex: 100"
                    step="0.1"
                    min="0"
                    className={`glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 ${
                      errors.distanceKm ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.distanceKm && (
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.distanceKm}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="puissanceCV" className="text-white/80">Puissance (CV) *</Label>
                  <Select 
                    value={puissanceCV} 
                    onValueChange={(value) => {
                      setPuissanceCV(value);
                      if (errors.puissanceCV) {
                        setErrors({ ...errors, puissanceCV: undefined });
                      }
                    }}
                  >
                    <SelectTrigger className={`glass-card border-white/20 text-white ${
                      errors.puissanceCV ? 'border-red-500' : ''
                    }`}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="3">3 CV et moins</SelectItem>
                      <SelectItem value="4">4 CV</SelectItem>
                      <SelectItem value="5">5 CV</SelectItem>
                      <SelectItem value="6">6 CV</SelectItem>
                      <SelectItem value="7">7 CV et plus</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.puissanceCV && (
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.puissanceCV}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanceTotaleAnnuelle" className="text-white/80">Distance annuelle totale (km) *</Label>
                  <Input
                    id="distanceTotaleAnnuelle"
                    type="number"
                    value={distanceTotaleAnnuelle}
                    onChange={(e) => {
                      setDistanceTotaleAnnuelle(e.target.value);
                      if (errors.distanceTotaleAnnuelle) {
                        setErrors({ ...errors, distanceTotaleAnnuelle: undefined });
                      }
                    }}
                    placeholder="Ex: 15000"
                    step="1"
                    min="1"
                    className={`glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 ${
                      errors.distanceTotaleAnnuelle ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.distanceTotaleAnnuelle && (
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.distanceTotaleAnnuelle}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!isKilometricExpense && (
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
            )}
            
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
                {isKilometricExpense && montantHT && (
                  <div className="text-white/60 text-xs mt-1">
                    HT: {parseFloat(montantHT).toFixed(2)} €
                  </div>
                )}
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
            {isKilometricExpense && (
              <div className="mt-2 text-yellow-300">
                <Zap className="w-4 h-4 inline mr-1" />
                Le montant HT est calculé automatiquement selon le barème fiscal
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChargeForm;
