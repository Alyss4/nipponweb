'use client';

import React, { useEffect, useState } from 'react';
import Button, { ButtonStyles } from '../components/componentsUI/AccueilButton';
import {
  FaUserPlus, FaTrophy, FaBookOpen, FaClipboardList,
  FaUsersCog, FaCheckCircle, FaUserCircle, FaTags,
  FaMedal, FaLayerGroup
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [hasCategories, setHasCategories] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/categories/has', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
        const data = await res.json();
        setHasCategories(data.hasCategories);
      } catch (error) {
        console.error(error);
        setHasCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateTournoi = () => {
    if (hasCategories) {
      router.push('/tournois');
    } else {
      alert("Vous devez d'abord créer des catégories avant de créer un tournoi.");
    }
  };

  return (
    <>
      <ButtonStyles />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        <Button icon={FaLayerGroup} label="Créer des catégories" href="/categorie" />
        <Button icon={FaTrophy} label="Créer un tournois" onClick={handleCreateTournoi} />
        <Button icon={FaUserPlus} label="Ajouter des participants" href="./gestionparticipants" />
        <Button icon={FaUserCircle} label="Mon profil" href="/profil" />
        <Button icon={FaUsersCog} label="Gérer les utilisateurs" href="/roles" />
      </div>
    </>
  );
}
