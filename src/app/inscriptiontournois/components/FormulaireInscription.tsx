'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Select, Input, ButtonPrimaryy } from '../../../components/ui/ComponentForm';
import {
  validerFormulaire,
  soumettreFormulaire,
  fetchClub,
  fetchGrades,
  fetchPays
} from './logic';
import { Grade, Pays, Club } from './gestionParticipants/types';

const FormulaireInscription: React.FC = () => {
  const searchParams = useSearchParams();  
  const idTournoi = searchParams.get('id');  
  const tournamentId = idTournoi ? parseInt(idTournoi, 10) : null;
  if (tournamentId === null) {
    return <div>Chargement...</div>;
  }

  const [newParticipant, setNewParticipant] = useState({
    prenom: '',
    nom: '',
    date_naissance: '',
    sexe: '',
    poids: '',
    id_pays: '',
    id_club: '',
    id_grade: '',
  });

  const [grades, setGrades] = useState<Grade[]>([]);
  const [pays, setPays] = useState<Pays[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGrades(setGrades);
    fetchPays(setPays);
    fetchClub(setClubs);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = e.target.getAttribute('data-field');
    if (field) {
      setNewParticipant((prev) => ({ ...prev, [field]: e.target.value }));
    }
};


const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const transformedSexe = newParticipant.sexe === 'femme' ? 'F' : 'H';

  const formData = {
    ...newParticipant,
    sexe: transformedSexe, 
    id_tournoi: tournamentId,
    id_utilisateur: localStorage.getItem('userId'),
  };

  console.log('Form data:', formData); 

  const validationResult = validerFormulaire(formData);
  if (!validationResult.isValid) {
      setMessage(validationResult.message);
      return;
  }

  const submissionResult = await soumettreFormulaire(formData);
  setMessage(submissionResult.message);
};



  const sexeOptions = [
    { value: 'homme', label: 'Homme' },
    { value: 'femme', label: 'Femme' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h3>Formulaire d'inscription</h3>

      {message && <p>{message}</p>}

      <Input
        label="Prénom"
        type="text"
        placeholder="Entrez votre prénom"
        value={newParticipant.prenom}
        onChange={handleInputChange}
        data-field="prenom"
        required
      />

      <Input
        label="Nom"
        type="text"
        placeholder="Entrez votre nom"
        value={newParticipant.nom}
        onChange={handleInputChange}
        data-field="nom"
        required
      />

      <Input
        label="Date de naissance"
        type="date"
        placeholder=""
        value={newParticipant.date_naissance}
        onChange={handleInputChange}
        data-field="date_naissance"
        required
      />

      <Select
        label="Sexe"
        value={newParticipant.sexe}
        onChange={handleInputChange}
        data-field="sexe"
        options={sexeOptions}
        required
      />

      <Input
        label="Poids (kg)"
        type="number"
        placeholder="Entrez votre poids"
        value={newParticipant.poids}
        onChange={handleInputChange}
        data-field="poids"
        required
      />

      <Select
        label="Pays"
        value={newParticipant.id_pays}
        onChange={handleInputChange}
        data-field="id_pays"
        options={pays.map((p) => ({
          value: p.id.toString(),
          label: `${p.drapeau_emoji ?? ''} ${p.nom}`,
        }))}
        required
      />

      <Select
        label="Club"
        value={newParticipant.id_club}
        onChange={handleInputChange}
        data-field="id_club"
        options={clubs.map((club) => ({
          value: club.id.toString(),
          label: club.nom ?? 'Sans nom',
        }))}
        required
      />

      <Select
        label="Grade"
        value={newParticipant.id_grade}
        onChange={handleInputChange}
        data-field="id_grade"
        options={grades.map((g) => ({
          value: g.id.toString(),
          label: g.nom,
        }))}
        required
      />

      <ButtonPrimaryy type="submit" className="w-100">
        S'inscrire
      </ButtonPrimaryy>
    </form>
  );
};

export default FormulaireInscription;
