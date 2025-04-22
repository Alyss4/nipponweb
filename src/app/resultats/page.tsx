'use client';

import React, { useState } from 'react';

interface Resultat {
  club: string;
  paysClub: string; // Pays du club
  tournoi: string;
  lieu: string; // Lieu du tournoi
  date: string;  // Date du tournoi
  competiteurs: Competiteur[];
  vainqueur: string; // Nom du vainqueur
  scoreVainqueur: string; // Score du vainqueur
  finaliste: string; // Nom du finaliste
  scoreFinaliste: string; // Score du finaliste
}

interface Competiteur {
  nom: string;
  position: number;
  pays: string; // Pays du compétiteur
  score: string; // Score du compétiteur
}

export default function ResultatPage() {
  const [resultats, setResultats] = useState<Resultat[]>([
    {
      club: 'Club A',
      paysClub: 'France',
      tournoi: 'Tournoi 2025 - Open de Paris',
      lieu: 'Paris, France',
      date: '12 Mai 2025',
      competiteurs: [
        { nom: 'Jean Dupont', position: 1, pays: 'France', score: '15' },
        { nom: 'Michel Durant', position: 2, pays: 'France', score: '10' },
        { nom: 'Sophie Martin', position: 3, pays: 'France', score: '8' },
      ],
      vainqueur: 'Jean Dupont',
      scoreVainqueur: '15',
      finaliste: 'Michel Durant',
      scoreFinaliste: '10',
    },
    {
      club: 'Club B',
      paysClub: 'Japon',
      tournoi: 'Tournoi 2025 - Championnat National',
      lieu: 'Tokyo, Japon',
      date: '20 Juin 2025',
      competiteurs: [
        { nom: 'Alice Leblanc', position: 1, pays: 'France', score: '18' },
        { nom: 'Paul Renault', position: 2, pays: 'Japon', score: '12' },
        { nom: 'Lucas Girard', position: 3, pays: 'Belgique', score: '9' },
      ],
      vainqueur: 'Alice Leblanc',
      scoreVainqueur: '18',
      finaliste: 'Paul Renault',
      scoreFinaliste: '12',
    },
    {
      club: 'Club C',
      paysClub: 'Brésil',
      tournoi: 'Tournoi 2025 - Coupe Internationale',
      lieu: 'São Paulo, Brésil',
      date: '15 Juillet 2025',
      competiteurs: [
        { nom: 'Léa Bernard', position: 1, pays: 'Brésil', score: '20' },
        { nom: 'Julien Lefevre', position: 2, pays: 'France', score: '16' },
        { nom: 'Clara Lefevre', position: 3, pays: 'France', score: '14' },
      ],
      vainqueur: 'Léa Bernard',
      scoreVainqueur: '20',
      finaliste: 'Julien Lefevre',
      scoreFinaliste: '16',
    },
  ]);

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px' }}>
      <h2 className="text-center text-primary mb-4">Résultats des Tournois de Nippon Kempo</h2>

      {resultats.map((resultat, index) => (
        <div key={index} className="mb-5">
          <h3 className="text-primary">{resultat.club} - {resultat.tournoi}</h3>
          <p className="text-primary">
            <strong>Pays du Club :</strong> {resultat.paysClub} <br />
            <strong>Lieu :</strong> {resultat.lieu} <br />
            <strong>Date :</strong> {resultat.date}
          </p>

          {/* Résultats des Finalistes */}
          <h4 className="text-primary">Finalistes</h4>
          <div className="mb-3 text-primary">
            <p><strong>Vainqueur : </strong>{resultat.vainqueur} <strong>(Score : </strong>{resultat.scoreVainqueur}<strong>)</strong></p>
            <p><strong>Finaliste : </strong>{resultat.finaliste} <strong>(Score : </strong>{resultat.scoreFinaliste}<strong>)</strong></p>
          </div>

          {/* Tableau des compétiteurs */}
          <table className="table table-striped table-hover" style={{ borderRadius: '10px' }}>
            <thead className="table-light">
              <tr>
                <th>Position</th>
                <th>Nom du Compétiteur</th>
                <th>Pays du Compétiteur</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {resultat.competiteurs.map((competiteur, idx) => (
                <tr key={idx}>
                  <td>{competiteur.position}</td>
                  <td>{competiteur.nom}</td>
                  <td>{competiteur.pays}</td>
                  <td>{competiteur.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
