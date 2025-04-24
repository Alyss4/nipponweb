'use client';

import React, { useState, ChangeEvent } from 'react';
import { Input, ButtonPrimaryy, ButtonSecondaryy } from '../../components/ComponentForm';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/connexion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          motDePasse: password, // ce nom doit correspondre à celui attendu côté backend
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Gère les erreurs avec un message
        console.error('Erreur de connexion :', data.message || 'Erreur inconnue');
        alert(data.message || 'Erreur lors de la connexion');
        return;
      }
  
      // Connexion réussie : tu peux stocker l’utilisateur ou rediriger
      console.log('Utilisateur connecté:', data.utilisateur);
      alert('Connexion réussie !');
  
      // Exemple de redirection
      // router.push('/dashboard'); (si tu utilises Next.js router)
  
    } catch (error) {
      console.error('Erreur réseau ou serveur :', error);
      alert('Impossible de se connecter à l’API');
    }
  };
  

  const handleInscription = () => {
    console.log('Redirection vers inscription...');
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="text-center text-primary mb-4">Connexion</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={handleEmailChange}
          required={true}
        />
        <Input
          label="Mot de passe"
          type="password"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={handlePasswordChange}
          required={true}
        />

        <div className="d-grid gap-2 mb-2">
          <ButtonPrimaryy>Se connecter</ButtonPrimaryy>
        </div>

        <div className="d-grid gap-2">
          <div onClick={handleInscription}>
            <ButtonSecondaryy>S’inscrire</ButtonSecondaryy>
          </div>
        </div>
      </form>
    </div>
  );
}
