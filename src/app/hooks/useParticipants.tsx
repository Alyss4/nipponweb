import { useState } from 'react';

interface Participant {
  nom: string;
  prenom: string;
  club: string;
  grade: string;
  genre: string;
  dateInscription: string;
}

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState<Participant>({
    nom: '',
    prenom: '',
    club: '',
    grade: '',
    genre: '',
    dateInscription: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value, dataset } = e.target;
    const field = dataset.field;
    if (field) {
      setNewParticipant((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddParticipant = () => {
    const { nom, prenom, club, grade, genre, dateInscription } = newParticipant;
    if (nom && prenom && club && grade && genre && dateInscription) {
      setParticipants((prev) => [...prev, newParticipant]);
      setNewParticipant({
        nom: '',
        prenom: '',
        club: '',
        grade: '',
        genre: '',
        dateInscription: '',
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  };

  return {
    participants,
    newParticipant,
    handleInputChange,
    handleAddParticipant,
  };
};
