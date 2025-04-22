'use client';

import React, { useState } from 'react';
import { Input, Select, Radio, ButtonPrimaryy } from '../../components/ComponentForm';

export default function tournois() {
  const [nom, setNom] = useState('');
  const [grade, setGrade] = useState('');
  const [date, setDate] = useState('');
  const [importType, setImportType] = useState('');
  const [genre, setGenre] = useState('');
  const [systeme, setSysteme] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      nom,
      grade,
      date,
      importType,
      genre,
      systeme,
    });

    setMessage('Tournoi ajouté avec succès ✅');

    setNom('');
    setGrade('');
    setDate('');
    setImportType('');
    setGenre('');
    setSysteme('');
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
          placeholder=""
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

        {message && <p className="text-success">{message}</p>}

        <div className="d-grid mt-3">
          <ButtonPrimaryy>Ajouter le tournoi</ButtonPrimaryy>
        </div>
      </form>
    </div>
  );
}