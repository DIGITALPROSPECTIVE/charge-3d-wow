import React from 'react';
import { Charge } from '../types/charge';
import { formatCurrency } from '../utils/chargeUtils';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';

interface ChargeChartsProps {
  charges: Charge[];
}

const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fb923c', '#facc15', '#818cf8'];

const ChargeCharts: React.FC<ChargeChartsProps> = ({ charges }) => {
  if (charges.length === 0) return null;

  // Données par catégorie (Pie)
  const byCategory = Object.values(
    charges.reduce((acc, c) => {
      if (!acc[c.categorie]) acc[c.categorie] = { name: c.categorie, value: 0 };
      acc[c.categorie].value += c.montantTTC;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  // Données par mois (Bar)
  const byMonth = Object.values(
    charges.reduce((acc, c) => {
      const month = new Date(c.dateCreation).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      if (!acc[month]) acc[month] = { month, HT: 0, TVA: 0, TTC: 0 };
      acc[month].HT += c.montantHT;
      acc[month].TVA += c.montantTVA;
      acc[month].TTC += c.montantTTC;
      return acc;
    }, {} as Record<string, { month: string; HT: number; TVA: number; TTC: number }>)
  ).map(d => ({
    ...d,
    HT: Math.round(d.HT * 100) / 100,
    TVA: Math.round(d.TVA * 100) / 100,
    TTC: Math.round(d.TTC * 100) / 100,
  }));

  // Données cumulées (Line)
  const cumulative = [...charges]
    .sort((a, b) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime())
    .reduce((acc, c, i) => {
      const prev = acc[i - 1]?.total ?? 0;
      acc.push({
        name: new Date(c.dateCreation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        total: Math.round((prev + c.montantTTC) * 100) / 100,
      });
      return acc;
    }, [] as { name: string; total: number }[]);

  const tooltipStyle = {
    backgroundColor: 'rgba(30,20,60,0.95)',
    border: '1px solid rgba(167,139,250,0.4)',
    borderRadius: '8px',
    color: '#fff',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-bold text-center opacity-90">📊 Graphiques</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie — répartition par catégorie */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-white/80 text-sm font-semibold mb-3">Répartition par catégorie (TTC)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar — HT / TVA / TTC par mois */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-white/80 text-sm font-semibold mb-3">HT / TVA / TTC par mois</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byMonth} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#fff', fontSize: 11 }} />
              <YAxis tick={{ fill: '#fff', fontSize: 11 }} tickFormatter={(v) => `${v}€`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ color: '#fff', fontSize: 12 }} />
              <Bar dataKey="HT" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TVA" fill="#f472b6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TTC" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line — cumul TTC dans le temps */}
        <div className="glass-card rounded-xl p-4 lg:col-span-2">
          <h3 className="text-white/80 text-sm font-semibold mb-3">Cumul TTC dans le temps</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cumulative} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 11 }} />
              <YAxis tick={{ fill: '#fff', fontSize: 11 }} tickFormatter={(v) => `${v}€`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Line type="monotone" dataKey="total" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default ChargeCharts;
