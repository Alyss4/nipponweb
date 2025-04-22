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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Connexion > Email:', email);
    console.log('Connexion > Password:', password);
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
