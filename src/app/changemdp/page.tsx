'use client';

import React, { useState } from 'react';
import { Input, Checkbox, ButtonPrimaryy, Select } from '../../components/ui/ComponentForm';
export default function ChangeMdp() {
  const [email, setEmail] = useState('');
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nouveauMotDePasse !== confirmation) {
      setErreur("Les nouveaux mots de passe ne correspondent pas.");
      setMessage('');
      return;
    }

    if (!email) {
      setErreur("L'email est requis.");
      setMessage('');
      return;
    }

    setErreur('');
    setMessage("Mot de passe changé avec succès !");
    
    // Réinitialiser les champs
    setEmail('');
    setAncienMotDePasse('');
    setNouveauMotDePasse('');
    setConfirmation('');
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="text-center text-o-primary mb-4">Changer le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Ancien mot de passe"
          type="password"
          placeholder="Entrez l'ancien mot de passe"
          value={ancienMotDePasse}
          onChange={(e) => setAncienMotDePasse(e.target.value)}
          required
        />
        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="Entrez le nouveau mot de passe"
          value={nouveauMotDePasse}
          onChange={(e) => setNouveauMotDePasse(e.target.value)}
          required
        />
        <Input
          label="Confirmation"
          type="password"
          placeholder="Confirmez le nouveau mot de passe"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required
        />

        {erreur && <p className="text-danger mt-2">{erreur}</p>}
        {message && <p className="text-success mt-2">{message}</p>}

        <div className="d-grid mt-3">
          <ButtonPrimaryy>Changer le mot de passe</ButtonPrimaryy>
        </div>
      </form>
    </div>
  );
}
