import React, { useState } from 'react';
import { Checkbox } from '../../components/componentsUI/ComponentForm';

interface Resultat {
  id: number;
  nom_competiteur_1: string;
  nom_competiteur_2: string;
  score_1: number;
  score_2: number;
  date: string;
  etat: 'en_cours' | 'termine';
  penalites_1: string;
  penalites_2: string;
  details?: string;
}

interface ResultatVueEnsembleTableProps {
  resultats: Resultat[];
  onSelectResultat: (resultat: Resultat | null) => void;
}

const ResultatVueEnsembleTable: React.FC<ResultatVueEnsembleTableProps> = ({ resultats, onSelectResultat }) => {
  const [selectedResultatId, setSelectedResultatId] = useState<number | null>(null);

  const handleCheckboxChange = (id: number) => {
    if (selectedResultatId === id) {
      setSelectedResultatId(null);
      onSelectResultat(null);
    } else {
      setSelectedResultatId(id);
      const selectedResultat = resultats.find(r => r.id === id);
      if (selectedResultat) {
        onSelectResultat(selectedResultat);
      }
    }
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Action</th>
          <th>Compétiteur 1</th>
          <th>Compétiteur 2</th>
          <th>Date</th>
          <th>Score</th>
          <th>État</th>
          <th>Pénalités</th>
        </tr>
      </thead>
      <tbody>
        {resultats.map((r) => (
          <tr key={r.id} className="cursor-pointer">
            <td>
              <Checkbox
                label=""
                checked={selectedResultatId === r.id}
                onChange={() => handleCheckboxChange(r.id)}
              />
            </td>
            <td>{r.nom_competiteur_1}</td>
            <td>{r.nom_competiteur_2}</td>
            <td>{r.date}</td>
            <td>{`${r.score_1} - ${r.score_2}`}</td>
            <td>{r.etat === 'en_cours' ? 'En cours' : 'Terminé'}</td>
            <td>{`${r.penalites_1} / ${r.penalites_2}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultatVueEnsembleTable;
