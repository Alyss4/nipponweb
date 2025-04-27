'use client';

import React, { useState } from 'react';
import { Input, Checkbox, ButtonPrimaryy, Select } from '../../components/ComponentForm';

export default function Categorie() {
  const [nom, setNom] = useState('');
  const [poidsMin, setPoidsMin] = useState('');
  const [poidsMax, setPoidsMax] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [gradeMin, setGradeMin] = useState('');
  const [gradeMax, setGradeMax] = useState('');
  const [gradeMinRequired, setGradeMinRequired] = useState(false);
  const [gradeMaxRequired, setGradeMaxRequired] = useState(false);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !poidsMin || !poidsMax || !ageMin || !ageMax) {
      setErreur('Tous les champs sont obligatoires.');
      setMessage('');
      return;
    }
    if (parseFloat(poidsMin) > parseFloat(poidsMax)) {
      setErreur('Le poids minimum ne peut pas être supérieur au poids maximum.');
      setMessage('');
      return;
    }
    if ((gradeMinRequired && !gradeMin) || (gradeMaxRequired && !gradeMax)) {
      setErreur('Veuillez remplir les grades minimum ou maximum si requis.');
      setMessage('');
      return;
    }
    if (parseFloat(gradeMin) > parseFloat(gradeMax)) {
      setErreur('Le grade minimum ne peut pas être supérieur au grade maximum.');
      setMessage('');
      return;
    }
    setErreur('');
    setMessage('Catégorie créée avec succès ✅');
    console.log({
      nom,
      poidsMin,
      poidsMax,
      ageMin,
      ageMax,
      gradeMin,
      gradeMax
    });

    setNom('');
    setPoidsMin('');
    setPoidsMax('');
    setAgeMin('');
    setAgeMax('');
    setGradeMin('');
    setGradeMax('');
    setGradeMinRequired(false);
    setGradeMaxRequired(false);
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '50px' }}>
      <h2 className="text-center text-primary mb-4">Créer une catégorie</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom de la catégorie"
          type="text"
          placeholder="Ex: -66kg Juniors"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <Input
          label="Poids minimum (kg)"
          type="number"
          placeholder="Ex: 60"
          value={poidsMin}
          onChange={(e) => setPoidsMin(e.target.value)}
          required
        />
        <Input
          label="Poids maximum (kg)"
          type="number"
          placeholder="Ex: 66"
          value={poidsMax}
          onChange={(e) => setPoidsMax(e.target.value)}
          required
        />
        
        <div className="mb-3">
          <label htmlFor="ageMin" className="form-label text-dark fw-bold">Tranche d'âge</label>
          <div className="d-flex justify-content-between">
            <input
              type="number"
              className="form-control"
              id="ageMin"
              placeholder="Ex: 18"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              required
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--text-primary)',
                borderRadius: '5px',
              }}
            />
            <span>-</span>
            <input
              type="number"
              className="form-control"
              id="ageMax"
              placeholder="Ex: 21"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              required
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--text-primary)',
                borderRadius: '5px',
              }}
            />
          </div>
        </div>

        <Checkbox
          label="Le grade minimum est requis"
          checked={gradeMinRequired}
          onChange={(e) => setGradeMinRequired(e.target.checked)}
        />
        <Checkbox
          label="Le grade maximum est requis"
          checked={gradeMaxRequired}
          onChange={(e) => setGradeMaxRequired(e.target.checked)}
        />

        {gradeMinRequired && (
          <div className="mb-3 grade-fields-container show">
            <Select
              label="Grade minimum"
              value={gradeMin}
              onChange={(e) => setGradeMin(e.target.value)}
              options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
            />
          </div>
        )}

        {gradeMaxRequired && (
          <div className="mb-3 grade-fields-container show">
            <Select
              label="Grade maximum"
              value={gradeMax}
              onChange={(e) => setGradeMax(e.target.value)}
              options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
            />
          </div>
        )}

        {erreur && <p className="text-danger">{erreur}</p>}
        {message && <p className="text-success">{message}</p>}

        <div className="d-grid mt-3">
          <ButtonPrimaryy>Créer la catégorie</ButtonPrimaryy>
        </div>
      </form>
    </div>
  );
}
