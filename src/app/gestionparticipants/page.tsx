'use client';

import React, { useState } from 'react';
import { Input, Select, Radio, ButtonPrimaryy, ButtonSecondaryy } from '../../components/ComponentForm';

interface Participant {
  nom: string;
  prenom: string;
  club: string;
  grade: string;
  genre: string;
  dateInscription: string;
}

export default function GestionParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      nom: 'Dupont',
      prenom: 'Jean',
      club: 'Club A',
      grade: 'Ceinture noire 1ere dan',
      genre: 'Homme',
      dateInscription: '2025-05-12',
    },
    {
      nom: 'Leblanc',
      prenom: 'Alice',
      club: 'Club B',
      grade: 'Ceinture bleue',
      genre: 'Femme',
      dateInscription: '2025-06-20',
    },
    {
      nom: 'Lefevre',
      prenom: 'Julien',
      club: 'Club C',
      grade: 'Ceinture noire 2eme dan',
      genre: 'Homme',
      dateInscription: '2025-07-15',
    },
  ]);

  const [importType, setImportType] = useState<'CSV' | 'Manuellement'>('Manuellement');
  const [newParticipant, setNewParticipant] = useState<Participant>({
    nom: '',
    prenom: '',
    club: '',
    grade: '',
    genre: '',
    dateInscription: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewParticipant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddParticipant = () => {
    if (
      newParticipant.nom &&
      newParticipant.prenom &&
      newParticipant.club &&
      newParticipant.grade &&
      newParticipant.genre &&
      newParticipant.dateInscription
    ) {
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
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const lines = text.split('\n');
        const newParticipants = lines.map((line) => {
          const [nom, prenom, club, grade, genre, dateInscription] = line.split(',');
          return { nom, prenom, club, grade, genre, dateInscription } as Participant;
        });
        setParticipants((prev) => [...prev, ...newParticipants]);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px' }}>
      <h2 className="text-center text-primary mb-4">Gestion des Participants</h2>
      <div className="mb-3">
        <label className="form-label">Choisissez une méthode d'importation</label>
        <div className="d-flex">
          <Radio
            label="Importer par CSV"
            name="importType"
            checked={importType === 'CSV'}
            onChange={() => setImportType('CSV')}
          />
          <Radio
            label="Saisir manuellement"
            name="importType"
            checked={importType === 'Manuellement'}
            onChange={() => setImportType('Manuellement')}
          />
        </div>
      </div>
      {importType === 'Manuellement' && (
        <div className="mb-5">
          <h4>Ajouter un participant</h4>
          <div className="row g-2">
            <div className="col-md-4">
              <Input
                label="Nom"
                type="text"
                placeholder="Nom"
                value={newParticipant.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <Input
                label="Prénom"
                type="text"
                placeholder="Prénom"
                value={newParticipant.prenom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <Input
                label="Club"
                type="text"
                placeholder="Club"
                value={newParticipant.club}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <Input
                label="Grade"
                type="text"
                placeholder="Grade"
                value={newParticipant.grade}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <Select
                label="Genre"
                value={newParticipant.genre}
                onChange={handleInputChange}
                options={['', 'Homme', 'Femme']}
              />
            </div>
            <div className="col-md-4">
              <Input
                label="Date d'Inscription"
                type="date"
                placeholder=""
                value={newParticipant.dateInscription}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <ButtonSecondaryy>
              <span onClick={handleAddParticipant}>Ajouter</span>
            </ButtonSecondaryy>
          </div>
        </div>
      )}

      {importType === 'CSV' && (
        <div className="mb-5">
          <h4>Importer un fichier CSV</h4>
          <Input
            label="Choisir un fichier CSV"
            type="file"
            placeholder=""
            value=""
            onChange={handleCSVImport}
          />
          <p className="text-muted mt-2">Le CSV doit contenir : nom, prénom, club, grade, genre, dateInscription</p>
        </div>
      )}

      <table className="table table-striped table-hover mt-5" style={{ borderRadius: '10px' }}>
        <thead className="table-light">
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Club</th>
            <th>Grade</th>
            <th>Genre</th>
            <th>Date d'Inscription</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, index) => (
            <tr key={index}>
              <td>{participant.nom}</td>
              <td>{participant.prenom}</td>
              <td>{participant.club}</td>
              <td>{participant.grade}</td>
              <td>{participant.genre}</td>
              <td>{participant.dateInscription}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
