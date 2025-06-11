'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/ComponentForm';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function InscriptionPage() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [routerReady, setRouterReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setRouterReady(true);
    }
  }, []);

  useEffect(() => {
    if (routerReady) {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, [routerReady, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setErreur('');

    const data = { email, motDePasse, confirmation };

    try {
      const response = await fetch(`${API_BASE_URL}/inscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem('token', result.token);
          setMessage('Inscription réussie !');
          setErreur('');
        }
      } else {
        if (result.errors) {
          const messages = Object.values(result.errors).flat().join(' ');
          setErreur(messages);
        } else {
          setErreur(result.message || 'Une erreur est survenue.');
        }
      }
    } catch (error) {
      setErreur("Impossible de se connecter à l'API.");
    }
  };

  if (!isClient || !routerReady) {
    return null;
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="text-center text-o-primary mb-4">Inscription</h2>
      <form onSubmit={handleSubmit}>
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
              (e.currentTarget.style.backgroundColor = 'var(--bg-button-primary-hover)')}
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--bg-button-primary)')}
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}
