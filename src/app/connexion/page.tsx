'use client';

import React, { useState, ChangeEvent } from 'react';
import { Input, ButtonPrimaryy, ButtonSecondaryy } from '../../components/ComponentForm';
import { useRouter } from 'next/navigation';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
          motDePasse: password, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erreur de connexion :', data.message || 'Erreur inconnue');
        alert(data.message || 'Erreur lors de la connexion');
        return;
      }


      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.utilisateur.role);

      alert('Connexion réussie !');
      console.log('Utilisateur connecté:', data.utilisateur);

      const role = data.utilisateur.role;

      if (role === 'admin') {
        router.push('./');
      } else if (role === 'user') {
        router.push('./');
      } else {
        router.push('/');
      }

    } catch (error) {
      console.error('Erreur réseau ou serveur :', error);
      alert('Impossible de se connecter à l’API');
    }
  };

  const handleInscription = () => {
    router.push('/inscription'); 
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
