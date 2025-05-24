'use client';
import React, { useState } from 'react';
import { Checkbox, Select } from '../ui/ComponentForm';

interface Tournoi {
  id: number;
  id_categorie?: number;
  id_grade_min?: number;
  id_grade_max?: number;
  systemeElimination?: string;
  lieu?: string;
  date?: string;
  nom?: string;
  etat?: 'en_attente' | 'en_cours' | 'termine';
  created_at?: string;
  updated_at?: string;
  id_utilisateur?: number;
  nombre_poules?: number;
  nombre_participants?: number;
  description?: string;
  is_public?: boolean | number;
}

interface ProchainsTournoisTableProps {
  tournois: Tournoi[];
  onSelectTournoi: (tournoi: Tournoi | null) => void;
  idUtilisateurCourant: number;
  hideInscrits: boolean;
  showNonInscrits: boolean;
  sortByDate: string | null;
  etatGlobal: string | null;
  setHideInscrits: (v: boolean) => void;
  setShowNonInscrits: (v: boolean) => void;
  setSortByDate: (v: string) => void;
  setEtatGlobal: (v: string) => void;
  grades: { id: number; nom: string }[];
  categories: { id: number; nom: string }[];
}

const ProchainsTournoisTable: React.FC<ProchainsTournoisTableProps> = ({
  tournois,
  onSelectTournoi,
  idUtilisateurCourant,
  hideInscrits,
  showNonInscrits,
  sortByDate,
  etatGlobal,
  setHideInscrits,
  setShowNonInscrits,
  setSortByDate,
  setEtatGlobal,
  grades,
  categories
}) => {
  const [selectedTournoiId, setSelectedTournoiId] = useState<number | null>(null);
  const [etatFilter, setEtatFilter] = useState('');
  const [systemeFilter, setSystemeFilter] = useState('');
  const [publicFilter, setPublicFilter] = useState('');
  const [afficherFiltres, setAfficherFiltres] = useState(true);

  const handleCheckboxChange = (id: number) => {
    if (selectedTournoiId === id) {
      setSelectedTournoiId(null);
      onSelectTournoi(null);
    } else {
      setSelectedTournoiId(id);
      const selected = tournois.find(t => t.id === id);
      if (selected) onSelectTournoi(selected);
    }
  };

  const filteredTournois = tournois.filter(t => {
    const matchEtat = etatFilter === '' || t.etat === etatFilter;
    const matchSysteme = systemeFilter === '' || t.systemeElimination === systemeFilter;
    const matchPublic = publicFilter === '' || String(!!t.is_public) === publicFilter;
    return matchEtat && matchSysteme && matchPublic;
  });

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Checkbox
          label="Afficher les filtres"
          checked={afficherFiltres}
          onChange={(e) => setAfficherFiltres(e.target.checked)}
        />
      </div>

      {afficherFiltres && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-end',
          marginBottom: '16px',
        }}>
          <Select
            label="État"
            value={etatFilter}
            onChange={(e) => setEtatFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous les états' },
              { value: 'en_attente', label: 'En attente' },
              { value: 'en_cours', label: 'En cours' },
              { value: 'termine', label: 'Terminé' },
            ]}
          />
          <Select
            label="Système"
            value={systemeFilter}
            onChange={(e) => setSystemeFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous les systèmes' },
              { value: 'S', label: 'Élimination simple' },
              { value: 'D', label: 'Élimination double' },
            ]}
          />
          <Select
            label="Accès"
            value={publicFilter}
            onChange={(e) => setPublicFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous' },
              { value: 'true', label: 'Public' },
              { value: 'false', label: 'Privé' },
            ]}
          />
          <Select
            label="Trier par date"
            value={sortByDate || ''}
            onChange={(e) => setSortByDate(e.target.value)}
            options={[
              { value: '', label: 'Trier par date' },
              { value: 'asc', label: 'Croissant' },
              { value: 'desc', label: 'Décroissant' },
            ]}
          />
          <Select
            label="Filtrer par statut"
            value={etatGlobal || ''}
            onChange={(e) => setEtatGlobal(e.target.value)}
            options={[
              { value: '', label: 'Tous les statuts' },
              { value: 'en_attente', label: 'En attente' },
              { value: 'en_cours', label: 'En cours' },
              { value: 'termine', label: 'Terminé' },
            ]}
          />
          <div>
            <Checkbox
              label="Masquer les tournois où je suis inscrit"
              checked={hideInscrits}
              onChange={(e) => setHideInscrits(e.target.checked)}
            />
            <Checkbox
              label="Afficher les tournois sans mon inscription"
              checked={showNonInscrits}
              onChange={(e) => setShowNonInscrits(e.target.checked)}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-o-primary bg-white border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Lieu</th>
              <th className="p-2 border">Système</th>
              <th className="p-2 border">Catégorie</th>
              <th className="p-2 border">Grade min</th>
              <th className="p-2 border">Grade max</th>
              <th className="p-2 border">Participants</th>
              <th className="p-2 border">Poules</th>
              <th className="p-2 border">État</th>
              <th className="p-2 border">Public</th>
            </tr>
          </thead>
          <tbody>
            {filteredTournois.map(t => (
              <tr
                key={t.id}
                className={`hover:bg-gray-50 ${selectedTournoiId === t.id ? 'bg-blue-50' : ''}`}
              >
                <td className="p-2 border text-center">
                  <Checkbox
                    label=""
                    checked={selectedTournoiId === t.id}
                    onChange={() => handleCheckboxChange(t.id)}
                  />
                </td>
                <td className="p-2 border">{t.nom || '-'}</td>
                <td className="p-2 border">{t.date || '-'}</td>
                <td className="p-2 border">{t.lieu || '-'}</td>
                <td className="p-2 border">{getSystemeLabel(t.systemeElimination)}</td>
                <td className="p-2 border">
                  {t.id_categorie} — {categories.find(c => c.id === t.id_categorie)?.nom ?? '⚠️ Non trouvé'}
                </td>

                <td className="p-2 border">
                  {grades.find(g => g.id === t.id_grade_min)?.nom ?? '-'}
                </td>
                <td className="p-2 border">
                  {grades.find(g => g.id === t.id_grade_max)?.nom ?? '-'}
                </td>
                <td className="p-2 border">{t.nombre_participants ?? 0}</td>
                <td className="p-2 border">{t.nombre_poules ?? '-'}</td>
                <td className="p-2 border">{getEtatLabel(t.etat)}</td>
                <td className="p-2 border">{t.is_public ? 'Oui' : 'Non'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getEtatLabel = (etat?: string) => {
  switch (etat) {
    case 'en_attente':
      return 'En attente';
    case 'en_cours':
      return 'En cours';
    case 'termine':
      return 'Terminé';
    default:
      return '-';
  }
};

const getSystemeLabel = (value?: string) => {
  switch (value?.toLowerCase()) {
    case 'poule':
      return 'Poules';
    case 'elimination directe':
      return 'Élimination directe';
    case 'double elimination':
      return 'Double élimination';
    case 'tableau final':
      return 'Tableau final';
    case 'round robin':
      return 'Round Robin';
    case 'système suisse':
      return 'Système suisse';
    default:
      return value ?? '-';
  }
};


export default ProchainsTournoisTable;
