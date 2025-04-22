'use client';

import React, { useState } from 'react';
import { Input } from '../../components/ComponentForm';

export default function InscriptionPage() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // Vérifier que les mots de passe correspondent
    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }
  
    setErreur('');
  
    // Préparer les données à envoyer
    const data = {
      nom,
      email,
      motDePasse,
      confirmation
    };
  
    // Récupérer le jeton CSRF depuis la balise meta
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
    try {
      // Envoyer la requête à l'API Laravel avec fetch
      const response = await fetch('http://127.0.0.1:8000/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Vérifier si la réponse est correcte
      if (response.ok) {
        const result = await response.json();
        setMessage('Inscription réussie !');
        console.log(result); // Affiche la réponse de l'API si nécessaire
      } else {
        const errorData = await response.json();
        setErreur(errorData.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      // En cas d'erreur de réseau ou de serveur
      setErreur('Impossible de se connecter à l\'API.');
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="text-center text-primary mb-4">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom complet"
          type="text"
          placeholder="Entrez votre nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required={true}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />
        <Input
          label="Mot de passe"
          type="password"
          placeholder="Entrez un mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required={true}
        />
        <Input
          label="Confirmez le mot de passe"
          type="password"
          placeholder="Confirmez votre mot de passe"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required={true}
        />

        {erreur && <p className="text-danger">{erreur}</p>}
        {message && <p className="text-success">{message}</p>}

        <div className="d-grid">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: 'var(--bg-button-primary)',
              color: 'var(--text-button-primary)',
              borderColor: 'var(--border-button-primary)',
              marginTop: '10px'
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--bg-button-primary-hover)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--bg-button-primary)')
            }
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}
