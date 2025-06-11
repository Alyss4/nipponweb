'use client';

import React, { useState, ChangeEvent } from 'react';
import { Input, ButtonPrimaryy, ButtonSecondaryy } from '../../components/ui/ComponentForm';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useUser();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Vérification de la validité de l'email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez entrer un email valide.');
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}/connexion`, {
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

      setLoading(false);

      if (!response.ok) {
        setError(data.message || 'Erreur lors de la connexion');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.utilisateur.role);
      localStorage.setItem('userId', data.utilisateur.id);  

      const role = data.utilisateur.role;
      login(data.token, data.utilisateur.role);

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'user') {
        router.push('/user/dashboard');
      } else {
        router.push('/');
      }

    } catch (error) {
      setLoading(false);
      setError('Impossible de se connecter à l’API');
    }
  };

  const handleInscription = () => {
    router.push('/inscription'); 
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="text-center text-o-primary mb-4">Connexion</h2>
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
          <ButtonPrimaryy type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Se connecter'}
          </ButtonPrimaryy>
        </div>

        <div className="d-grid gap-2 ">
          <div onClick={handleInscription} >
            <ButtonSecondaryy className='w-100'>S’inscrire</ButtonSecondaryy>
          </div>
        </div>
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
