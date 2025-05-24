
export interface Charge {
  id: string;
  description: string;
  montantHT: number;
  tauxTVA: number;
  montantTTC: number;
  montantTVA: number;
  categorie: string;
  dateCreation: Date;
}

export interface ChargeSummary {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  nombreCharges: number;
}
