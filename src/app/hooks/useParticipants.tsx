import { useState } from 'react';

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

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState<Participant>({
    nom: '',
    prenom: '',
    date_naissance: '',
    sexe: 'H',  // "genre" => "sexe"
    poids: undefined,
    id_club: undefined,
    id_grade: undefined,
    id_pays: undefined,
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
    const { nom, prenom, date_naissance, sexe, id_club, id_grade, id_pays } = newParticipant;
    console.log("Nouvel participant:", newParticipant); // Ajoute un log ici pour voir ce que tu obtiens
    if (nom && prenom && date_naissance && sexe && id_club && id_grade && id_pays) {
      console.log("Participant validé, ajout à la liste...");
      setParticipants((prev) => [...prev, newParticipant]);
      setNewParticipant({
        nom: '',
        prenom: '',
        date_naissance: '',
        sexe: 'H',
        poids: undefined,
        id_club: undefined,
        id_grade: undefined,
        id_pays: undefined,
      });
    } else {
      console.log("Champs manquants:", {
        nom,
        prenom,
        date_naissance,
        sexe,
        id_club,
        id_grade,
        id_pays,
      }); // Ajoute un log pour identifier quels champs sont vides
      alert('Veuillez remplir tous les champs.');
    }
  };
  

  return {
    participants,
    setParticipants,
    newParticipant,
    handleInputChange,
    handleAddParticipant,
  };
};
