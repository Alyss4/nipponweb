'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Input, Select, Radio, Checkbox, ButtonPrimaryy } from '../ComponentForm';

const TournoiAPrevoirForm: React.FC = () => {
  const [nom, setNom] = useState('');
  const [grade, setGrade] = useState('');
  const [date, setDate] = useState('');
  const [importType, setImportType] = useState('');
  const [genre, setGenre] = useState('');
  const [systeme, setSysteme] = useState('');
  const [message, setMessage] = useState('');
  const [reglement, setReglement] = useState('');
  const [lieu, setLieu] = useState('');
  const [showReglement, setShowReglement] = useState(false);
  const [showLieu, setShowLieu] = useState(false);
  const [participantsLimit, setParticipantsLimit] = useState('');
  const [inscriptionMode, setInscriptionMode] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [sponsor, setSponsor] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log({
      nom,
      grade,
      date,
      importType,
      genre,
      systeme,
      reglement,
      lieu,
      participantsLimit,
      inscriptionMode,
      registrationDeadline,
      sponsor,
    });

    setMessage('Tournoi ajouté avec succès ✅');
    resetForm();
  };

  const resetForm = () => {
    setNom('');
    setGrade('');
    setDate('');
    setImportType('');
    setGenre('');
    setSysteme('');
    setReglement('');
    setLieu('');
    setParticipantsLimit('');
    setInscriptionMode('');
    setRegistrationDeadline('');
    setSponsor('');
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <h2 className="text-center text-primary mb-4">Ajouter un tournoi</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom du tournoi"
          type="text"
          placeholder="Entrez le nom du tournoi"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Select
          label="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          options={[
            '',
            'Ceinture blanche',
            'Ceinture jaune',
            'Ceinture orange',
            'Ceinture verte',
            'Ceinture bleue',
            'Ceinture marron',
            'Ceinture noire 1ere dan',
            'Ceinture noire 2eme dan',
            'Ceinture noire 3eme dan',
            'Ceinture noire 4eme dan',
            'Ceinture noire 5eme dan',
            'Ceinture noire 6eme dan',
          ]}
        />

        <Input
          label="Date du tournoi"
          type="date"
          placeholder="Date du tournoi"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Select
          label="Importation des participants"
          value={importType}
          onChange={(e) => setImportType(e.target.value)}
          options={['', 'Manuellement', 'Automatiquement']}
        />

        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Genre</label>
          <Radio
            label="Homme"
            name="genre"
            checked={genre === 'Homme'}
            onChange={() => setGenre('Homme')}
          />
          <Radio
            label="Femme"
            name="genre"
            checked={genre === 'Femme'}
            onChange={() => setGenre('Femme')}
          />
          <Radio
            label="Mixte"
            name="genre"
            checked={genre === 'Mixte'}
            onChange={() => setGenre('Mixte')}
          />
        </div>

        <Select
          label="Système d’élimination"
          value={systeme}
          onChange={(e) => setSysteme(e.target.value)}
          options={['', 'Poule', 'Élimination directe']}
        />

        <Input
          label="Limite de participants"
          type="number"
          placeholder="Nombre maximum de participants"
          value={participantsLimit}
          onChange={(e) => setParticipantsLimit(e.target.value)}
        />

        <Select
          label="Mode d’inscription"
          value={inscriptionMode}
          onChange={(e) => setInscriptionMode(e.target.value)}
          options={['', 'En ligne', 'Sur place']}
        />

        <Input
          placeholder='Date limite'
          label="Date limite d'inscription"
          type="date"
          value={registrationDeadline}
          onChange={(e) => setRegistrationDeadline(e.target.value)}
        />

        <Input
          label="Sponsor du tournoi"
          type="text"
          placeholder="Nom du sponsor"
          value={sponsor}
          onChange={(e) => setSponsor(e.target.value)}
        />

        <Checkbox
          label="Ajouter un règlement"
          checked={showReglement}
          onChange={() => setShowReglement(!showReglement)}
        />
        {showReglement && (
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Règlement du tournoi</label>
            <textarea
              className="form-control"
              rows={5}
              value={reglement}
              onChange={(e) => setReglement(e.target.value)}
              placeholder="Rédigez le règlement du tournoi ici..."
            />
          </div>
        )}

        <Checkbox
          label="Ajouter un lieu"
          checked={showLieu}
          onChange={() => setShowLieu(!showLieu)}
        />
        {showLieu && (
          <Select
            label="Lieu du tournoi"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            options={['', 'Dojo Central', 'Salle Omnisports', 'Salle de la ville']}
          />
        )}

        {message && <p className="text-success">{message}</p>}

        <div className="d-grid mt-3">
          <ButtonPrimaryy>Ajouter le tournoi</ButtonPrimaryy>
        </div>
      </form>
    </div>
  );
};

export default TournoiAPrevoirForm;
