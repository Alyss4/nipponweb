'use client';

import React, { useEffect, useState } from 'react';
import Button, { ButtonStyles } from '../components/ui/AccueilButton';
import {
  FaUserPlus, FaTrophy, 
  FaUsersCog, FaUserCircle, 
  FaMedal, FaLayerGroup, FaDoorOpen, FaBookOpen 
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [hasCategories, setHasCategories] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
    const fetchCategories = async () => {
      try {
        if (!token) return;
        const res = await fetch('http://localhost:8000/api/categories/has', {
          headers: { Authorization: `Bearer ${token}` },
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
  const renderButtons = () => {
    switch (role) {
      case 'a': 
        return (
          <>
            <Button icon={FaUsersCog} label="Gérer Utilisateurs" href="/roles"/>
            <Button icon={FaUserPlus} label="Créer Tournoi" onClick={handleCreateTournoi} />
            <Button icon={FaTrophy} label="Voir Tournoi" href="/lancertournoi" />

          </>
        );
      case 'g':
        return (
          <>
            <Button icon={FaLayerGroup} label="Créer Catégories" href="/categorie" />
            <Button icon={FaUserPlus} label="Créer Tournoi" onClick={handleCreateTournoi} />
            <Button icon={FaTrophy} label="Lancer un tournoi" href="/lancertournoi" />
            <Button icon={FaUserCircle} label="Mon Profil" href="/profil" />
          </>
        );
      case 'c': 
        return (
          <>
            <Button icon={FaBookOpen} label="Prochains Tournois" href="/prochainstournois" />
            <Button icon={FaMedal} label="Mes Résultats" href="/" />
            <Button icon={FaUserCircle} label="Mon Profil" href="/profil" />
          </>
        );
      default: 
        return (
          <>
            <Button icon={FaBookOpen} label="Prochains Tournois" href="/prochainstournois" />
            <Button icon={FaMedal} label="Résultats Publics" href="/" />
            <Button icon={FaUserPlus} label="S'inscrire" href="/" />
            <Button icon={FaDoorOpen} label="Se connecter" href="/" />

          </>
        );
    }
  };
  return (
    <>
      <ButtonStyles />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        {renderButtons()}
      </div>
    </>
  );
}
