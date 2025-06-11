'use client';

import React, { useState } from 'react';

interface Competiteur {
  nom: string;
  position: number;
  pays: string;
}

interface Classement {
  club: string;
  paysClub: string;
  tournoi: string;
  lieu: string; 
  date: string;  
  competiteurs: Competiteur[];
}

export default function ClassementPage() {
  const [classements, setClassements] = useState<Classement[]>([
    {
      club: 'Club A',
      paysClub: 'France',
      tournoi: 'Tournoi 2025 - Open de Paris',
      lieu: 'Paris, France',
      date: '12 Mai 2025',
      competiteurs: [
        { nom: 'Jean Dupont', position: 1, pays: 'France' },
        { nom: 'Michel Durant', position: 2, pays: 'France' },
        { nom: 'Sophie Martin', position: 3, pays: 'France' },
      ],
    },
    {
      club: 'Club B',
      paysClub: 'Japon',
      tournoi: 'Tournoi 2025 - Championnat National',
      lieu: 'Tokyo, Japon',
      date: '20 Juin 2025',
      competiteurs: [
        { nom: 'Alice Leblanc', position: 1, pays: 'France' },
        { nom: 'Paul Renault', position: 2, pays: 'Japon' },
        { nom: 'Lucas Girard', position: 3, pays: 'Belgique' },
      ],
    },
    {
      club: 'Club C',
      paysClub: 'Brésil',
      tournoi: 'Tournoi 2025 - Coupe Internationale',
      lieu: 'São Paulo, Brésil',
      date: '15 Juillet 2025',
      competiteurs: [
        { nom: 'Léa Bernard', position: 1, pays: 'Brésil' },
        { nom: 'Julien Lefevre', position: 2, pays: 'France' },
        { nom: 'Clara Lefevre', position: 3, pays: 'France' },
      ],
    },
  ]);

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px' }}>
      <h2 className="text-center text-o-primary mb-4">Classements des Tournois de Nippon Kempo</h2>

      {classements.map((classement, index) => (
        <div key={index} className="mb-5">
          <h3 className='text-o-primary'>{classement.club} - {classement.tournoi}</h3>
          <p className="text-o-primary">
            <strong>Pays du Club :</strong> {classement.paysClub} <br />
            <strong>Lieu :</strong> {classement.lieu} <br />
            <strong>Date :</strong> {classement.date}
          </p>
          <table className="table table-striped table-hover" style={{ borderRadius: '10px' }}>
            <thead className="table-light">
              <tr>
                <th>Position</th>
                <th>Nom du Compétiteur</th>
                <th>Pays du Compétiteur</th>
              </tr>
            </thead>
            <tbody>
              {classement.competiteurs.map((competiteur, idx) => (
                <tr key={idx}>
                  <td>{competiteur.position}</td>
                  <td>{competiteur.nom}</td>
                  <td>{competiteur.pays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
