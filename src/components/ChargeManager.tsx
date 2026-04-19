
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
import ChargeCharts from './ChargeCharts';
import { generateId, calculateTTC, exportToPDF } from '../utils/chargeUtils';

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

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  dashboard:  { title: 'Dashboard',  subtitle: "Vue d'ensemble de vos charges professionnelles" },
  analytics:  { title: 'Analytics',  subtitle: 'Graphiques détaillés et tendances de vos dépenses' },
  charges:    { title: 'Charges',    subtitle: 'Liste complète, recherche et édition de vos charges' },
  calendrier: { title: 'Calendrier', subtitle: 'Échéances à venir et dates de prélèvement' },
  sessions:   { title: 'Sessions',   subtitle: 'Sauvegarde, import et export de vos données' },
  pdf:        { title: 'PDF Export', subtitle: 'Générez un rapport PDF professionnel' },
  rapports:   { title: 'Rapports',   subtitle: 'Synthèses par catégorie et par type de charge' },
};

const ChargeManager: React.FC = () => {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chargeToDelete, setChargeToDelete] = useState<Charge | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const { toast } = useToast();

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

  useEffect(() => {
    localStorage.setItem('charges', JSON.stringify(charges));
  }, [charges]);

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
      toast({ title: "Charge modifiée", description: "La charge a été modifiée avec succès." });
    } else {
      setCharges([charge, ...charges]);
      toast({ title: "Charge ajoutée", description: "La nouvelle charge a été ajoutée avec succès." });
    }
  };

  const handleEditCharge = (charge: Charge) => {
    setEditingCharge(charge);
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
      toast({ title: "Charge supprimée", description: "La charge a été supprimée avec succès.", variant: "destructive" });
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
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const summary = calculateSummary(charges);

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600&display=swap');

        :root {
          --bg:         #0a0a0f;
          --surface:    #111118;
          --panel:      #1a1a28;
          --panel-hi:   #22223a;
          --border:     rgba(255,255,255,0.07);
          --border-hi:  rgba(202,255,0,0.2);
          --text:       #f0f0f5;
          --muted:      rgba(255,255,255,0.45);
          --accent:     #caff00;
          --accent-dim: rgba(202,255,0,0.10);
          --accent2:    #7b4dff;
          --accent2-dim:rgba(123,77,255,0.18);
          --danger:     #ff2d78;
          --danger-dim: rgba(255,45,120,0.15);
          --warn:       #00ffc2;
          --warn-dim:   rgba(0,255,194,0.12);
          --font-head:  'Orbitron', monospace;
          --font:       'Exo 2', system-ui, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cm-root {
          font-family: var(--font);
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* ─── TOPBAR ───────────────────────────────────────── */
        .cm-topbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 60px;
          background: rgba(10,10,15,0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(202,255,0,0.08);
          display: flex;
          align-items: center;
          padding: 0 20px 0 16px;
          gap: 16px;
          z-index: 100;
        }

        .cm-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 0 0 220px;
        }

        .cm-logo-hex {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .cm-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cm-brand-gooey {
          height: 28px;
          width: 130px;
          overflow: hidden;
        }

        .cm-back-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid var(--border-hi);
          color: var(--muted);
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          cursor: pointer;
          background: transparent;
          white-space: nowrap;
        }
        .cm-back-pill:hover {
          color: var(--text);
          border-color: var(--accent);
          background: var(--accent-dim);
        }

        .cm-topbar-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .cm-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-family: var(--font-head);
          color: var(--muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .cm-breadcrumb-sep {
          opacity: 0.3;
          font-size: 14px;
          line-height: 1;
        }
        .cm-breadcrumb-active {
          color: var(--accent);
          font-weight: 700;
        }

        .cm-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
        }

        .cm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: var(--accent);
          color: #0a0a0f;
          border: none;
          border-radius: 8px;
          font-family: var(--font-head);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .cm-btn-primary:hover {
          background: #d4ff33;
          box-shadow: 0 0 20px rgba(202,255,0,0.5);
          transform: translateY(-1px);
        }
        .cm-btn-primary:active { transform: translateY(0); }

        .cm-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          font-family: var(--font-head);
          color: #0a0a0f;
          flex-shrink: 0;
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        .cm-avatar:hover {
          box-shadow: 0 0 0 2px var(--accent), 0 0 12px rgba(202,255,0,0.3);
        }

        /* ─── LAYOUT SHELL ─────────────────────────────────── */
        .cm-shell {
          display: flex;
          padding-top: 60px;
          min-height: 100vh;
        }

        /* ─── SIDEBAR ──────────────────────────────────────── */
        .cm-sidebar {
          position: fixed;
          top: 60px; left: 0; bottom: 0;
          width: 220px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 20px 12px;
          overflow-y: auto;
          z-index: 90;
        }

        .cm-nav-section {
          margin-bottom: 24px;
        }

        .cm-nav-label {
          font-size: 9px;
          font-weight: 700;
          font-family: var(--font-head);
          letter-spacing: 0.12em;
          color: var(--muted);
          text-transform: uppercase;
          padding: 0 8px;
          margin-bottom: 6px;
        }

        .cm-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          user-select: none;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: var(--font);
        }
        .cm-nav-item:hover {
          color: var(--text);
          background: rgba(255,255,255,0.04);
        }
        .cm-nav-item.active {
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid rgba(202,255,0,0.15);
        }
        .cm-nav-item.active .cm-nav-icon {
          filter: none;
        }
        .cm-nav-icon {
          font-size: 15px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .cm-nav-dot {
          margin-left: auto;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          display: none;
        }
        .cm-nav-item.active .cm-nav-dot {
          display: block;
        }

        .cm-sidebar-footer {
          margin-top: auto;
          padding: 12px 8px 0;
          border-top: 1px solid var(--border);
        }
        .cm-version-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 11px;
          color: var(--muted);
          font-weight: 500;
        }
        .cm-version-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent2);
          flex-shrink: 0;
        }

        /* ─── MAIN CONTENT ─────────────────────────────────── */
        .cm-main {
          margin-left: 220px;
          flex: 1;
          padding: 28px 28px 60px;
          min-width: 0;
        }

        /* ─── PAGE HEADER ──────────────────────────────────── */
        .cm-page-header {
          margin-bottom: 28px;
        }
        .cm-page-title {
          font-size: 20px;
          font-weight: 700;
          font-family: var(--font-head);
          color: var(--text);
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .cm-page-subtitle {
          font-size: 13px;
          color: var(--muted);
          margin-top: 4px;
        }

        /* ─── KPI ROW ──────────────────────────────────────── */
        .cm-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .cm-kpi-card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 0;
          overflow: hidden;
          position: relative;
          transition: border-color 0.2s, transform 0.15s;
        }
        .cm-kpi-card:hover {
          border-color: var(--border-hi);
          transform: translateY(-2px);
        }

        .cm-kpi-topbar {
          height: 3px;
          border-radius: 0;
        }

        .cm-kpi-body {
          padding: 18px 20px 20px;
        }

        .cm-kpi-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .cm-kpi-label {
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .cm-kpi-icon-pill {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .cm-kpi-value {
          font-size: 26px;
          font-weight: 800;
          font-family: var(--font-head);
          color: var(--text);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }

        .cm-kpi-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .cm-trend {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 7px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .cm-trend.up {
          background: var(--accent-dim);
          color: var(--accent);
        }
        .cm-trend.down {
          background: var(--danger-dim);
          color: var(--danger);
        }
        .cm-trend.neutral {
          background: rgba(255,255,255,0.06);
          color: var(--muted);
        }

        .cm-btn-ghost-sm {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: transparent;
          border: 1px solid var(--border-hi);
          border-radius: 6px;
          color: var(--muted);
          font-family: var(--font);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .cm-btn-ghost-sm:hover {
          color: var(--text);
          border-color: var(--accent);
          background: var(--accent-dim);
        }

        /* ─── SECTION CARD ─────────────────────────────────── */
        .cm-card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 20px;
          transition: border-color 0.2s;
        }
        .cm-card:hover {
          border-color: var(--border-hi);
        }

        .cm-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          gap: 12px;
        }

        .cm-card-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cm-card-title {
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-head);
          color: var(--text);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .cm-card-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          background: var(--accent-dim);
          border: 1px solid rgba(202,255,0,0.25);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
          font-family: var(--font-head);
          letter-spacing: 0.04em;
        }

        .cm-card-icon {
          font-size: 15px;
          opacity: 0.7;
        }

        .cm-card-body {
          padding: 20px;
        }

        /* ─── TWO-COL GRID ─────────────────────────────────── */
        .cm-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        /* ─── DIVIDER ──────────────────────────────────────── */
        .cm-divider {
          height: 1px;
          background: var(--border);
          margin: 28px 0;
        }

        /* ─── OVERRIDE: child component containers ─────────── */
        .cm-card-body > * {
          background: transparent !important;
        }

        /* Ensure child components blend into dark background */
        .cm-card-body .bg-white,
        .cm-card-body [class*="bg-white"],
        .cm-card-body [class*="bg-card"] {
          background: transparent !important;
        }

        /* ─── SCROLLBAR ────────────────────────────────────── */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.18);
        }

        /* ─── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1100px) {
          .cm-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .cm-sidebar { display: none; }
          .cm-main { margin-left: 0; }
          .cm-two-col { grid-template-columns: 1fr; }
          .cm-topbar-left { flex: 0 0 auto; }
        }
        @media (max-width: 600px) {
          .cm-kpi-grid { grid-template-columns: 1fr; }
          .cm-main { padding: 16px 12px 40px; }
        }

        /* ─── SUBTLE GLOW ANIMATION ────────────────────────── */
        @keyframes cm-pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .cm-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent2);
          animation: cm-pulse-glow 2s infinite;
          flex-shrink: 0;
        }
      `}</style>

      <div className="cm-root">

        {/* ── TOPBAR ─────────────────────────────────────────── */}
        <header className="cm-topbar">
          {/* Left: logo + brand + back pill */}
          <div className="cm-topbar-left">
            <svg className="cm-logo-hex" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="rgba(202,255,0,0.12)" stroke="#caff00" strokeWidth="1.5"/>
              <path d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z" fill="#caff00" opacity="0.6"/>
              <circle cx="16" cy="15" r="3" fill="#0a0a0f" opacity="0.9"/>
            </svg>
            <div className="cm-brand">
              <div className="cm-brand-gooey">
                <GooeyText
                  texts={["ChargeApp", "Dashboard", "Charges", "Analytics"]}
                  morphTime={1.2}
                  cooldownTime={2.5}
                  className="h-full w-full"
                  textClassName="font-semibold text-white"
                />
              </div>
            </div>
            <a href="/" className="cm-back-pill">
              ← Accueil
            </a>
          </div>

          {/* Center: breadcrumb */}
          <div className="cm-topbar-center">
            <nav className="cm-breadcrumb">
              <span>ChargeApp</span>
              <span className="cm-breadcrumb-sep">/</span>
              <span className="cm-breadcrumb-active">{PAGE_META[activeNav]?.title || 'Dashboard'}</span>
            </nav>
          </div>

          {/* Right: CTA + avatar */}
          <div className="cm-topbar-right">
            <button
              className="cm-btn-primary"
              onClick={() => {
                setEditingCharge(null);
                document.getElementById('cm-form-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>＋</span>
              Nouvelle charge
            </button>
            <div className="cm-avatar" title="Digiprospective">DP</div>
          </div>
        </header>

        {/* ── SHELL ──────────────────────────────────────────── */}
        <div className="cm-shell">

          {/* ── SIDEBAR ──────────────────────────────────────── */}
          <aside className="cm-sidebar">
            <div className="cm-nav-section">
              <div className="cm-nav-label">Overview</div>
              <button
                className={`cm-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveNav('dashboard')}
              >
                <span className="cm-nav-icon">📊</span>
                Dashboard
                <span className="cm-nav-dot" />
              </button>
              <button
                className={`cm-nav-item ${activeNav === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveNav('analytics')}
              >
                <span className="cm-nav-icon">📈</span>
                Analytics
                <span className="cm-nav-dot" />
              </button>
            </div>

            <div className="cm-nav-section">
              <div className="cm-nav-label">Gestion</div>
              <button
                className={`cm-nav-item ${activeNav === 'charges' ? 'active' : ''}`}
                onClick={() => setActiveNav('charges')}
              >
                <span className="cm-nav-icon">💳</span>
                Charges
                <span className="cm-nav-dot" />
              </button>
              <button
                className={`cm-nav-item ${activeNav === 'calendrier' ? 'active' : ''}`}
                onClick={() => setActiveNav('calendrier')}
              >
                <span className="cm-nav-icon">📅</span>
                Calendrier
                <span className="cm-nav-dot" />
              </button>
              <button
                className={`cm-nav-item ${activeNav === 'sessions' ? 'active' : ''}`}
                onClick={() => setActiveNav('sessions')}
              >
                <span className="cm-nav-icon">🗄️</span>
                Sessions
                <span className="cm-nav-dot" />
              </button>
            </div>

            <div className="cm-nav-section">
              <div className="cm-nav-label">Exports</div>
              <button
                className={`cm-nav-item ${activeNav === 'pdf' ? 'active' : ''}`}
                onClick={() => setActiveNav('pdf')}
              >
                <span className="cm-nav-icon">📤</span>
                PDF Export
                <span className="cm-nav-dot" />
              </button>
              <button
                className={`cm-nav-item ${activeNav === 'rapports' ? 'active' : ''}`}
                onClick={() => setActiveNav('rapports')}
              >
                <span className="cm-nav-icon">📋</span>
                Rapports
                <span className="cm-nav-dot" />
              </button>
            </div>

            <div className="cm-sidebar-footer">
              <span className="cm-version-badge">
                <span className="cm-version-dot" />
                v1.0.0
              </span>
            </div>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────────── */}
          <main className="cm-main">

            {/* Page header */}
            <div className="cm-page-header">
              <h1 className="cm-page-title">Vue d'ensemble</h1>
              <p className="cm-page-subtitle">
                Suivi de vos charges professionnelles &mdash; {charges.length} entrées au total
              </p>
            </div>

            {/* ── KPI ROW ────────────────────────────────────── */}
            <div className="cm-kpi-grid">

              {/* Card 1: Nombre de charges */}
              <div className="cm-kpi-card">
                <div className="cm-kpi-topbar" style={{ background: 'linear-gradient(90deg, #caff00, #a8d400)' }} />
                <div className="cm-kpi-body">
                  <div className="cm-kpi-header">
                    <span className="cm-kpi-label">Charges</span>
                    <span className="cm-kpi-icon-pill" style={{ background: 'rgba(202,255,0,0.12)' }}>💳</span>
                  </div>
                  <div className="cm-kpi-value">{summary.nombreCharges}</div>
                  <div className="cm-kpi-footer">
                    <span className="cm-trend up">↑ +12% ce mois</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{filteredCharges.length} visibles</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Total HT */}
              <div className="cm-kpi-card">
                <div className="cm-kpi-topbar" style={{ background: 'linear-gradient(90deg, #7b4dff, #9b70ff)' }} />
                <div className="cm-kpi-body">
                  <div className="cm-kpi-header">
                    <span className="cm-kpi-label">Total HT</span>
                    <span className="cm-kpi-icon-pill" style={{ background: 'rgba(123,77,255,0.15)' }}>💶</span>
                  </div>
                  <div className="cm-kpi-value" style={{ fontSize: summary.totalHT >= 10000 ? 20 : 26 }}>
                    {fmt(summary.totalHT)}
                  </div>
                  <div className="cm-kpi-footer">
                    <span className="cm-trend up">↑ +8% ce mois</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>hors taxe</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Total TVA */}
              <div className="cm-kpi-card">
                <div className="cm-kpi-topbar" style={{ background: 'linear-gradient(90deg, #f0a030, #e8901a)' }} />
                <div className="cm-kpi-body">
                  <div className="cm-kpi-header">
                    <span className="cm-kpi-label">Total TVA</span>
                    <span className="cm-kpi-icon-pill" style={{ background: 'rgba(240,160,48,0.15)' }}>🏦</span>
                  </div>
                  <div className="cm-kpi-value" style={{ fontSize: summary.totalTVA >= 10000 ? 20 : 26 }}>
                    {fmt(summary.totalTVA)}
                  </div>
                  <div className="cm-kpi-footer">
                    <span className="cm-trend neutral">— stable</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>déductible</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Total TTC */}
              <div className="cm-kpi-card">
                <div className="cm-kpi-topbar" style={{ background: 'linear-gradient(90deg, #f05070, #e03060)' }} />
                <div className="cm-kpi-body">
                  <div className="cm-kpi-header">
                    <span className="cm-kpi-label">Total TTC</span>
                    <span className="cm-kpi-icon-pill" style={{ background: 'rgba(240,80,112,0.15)' }}>📑</span>
                  </div>
                  <div className="cm-kpi-value" style={{ fontSize: summary.totalTTC >= 10000 ? 20 : 26 }}>
                    {fmt(summary.totalTTC)}
                  </div>
                  <div className="cm-kpi-footer">
                    <span className="cm-trend down">↓ −3% vs prévu</span>
                    <button
                    className="cm-btn-ghost-sm"
                    onClick={() => exportToPDF(charges, summary).catch(console.error)}
                  >
                    📤 Export PDF
                  </button>
                  </div>
                </div>
              </div>

            </div>
            {/* end KPI grid */}

            {/* ── CHARTS ──────────────────────────────────────── */}
            <div className="cm-card">
              <div className="cm-card-header">
                <div className="cm-card-title-group">
                  <span className="cm-card-icon">📈</span>
                  <span className="cm-card-title">Analyse des charges</span>
                  <span className="cm-live-dot" style={{ marginLeft: 4 }} />
                </div>
                <button className="cm-btn-ghost-sm">Voir tout →</button>
              </div>
              <div className="cm-card-body">
                <ChargeCharts charges={charges} />
              </div>
            </div>

            {/* ── FORM ────────────────────────────────────────── */}
            <div className="cm-card" id="cm-form-section">
              <div className="cm-card-header">
                <div className="cm-card-title-group">
                  <span className="cm-card-icon">{editingCharge ? '✏️' : '＋'}</span>
                  <span className="cm-card-title">
                    {editingCharge ? 'Modifier la charge' : 'Nouvelle charge'}
                  </span>
                  {editingCharge && (
                    <span className="cm-card-badge">En édition</span>
                  )}
                </div>
                {editingCharge && (
                  <button className="cm-btn-ghost-sm" onClick={handleCancelEdit}>
                    ✕ Annuler
                  </button>
                )}
              </div>
              <div className="cm-card-body">
                <ChargeForm
                  onAddCharge={handleAddCharge}
                  editingCharge={editingCharge}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            </div>

            {/* ── FILTER + LIST ────────────────────────────────── */}
            <div className="cm-card">
              <div className="cm-card-header">
                <div className="cm-card-title-group">
                  <span className="cm-card-icon">💳</span>
                  <span className="cm-card-title">Toutes les charges</span>
                  <span className="cm-card-badge">{filteredCharges.length}</span>
                </div>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button className="cm-btn-ghost-sm" onClick={handleClearFilters}>
                    ✕ Effacer filtres
                  </button>
                )}
              </div>
              <div className="cm-card-body" style={{ paddingBottom: 0 }}>
                <ChargeFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  onClearFilters={handleClearFilters}
                  totalResults={filteredCharges.length}
                />
              </div>
              <div className="cm-card-body" style={{ paddingTop: 0 }}>
                <ChargeList
                  charges={filteredCharges}
                  onEditCharge={handleEditCharge}
                  onDeleteCharge={handleDeleteRequest}
                />
              </div>
            </div>

            {/* ── CALENDAR + SESSION ───────────────────────────── */}
            <div className="cm-two-col">
              <div className="cm-card" style={{ marginBottom: 0 }}>
                <div className="cm-card-header">
                  <div className="cm-card-title-group">
                    <span className="cm-card-icon">📅</span>
                    <span className="cm-card-title">Calendrier des échéances</span>
                  </div>
                </div>
                <div className="cm-card-body">
                  <ChargeCalendar charges={charges} />
                </div>
              </div>

              <div className="cm-card" style={{ marginBottom: 0 }}>
                <div className="cm-card-header">
                  <div className="cm-card-title-group">
                    <span className="cm-card-icon">🗄️</span>
                    <span className="cm-card-title">Gestion des sessions</span>
                  </div>
                </div>
                <div className="cm-card-body">
                  <SessionManager charges={charges} onImportCharges={handleImportCharges} />
                </div>
              </div>
            </div>

          </main>
        </div>
        {/* end shell */}

        {/* ── DELETE DIALOG ─────────────────────────────────── */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          chargeDescription={chargeToDelete?.description || ''}
        />

      </div>
      {/* end cm-root */}
    </>
  );
};

export default ChargeManager;
