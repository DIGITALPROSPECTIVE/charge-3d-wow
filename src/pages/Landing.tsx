import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --acid:    #caff00;
          --void:    #0a0a0f;
          --deep:    #111118;
          --surface: #1a1a28;
          --panel:   #22223a;
          --purple:  #7b4dff;
          --violet:  #a855f7;
          --pink:    #ff2d78;
          --teal:    #00ffc2;
          --muted:   rgba(255,255,255,0.45);
          --border:  rgba(255,255,255,0.08);
          --glow-acid:   rgba(202,255,0,0.18);
          --glow-purple: rgba(123,77,255,0.25);
          --font-display: 'Orbitron', monospace;
          --font-body:    'Exo 2', sans-serif;
          --nav-h: 72px;
          --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
        }

        .lp {
          background: var(--void);
          color: #fff;
          font-family: var(--font-body);
          scroll-behavior: smooth;
        }
        .lp a { text-decoration: none; color: inherit; }

        /* CONTAINER */
        .lp__container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 28px;
        }

        /* ── NAV ──────────────────────────────── */
        .lp__nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 400;
          height: var(--nav-h);
          display: flex; align-items: center;
          transition: background 300ms ease, backdrop-filter 300ms ease, box-shadow 300ms ease;
        }
        .lp__nav.nav--scrolled {
          background: rgba(10,10,15,0.75);
          backdrop-filter: blur(20px) saturate(180%);
          box-shadow: 0 1px 0 var(--border);
        }
        .lp__nav-inner {
          display: flex; align-items: center; gap: 40px; width: 100%;
        }
        .lp__logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display);
          font-weight: 700; font-size: 18px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          flex-shrink: 0;
        }
        .lp__logo-mark {
          width: 32px; height: 32px;
          background: var(--acid);
          border-radius: 8px;
          display: grid; place-items: center;
        }
        .lp__nav-links {
          display: flex; gap: 32px;
          list-style: none; flex: 1;
        }
        .lp__nav-links a {
          font-family: var(--font-display);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted);
          transition: color 200ms ease;
          position: relative;
        }
        .lp__nav-links a:hover { color: #fff; }
        .lp__nav-links a::after {
          content: ''; position: absolute;
          bottom: -4px; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px;
          background: var(--acid);
          transition: width 200ms ease;
        }
        .lp__nav-links a:hover::after { width: 100%; }

        /* ── BUTTONS ──────────────────────────── */
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; cursor: pointer; border: none;
          border-radius: 100px;
          font-family: var(--font-display);
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          min-height: 44px; padding: 0 24px;
          transition: transform 150ms var(--ease-spring), box-shadow 150ms ease;
          position: relative; overflow: hidden;
          text-decoration: none;
        }
        .btn::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.12); opacity: 0;
          transition: opacity 200ms ease;
        }
        .btn:hover::before { opacity: 1; }
        .btn:hover { transform: translateY(-2px); }
        .btn:active { transform: translateY(0) scale(0.98); }
        .btn--acid {
          background: var(--acid); color: var(--void);
          box-shadow: 0 0 20px rgba(202,255,0,0.3);
        }
        .btn--acid:hover { box-shadow: 0 0 32px rgba(202,255,0,0.5); }
        .btn--ghost {
          background: transparent; color: #fff;
          border: 1px solid var(--border);
        }
        .btn--ghost:hover { border-color: rgba(255,255,255,0.25); }
        .btn--lg { padding: 0 32px; min-height: 52px; font-size: 13px; }
        .btn--xl { padding: 0 48px; min-height: 60px; font-size: 14px; }

        /* ── BADGE ────────────────────────────── */
        .lp__badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(202,255,0,0.08);
          border: 1px solid rgba(202,255,0,0.2);
          color: var(--acid);
          border-radius: 100px; padding: 5px 14px;
          font-family: var(--font-display);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* ── GLOW ORBS ────────────────────────── */
        .glow-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          z-index: 0;
        }
        .glow-orb--purple { background: var(--glow-purple); }
        .glow-orb--acid   { background: var(--glow-acid); }

        /* ── HERO ─────────────────────────────── */
        .lp__hero {
          min-height: 100svh;
          padding-top: var(--nav-h);
          display: grid; place-items: center;
          position: relative; overflow: hidden;
          isolation: isolate;
        }
        .lp__hero-bg {
          position: absolute; inset: 0; z-index: -2;
          background:
            radial-gradient(ellipse 80% 50% at 60% 40%, rgba(123,77,255,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 10% 90%, rgba(202,255,0,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 90% 10%, rgba(255,45,120,0.10) 0%, transparent 50%);
        }
        .lp__hero-grid {
          position: absolute; inset: 0; z-index: -1;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
        }
        .lp__hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: center;
          padding: 80px 0;
          position: relative; z-index: 1;
        }
        .lp__hero-eyebrow { margin-bottom: 20px; }
        .lp__hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .lp__hero-title span {
          background: linear-gradient(135deg, var(--acid) 0%, var(--teal) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp__hero-sub {
          font-size: 17px; line-height: 1.7;
          color: var(--muted); margin-bottom: 36px;
          font-weight: 300;
        }
        .lp__hero-actions {
          display: flex; gap: 14px; flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .lp__hero-trust {
          display: flex; gap: 24px; flex-wrap: wrap;
          font-size: 12px; color: rgba(255,255,255,0.35);
          font-family: var(--font-display); letter-spacing: 0.05em;
        }
        .lp__hero-trust span { display: flex; align-items: center; gap: 6px; }
        .lp__hero-trust span::before { content: '✦'; color: var(--acid); }

        /* MOCKUP CARD */
        .lp__mockup {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          position: relative;
        }
        .lp__mockup::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(202,255,0,0.4), transparent);
        }
        .lp__mockup-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px;
        }
        .lp__mockup-amount {
          font-family: var(--font-display);
          font-size: 38px; font-weight: 900;
          letter-spacing: -0.03em; margin-bottom: 4px;
          color: var(--acid);
        }
        .lp__mockup-label {
          font-size: 12px; color: var(--muted);
          font-family: var(--font-display); letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .lp__mockup-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .lp__mockup-row {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 10px; padding: 10px 14px;
        }
        .lp__mockup-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .lp__mockup-row-info { flex: 1; }
        .lp__mockup-row-info strong { display: block; font-size: 13px; font-weight: 600; }
        .lp__mockup-row-info small { font-size: 11px; color: var(--muted); }
        .lp__mockup-row-amount { font-family: var(--font-display); font-size: 13px; font-weight: 700; }
        .lp__mockup-footer {
          display: flex; justify-content: space-between;
          border-top: 1px solid var(--border); padding-top: 16px;
        }
        .lp__mockup-footer-item span { display: block; }
        .lp__mockup-footer-item .lbl {
          font-size: 10px; color: var(--muted);
          font-family: var(--font-display); letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 4px;
        }
        .lp__mockup-footer-item .val {
          font-family: var(--font-display); font-size: 15px; font-weight: 700;
        }

        /* Floating chips */
        .lp__chip {
          position: absolute;
          background: var(--surface);
          border: 1px solid rgba(202,255,0,0.2);
          border-radius: 100px; padding: 8px 18px;
          font-size: 12px; font-weight: 600; white-space: nowrap;
          font-family: var(--font-display); letter-spacing: 0.04em;
          color: var(--acid);
          animation: chipFloat 3s ease-in-out infinite;
          box-shadow: 0 0 16px rgba(202,255,0,0.15);
        }
        .lp__chip--1 { top: -20px; right: 24px; }
        .lp__chip--2 { bottom: -20px; left: 24px; animation-delay: 1.5s; }
        @keyframes chipFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        /* ── SECTIONS ─────────────────────────── */
        .lp__section {
          padding: 120px 0;
          position: relative; overflow: hidden;
        }
        .lp__section--alt { background: var(--deep); }
        .lp__section-head { text-align: center; margin-bottom: 72px; }
        .lp__section-badge { margin-bottom: 20px; }
        .lp__section-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900; letter-spacing: -0.02em;
          margin-bottom: 16px; line-height: 1.1;
        }
        .lp__section-title span {
          background: linear-gradient(135deg, var(--acid), var(--teal));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp__section-sub {
          font-size: 16px; color: var(--muted);
          max-width: 520px; margin: 0 auto; line-height: 1.7;
          font-weight: 300;
        }

        /* FEATURES GRID */
        .lp__features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .lp__feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 28px;
          transition: border-color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
          position: relative; overflow: hidden;
        }
        .lp__feature-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(202,255,0,0.0), transparent);
          transition: background 250ms ease;
        }
        .lp__feature-card:hover {
          border-color: rgba(202,255,0,0.2);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(202,255,0,0.06);
        }
        .lp__feature-card:hover::after {
          background: linear-gradient(90deg, transparent, rgba(202,255,0,0.4), transparent);
        }
        .lp__feature-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(202,255,0,0.08);
          border: 1px solid rgba(202,255,0,0.15);
          display: grid; place-items: center;
          font-size: 20px; margin-bottom: 18px;
        }
        .lp__feature-title {
          font-family: var(--font-display);
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em; margin-bottom: 10px;
          text-transform: uppercase;
        }
        .lp__feature-desc {
          font-size: 14px; color: var(--muted);
          line-height: 1.65; font-weight: 300;
        }

        /* STATS */
        .lp__stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        .lp__stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 32px 24px;
          text-align: center;
        }
        .lp__stat-value {
          font-family: var(--font-display);
          font-size: 48px; font-weight: 900;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, var(--acid), var(--teal));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        .lp__stat-label {
          font-size: 13px; color: var(--muted);
          font-family: var(--font-display); letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* CTA */
        .lp__cta {
          padding: 140px 0;
          position: relative; overflow: hidden; text-align: center;
          isolation: isolate;
        }
        .lp__cta-bg {
          position: absolute; inset: 0; z-index: -1;
          background:
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(123,77,255,0.18) 0%, transparent 70%);
        }
        .lp__cta-grid {
          position: absolute; inset: 0; z-index: -1;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%);
        }
        .lp__cta-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 5vw, 60px);
          font-weight: 900; letter-spacing: -0.02em;
          margin-bottom: 20px; line-height: 1.05;
        }
        .lp__cta-title span {
          background: linear-gradient(135deg, var(--acid), var(--teal));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp__cta-sub {
          font-size: 16px; color: var(--muted);
          margin-bottom: 44px; line-height: 1.7; font-weight: 300;
        }
        .lp__cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        /* FOOTER */
        .lp__footer {
          border-top: 1px solid var(--border);
          padding: 32px 0; background: var(--void);
        }
        .lp__footer-inner {
          display: flex; justify-content: space-between; align-items: center;
        }
        .lp__footer-copy {
          font-size: 12px; color: rgba(255,255,255,0.25);
          font-family: var(--font-display); letter-spacing: 0.05em;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .lp__hero-inner { grid-template-columns: 1fr; }
          .lp__mockup { display: none; }
          .lp__features-grid { grid-template-columns: repeat(2, 1fr); }
          .lp__stats-grid { grid-template-columns: repeat(2, 1fr); }
          .lp__nav-links { display: none; }
        }
        @media (max-width: 600px) {
          .lp__features-grid { grid-template-columns: 1fr; }
          .lp__stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="lp">

        {/* NAV */}
        <nav className="lp__nav" ref={navRef}>
          <div className="lp__container">
            <div className="lp__nav-inner">
              <a className="lp__logo" href="#hero">
                <span className="lp__logo-mark">
                  <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
                    <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" fill="#0a0a0f"/>
                    <path d="M9 5L13 7.5V12.5L9 15L5 12.5V7.5L9 5Z" fill="#0a0a0f"/>
                  </svg>
                </span>
                ChargeApp
              </a>
              <ul className="lp__nav-links">
                <li><a href="#features">Fonctionnalités</a></li>
                <li><a href="#stats">Statistiques</a></li>
                <li><a href="#cta">Démarrer</a></li>
              </ul>
              <button className="btn btn--acid" onClick={() => navigate('/app')}>
                Ouvrir l'app →
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp__hero" id="hero">
          <div className="lp__hero-bg" />
          <div className="lp__hero-grid" />
          <div className="glow-orb glow-orb--purple" style={{ width: 500, height: 500, top: '10%', right: -100 }} />
          <div className="glow-orb glow-orb--acid"   style={{ width: 300, height: 300, bottom: '20%', left: -50 }} />

          <div className="lp__container">
            <div className="lp__hero-inner">
              {/* Left */}
              <div>
                <div className="lp__hero-eyebrow">
                  <span className="lp__badge">✦ Gestion professionnelle</span>
                </div>
                <h1 className="lp__hero-title">
                  Gérez vos charges<br />
                  <span>sans effort</span>
                </h1>
                <p className="lp__hero-sub">
                  Calcul automatique HT / TVA / TTC, export PDF, graphiques en temps réel.
                  Tout ce qu'il vous faut pour piloter vos dépenses professionnelles.
                </p>
                <div className="lp__hero-actions">
                  <button className="btn btn--acid btn--lg" onClick={() => navigate('/app')}>
                    Commencer gratuitement →
                  </button>
                  <a href="#features" className="btn btn--ghost btn--lg">Voir les fonctionnalités</a>
                </div>
                <div className="lp__hero-trust">
                  <span>Export PDF</span>
                  <span>Calcul TVA auto</span>
                  <span>Graphiques live</span>
                </div>
              </div>

              {/* Right — Mockup card */}
              <div style={{ position: 'relative' }}>
                <div className="lp__mockup">
                  <div className="lp__mockup-header">
                    <span className="lp__badge" style={{ fontSize: 10 }}>● Live</span>
                    <span style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>AVR. 2026</span>
                  </div>
                  <div className="lp__mockup-amount">3 605,90 €</div>
                  <div className="lp__mockup-label">Total TTC ce mois</div>
                  <div className="lp__mockup-rows">
                    {[
                      { label: 'Loyer bureau',    cat: 'Immobilier',  amount: '1 440,00 €', color: '#7b4dff' },
                      { label: 'Logiciels SaaS',  cat: 'Informatique',amount: '300,00 €',   color: '#00ffc2' },
                      { label: 'Assurance pro',   cat: 'Assurance',   amount: '320,00 €',   color: '#ff2d78' },
                      { label: 'Formation React', cat: 'Formation',   amount: '720,00 €',   color: '#caff00' },
                    ].map((r, i) => (
                      <div className="lp__mockup-row" key={i}>
                        <div className="lp__mockup-dot" style={{ background: r.color }} />
                        <div className="lp__mockup-row-info">
                          <strong>{r.label}</strong>
                          <small>{r.cat}</small>
                        </div>
                        <div className="lp__mockup-row-amount" style={{ color: r.color }}>{r.amount}</div>
                      </div>
                    ))}
                  </div>
                  <div className="lp__mockup-footer">
                    <div className="lp__mockup-footer-item">
                      <span className="lbl">Total HT</span>
                      <span className="val">3 080,00 €</span>
                    </div>
                    <div className="lp__mockup-footer-item">
                      <span className="lbl">TVA</span>
                      <span className="val" style={{ color: '#ff2d78' }}>525,90 €</span>
                    </div>
                    <div className="lp__mockup-footer-item">
                      <span className="lbl">Charges</span>
                      <span className="val" style={{ color: '#caff00' }}>10</span>
                    </div>
                  </div>
                </div>
                <div className="lp__chip lp__chip--1">📤 Export PDF généré</div>
                <div className="lp__chip lp__chip--2">📊 3 graphiques actifs</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp__section lp__section--alt" id="features">
          <div className="lp__container">
            <div className="lp__section-head">
              <div className="lp__section-badge"><span className="lp__badge">Fonctionnalités</span></div>
              <h2 className="lp__section-title">Tout pour gérer vos <span>charges</span></h2>
              <p className="lp__section-sub">Un outil complet pensé pour les professionnels et indépendants.</p>
            </div>
            <div className="lp__features-grid">
              {[
                { icon: '🧮', title: 'Calcul automatique', desc: 'HT, TVA et TTC calculés instantanément selon le taux applicable à chaque charge.' },
                { icon: '📊', title: 'Graphiques live', desc: 'Camembert, barres et courbe cumulative pour visualiser vos dépenses en temps réel.' },
                { icon: '📤', title: 'Export PDF', desc: 'Générez un rapport complet et professionnel de vos charges en un seul clic.' },
                { icon: '🗂️', title: 'Catégorisation', desc: 'Classez vos charges par catégorie : Immobilier, Informatique, Transport, Formation…' },
                { icon: '📅', title: 'Calendrier', desc: 'Suivez les dates d\'échéance de vos charges mensuelles et exceptionnelles.' },
                { icon: '🔍', title: 'Recherche & Filtres', desc: 'Retrouvez instantanément n\'importe quelle charge par mot-clé ou catégorie.' },
              ].map((f, i) => (
                <div className="lp__feature-card" key={i}>
                  <div className="lp__feature-icon">{f.icon}</div>
                  <h3 className="lp__feature-title">{f.title}</h3>
                  <p className="lp__feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="lp__section" id="stats">
          <div className="glow-orb glow-orb--purple" style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div className="lp__container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="lp__section-head">
              <div className="lp__section-badge"><span className="lp__badge">Performances</span></div>
              <h2 className="lp__section-title">Des données <span>précises</span>, toujours</h2>
            </div>
            <div className="lp__stats-grid">
              {[
                { value: '100%', label: 'TVA automatique' },
                { value: '< 1s', label: 'Génération PDF' },
                { value: '∞', label: 'Charges illimitées' },
                { value: '3', label: 'Types de graphiques' },
              ].map((s, i) => (
                <div className="lp__stat-card" key={i}>
                  <div className="lp__stat-value">{s.value}</div>
                  <div className="lp__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp__cta" id="cta">
          <div className="lp__cta-bg" />
          <div className="lp__cta-grid" />
          <div className="lp__container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="lp__badge" style={{ marginBottom: 24 }}>Prêt à démarrer ?</div>
            <h2 className="lp__cta-title">Pilotez vos charges<br /><span>dès maintenant</span></h2>
            <p className="lp__cta-sub">Aucune installation. Aucun compte requis.<br />Fonctionne directement dans votre navigateur.</p>
            <div className="lp__cta-actions">
              <button className="btn btn--acid btn--xl" onClick={() => navigate('/app')}>
                Ouvrir l'application →
              </button>
              <a href="#features" className="btn btn--ghost btn--xl">En savoir plus</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp__footer">
          <div className="lp__container">
            <div className="lp__footer-inner">
              <a className="lp__logo" href="#hero">
                <span className="lp__logo-mark">
                  <svg viewBox="0 0 18 18" fill="none" width="14" height="14">
                    <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" fill="#0a0a0f"/>
                    <path d="M9 5L13 7.5V12.5L9 15L5 12.5V7.5L9 5Z" fill="#0a0a0f"/>
                  </svg>
                </span>
                ChargeApp
              </a>
              <span className="lp__footer-copy">© 2026 — TOUS DROITS RÉSERVÉS</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
