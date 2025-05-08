'use client'
import React, { useState } from 'react';
import { Checkbox } from '../../components/componentsUI/ComponentForm';

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
}

const ProchainsTournoisTable: React.FC<ProchainsTournoisTableProps> = ({
  tournois,
  onSelectTournoi,
}) => {
  const [selectedTournoiId, setSelectedTournoiId] = useState<number | null>(null);
  const [etatFilter, setEtatFilter] = useState('');
  const [systemeFilter, setSystemeFilter] = useState('');
  const [publicFilter, setPublicFilter] = useState('');

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
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={etatFilter}
          onChange={e => setEtatFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tous les états</option>
          <option value="en_attente">En attente</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
        </select>

        <select
          value={systemeFilter}
          onChange={e => setSystemeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tous les systèmes</option>
          <option value="S">Élimination simple</option>
          <option value="D">Élimination double</option>
        </select>

        <select
          value={publicFilter}
          onChange={e => setPublicFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tous</option>
          <option value="true">Public</option>
          <option value="false">Privé</option>
        </select>
      </div>

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
                <td className="p-2 border">{t.id_categorie ?? '-'}</td>
                <td className="p-2 border">{t.id_grade_min ?? '-'}</td>
                <td className="p-2 border">{t.id_grade_max ?? '-'}</td>
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

const getSystemeLabel = (code?: string) => {
  switch (code) {
    case 'S':
      return 'Élimination simple';
    case 'D':
      return 'Élimination double';
    default:
      return '-';
  }
};

export default ProchainsTournoisTable;
