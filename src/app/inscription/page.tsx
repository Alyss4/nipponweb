'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ComponentForm';
import { useRouter } from 'next/navigation'; 

export default function InscriptionPage() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false); // Nouvel état pour vérifier si on est côté client
  const [routerReady, setRouterReady] = useState(false); // Nouveau state pour vérifier si le router est prêt
  const router = useRouter();

  // Vérification si l'utilisateur est déjà connecté (seulement côté client)
  useEffect(() => {
    setIsClient(true); // On marque qu'on est maintenant côté client
    if (typeof window !== 'undefined') {
      setRouterReady(true); // Nous marquons que le routeur est prêt après le rendu
    }
  }, []);

  // Utilisation de useEffect pour rediriger l'utilisateur après le montage du composant
  useEffect(() => {
    if (routerReady) {
      const token = localStorage.getItem('token'); // ou récupérer depuis un cookie
      if (token) {
        // Si l'utilisateur est connecté (token présent), redirige vers une autre page
        router.push('/dashboard');  // Par exemple, rediriger vers un tableau de bord ou une autre page.
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
  
    const data = {
      nom,
      email,
      motDePasse,
      confirmation
    };
  
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      const result = await response.json();
    
      console.log('Réponse API:', result);
    
      if (response.ok) {
        if (result.token) {
          localStorage.setItem('token', result.token); // ✅ ENREGISTRE LE TOKEN !
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
      console.error('Erreur FETCH ou parsing JSON:', error);
      setErreur("Impossible de se connecter à l'API.");
    }
  };

  // Ne pas rendre le composant tant que nous ne sommes pas côté client et que le router est prêt
  if (!isClient || !routerReady) {
    return null;
  }

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
