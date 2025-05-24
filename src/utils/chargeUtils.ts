
import { Charge, ChargeSummary } from '../types/charge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const calculateTTC = (montantHT: number, tauxTVA: number): { montantTTC: number; montantTVA: number } => {
  const montantTVA = (montantHT * tauxTVA) / 100;
  const montantTTC = montantHT + montantTVA;
  
  return {
    montantTTC: Math.round(montantTTC * 100) / 100,
    montantTVA: Math.round(montantTVA * 100) / 100
  };
};

export const calculateSummary = (charges: Charge[]): ChargeSummary => {
  const totalHT = charges.reduce((sum, charge) => sum + charge.montantHT, 0);
  const totalTVA = charges.reduce((sum, charge) => sum + charge.montantTVA, 0);
  const totalTTC = charges.reduce((sum, charge) => sum + charge.montantTTC, 0);
  
  return {
    totalHT: Math.round(totalHT * 100) / 100,
    totalTVA: Math.round(totalTVA * 100) / 100,
    totalTTC: Math.round(totalTTC * 100) / 100,
    nombreCharges: charges.length
  };
};

export const exportToPDF = async (charges: Charge[], summary: ChargeSummary) => {
  const pdf = new jsPDF();
  
  // Configuration
  const margin = 20;
  let yPosition = margin;
  
  // Titre
  pdf.setFontSize(24);
  pdf.setTextColor(102, 126, 234);
  pdf.text('Gestionnaire de Charges', margin, yPosition);
  yPosition += 20;
  
  // Date
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
  yPosition += 20;
  
  // Résumé
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Résumé', margin, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(12);
  pdf.text(`Nombre de charges: ${summary.nombreCharges}`, margin + 10, yPosition);
  yPosition += 8;
  pdf.text(`Total HT: ${summary.totalHT.toFixed(2)} €`, margin + 10, yPosition);
  yPosition += 8;
  pdf.text(`Total TVA: ${summary.totalTVA.toFixed(2)} €`, margin + 10, yPosition);
  yPosition += 8;
  pdf.setTextColor(102, 126, 234);
  pdf.setFontSize(14);
  pdf.text(`Total TTC: ${summary.totalTTC.toFixed(2)} €`, margin + 10, yPosition);
  yPosition += 20;
  
  // Liste des charges
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Détail des charges', margin, yPosition);
  yPosition += 15;
  
  // En-têtes
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Description', margin, yPosition);
  pdf.text('Catégorie', margin + 60, yPosition);
  pdf.text('HT (€)', margin + 100, yPosition);
  pdf.text('TVA (%)', margin + 130, yPosition);
  pdf.text('TTC (€)', margin + 160, yPosition);
  yPosition += 10;
  
  // Ligne de séparation
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Charges
  pdf.setTextColor(0, 0, 0);
  charges.forEach((charge) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.text(charge.description.substring(0, 25), margin, yPosition);
    pdf.text(charge.categorie, margin + 60, yPosition);
    pdf.text(charge.montantHT.toFixed(2), margin + 100, yPosition);
    pdf.text(charge.tauxTVA.toString(), margin + 130, yPosition);
    pdf.text(charge.montantTTC.toFixed(2), margin + 160, yPosition);
    yPosition += 8;
  });
  
  // Téléchargement
  pdf.save(`charges_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};
