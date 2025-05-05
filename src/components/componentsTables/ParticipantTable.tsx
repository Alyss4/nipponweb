import React from 'react';

interface Participant {
  nom: string;
  prenom: string;
  club: string;
  grade: string;
  genre: string;
  dateInscription: string;
}

interface ParticipantTableProps {
  participants: Participant[];
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants }) => {
  return (
    <table className="table table-striped mt-5">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Club</th>
          <th>Grade</th>
          <th>Genre</th>
          <th>Date d'inscription</th>
        </tr>
      </thead>
      <tbody>
        {participants.map((p, i) => (
          <tr key={i}>
            <td>{p.nom}</td>
            <td>{p.prenom}</td>
            <td>{p.club}</td>
            <td>{p.grade}</td>
            <td>{p.genre}</td>
            <td>{p.dateInscription}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ParticipantTable;
