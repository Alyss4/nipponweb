import React from 'react';

interface DetailsResultatProps {
  resultat: {
    nom_competiteur_1: string;
    nom_competiteur_2: string;
    score_1: number;
    score_2: number;
    date: string;
    penalites_1: string;
    penalites_2: string;
    rounds: {
      round: number;
      score_1: number;
      score_2: number;
    }[];
    commentaires?: string;
    decision_juges?: string;
  };
  onClose: () => void;
}

const DetailsResultatTable: React.FC<DetailsResultatProps> = ({ resultat, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>X</button>
        <h3>Détails du Match</h3>
        <p><strong>Compétiteur 1:</strong> {resultat.nom_competiteur_1}</p>
        <p><strong>Compétiteur 2:</strong> {resultat.nom_competiteur_2}</p>
        <p><strong>Date:</strong> {resultat.date}</p>
        <p><strong>Score:</strong> {resultat.score_1} - {resultat.score_2}</p>
        <p><strong>Pénalités:</strong> {resultat.penalites_1} / {resultat.penalites_2}</p>

        <h4>Résultats par Round</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Round</th>
              <th>Score 1</th>
              <th>Score 2</th>
            </tr>
          </thead>
          <tbody>
            {resultat.rounds.map((r, index) => (
              <tr key={index}>
                <td>{r.round}</td>
                <td>{r.score_1}</td>
                <td>{r.score_2}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {resultat.commentaires && (
          <div>
            <h4>Commentaires</h4>
            <p>{resultat.commentaires}</p>
          </div>
        )}

        {resultat.decision_juges && (
          <div>
            <h4>Décision des Juges</h4>
            <p>{resultat.decision_juges}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsResultatTable;
