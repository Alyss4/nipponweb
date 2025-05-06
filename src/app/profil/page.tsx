'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { Input, Checkbox, ButtonPrimaryy, Select, ButtonSecondaryy } from '../../components/componentsUI/ComponentForm';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/connexion');
      return;
    }

    fetch('http://127.0.0.1:8000/api/profil', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.utilisateur) {
          setNom(data.utilisateur.nom);
          setEmail(data.utilisateur.email);
        }
      })
      .catch((err) => {
        console.error(err);
        setErreur("Impossible de charger le profil.");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/profil/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, email, motDePasse }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profil mis à jour avec succès.');
        setErreur('');
      } else {
        setErreur(data.message || 'Erreur lors de la mise à jour.');
        setMessage('');
      }
    } catch (error) {
      console.error(error);
      setErreur("Erreur de communication avec le serveur.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <h2 className="text-center text-primary mb-4">Mon profil</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom"
          type="text"
          placeholder="Votre nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required={true}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />

        {message && <p className="text-success">{message}</p>}
        {erreur && <p className="text-danger">{erreur}</p>}

        <div className="d-grid gap-2 mt-3">
          <ButtonPrimaryy>Mettre à jour</ButtonPrimaryy>
          <div onClick={() => router.push('/')}>
            <ButtonSecondaryy>Retour</ButtonSecondaryy>
          </div>
        </div>
      </form>
    </div>
  );
}
