import React from 'react';

interface Participant {
  id?: number;
  prenom: string;
  nom: string;
  date_naissance: string;
  sexe: 'H' | 'F';
  poids?: number;
  id_club?: number;
  id_grade?: number;
  id_pays?: number;
  inscription_status?: 'pending' | 'successful' | 'failed';
  created_at?: string;
  updated_at?: string;
}

interface ParticipantTableProps {
  participants: Participant[];
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants }) => (
  <table className="table table-striped mt-5">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Prénom</th>
        <th>Club</th>
        <th>Grade</th>
        <th>Genre</th>
        <th>Poids</th>
        <th>Date de naissance</th>
        <th>Date d'inscription</th>
      </tr>
    </thead>
    <tbody>
      {participants.map((p, i) => (
        <tr key={i}>
          <td>{p.nom}</td>
          <td>{p.prenom}</td>
          <td>{p.id_club}</td>
          <td>{p.id_grade}</td>
          <td>{p.sexe}</td>
          <td>{p.poids}</td> 
          <td>{p.date_naissance}</td>
          <td>{p.created_at}</td>
        </tr>
      ))}
    </tbody>
  </table>
);


export default ParticipantTable;
