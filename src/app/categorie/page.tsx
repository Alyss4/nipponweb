'use client';

import React, { useState } from 'react';
import { Input, ButtonPrimaryy } from '../../components/ComponentForm';

export default function Categorie() {
  const [nom, setNom] = useState('');
  const [poidsMin, setPoidsMin] = useState('');
  const [poidsMax, setPoidsMax] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom || !poidsMin || !poidsMax || !age) {
      setErreur("Tous les champs sont obligatoires.");
      setMessage('');
      return;
    }

    if (parseFloat(poidsMin) > parseFloat(poidsMax)) {
      setErreur("Le poids minimum ne peut pas être supérieur au poids maximum.");
      setMessage('');
      return;
    }

    setErreur('');
    setMessage("Catégorie créée avec succès ✅");

    console.log({
      nom,
      poidsMin,
      poidsMax,
      age
    });

    // Réinitialisation du formulaire
    setNom('');
    setPoidsMin('');
    setPoidsMax('');
    setAge('');
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
        <Input
          label="Tranche d'âge"
          type="text"
          placeholder="Ex: 18-21 ans"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        {erreur && <p className="text-danger">{erreur}</p>}
        {message && <p className="text-success">{message}</p>}

        <div className="d-grid mt-3">
          <ButtonPrimaryy>Créer la catégorie</ButtonPrimaryy>
        </div>
      </form>
    </div>
  );
}
