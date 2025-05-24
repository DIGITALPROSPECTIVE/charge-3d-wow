
export interface Charge {
  id: string;
  description: string;
  montantHT: number;
  tauxTVA: number;
  montantTTC: number;
  montantTVA: number;
  categorie: string;
  typeCharge: 'mensuelle' | 'exceptionnelle';
  dateCreation: Date;
  // Champs spécifiques aux frais kilométriques
  distanceKm?: number;
  puissanceCV?: number;
  distanceTotaleAnnuelle?: number;
}

export interface ChargeSummary {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  nombreCharges: number;
}

export interface MileageRates {
  [key: string]: {
    upTo5000: number;
    from5001To20000: { rate: number; fixed: number };
    above20000: number;
  };
}
