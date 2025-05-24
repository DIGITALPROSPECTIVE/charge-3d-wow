
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Charge } from '../types/charge';
import { calculateTTC, generateId } from '../utils/chargeUtils';
import { Plus, Edit, Calculator } from 'lucide-react';

interface ChargeFormProps {
  onAddCharge: (charge: Charge) => void;
  editingCharge?: Charge | null;
  onCancelEdit: () => void;
}

const ChargeForm: React.FC<ChargeFormProps> = ({ onAddCharge, editingCharge, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [montantHT, setMontantHT] = useState('');
  const [tauxTVA, setTauxTVA] = useState('20');
  const [categorie, setCategorie] = useState('');
  const [montantTTC, setMontantTTC] = useState(0);
  const [montantTVA, setMontantTVA] = useState(0);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !montantHT || !categorie) {
      return;
    }

    const charge: Charge = {
      id: editingCharge ? editingCharge.id : generateId(),
      description,
      montantHT: parseFloat(montantHT),
      tauxTVA: parseFloat(tauxTVA),
      montantTTC,
      montantTVA,
      categorie,
      dateCreation: editingCharge ? editingCharge.dateCreation : new Date()
    };

    onAddCharge(charge);
    
    if (!editingCharge) {
      setDescription('');
      setMontantHT('');
      setTauxTVA('20');
      setCategorie('');
    }
  };

  const handleCancel = () => {
    setDescription('');
    setMontantHT('');
    setTauxTVA('20');
    setCategorie('');
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
              <Label htmlFor="description" className="text-white/80">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Facture électricité"
                required
                className="glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categorie" className="text-white/80">Catégorie</Label>
              <Select value={categorie} onValueChange={setCategorie} required>
                <SelectTrigger className="glass-card border-white/20 text-white">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montantHT" className="text-white/80">Montant HT (€)</Label>
              <Input
                id="montantHT"
                type="number"
                value={montantHT}
                onChange={(e) => setMontantHT(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="glass-card border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
              />
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
              <div className="glass-card border-white/20 p-2 rounded-md">
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
        </form>
      </CardContent>
    </Card>
  );
};

export default ChargeForm;
