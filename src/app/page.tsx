'use client'
import React, { useEffect, useState } from 'react';
import Button, { ButtonStyles } from '../components/ui/AccueilButton';
import {
  FaUserPlus, FaTrophy, 
  FaUsersCog, FaUserCircle, 
  FaMedal, FaLayerGroup, FaDoorOpen, FaBookOpen 
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [hasCategories, setHasCategories] = useState<boolean | null>(null);

  const router = useRouter();
  const { role } = useUser(); 

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem('token');

    const fetchCategories = async () => {
      try {
        if (!token) {
          setHasCategories(false); 
          return;
        }
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/api/categories/has`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
        const data = await res.json();
        setHasCategories(data.hasCategories);
      } catch (error) {
        setHasCategories(false);
      }
    };

    fetchCategories();
  }, []);
  const allButtonsDisabled = hasCategories === null;

  const handleCreateTournoi = () => {
    if (hasCategories === null) {
      alert("Chargement des catégories, veuillez patienter.");
      return;
    }
    if (hasCategories) {
      router.push('/tournois');
    } else {
      alert("Vous devez d'abord créer des catégories avant de créer un tournoi.");
    }
  };

const MyButton = (props: React.ComponentProps<typeof Button>) => (
  <Button {...props} disabled={allButtonsDisabled || props.disabled} />
);

  const renderButtons = () => {
    switch (role) {
      case 'a': 
        return (
          <>
            <MyButton icon={FaLayerGroup} label="Créer Catégories" href="/categorie" />          
            <MyButton icon={FaUsersCog} label="Gérer Utilisateurs" href="/roles"/>
            <MyButton icon={FaUserPlus} label="Créer Tournoi" onClick={handleCreateTournoi} />
            <MyButton icon={FaTrophy} label="Voir Tournoi" href="/lancertournoi" />
            <MyButton icon={FaUserCircle} label="Mon Profil" href="/profil" />
          </>
        );
      case 'g':
        return (
          <>
            <MyButton icon={FaLayerGroup} label="Créer Catégories" href="/categorie" />
            <MyButton icon={FaUserPlus} label="Créer Tournoi" onClick={handleCreateTournoi} />
            <MyButton icon={FaTrophy} label="Lancer un tournoi" href="/lancertournoi" />
            <MyButton icon={FaUserCircle} label="Mon Profil" href="/profil" />
          </>
        );
      case 'c': 
        return (
          <>
            <MyButton icon={FaBookOpen} label="Prochains Tournois" href="/prochainstournois" />
            <MyButton icon={FaMedal} label="Mes Résultats" href="/" />
            <MyButton icon={FaUserCircle} label="Mon Profil" href="/profil" />
          </>
        );
      case 'u': 
        return (
          <>
            <MyButton icon={FaBookOpen} label="Prochains Tournois" href="/prochainstournoispublic" />
            <MyButton icon={FaMedal} label="Résultats Publics" href="/" />
            <MyButton icon={FaUserCircle} label="Mon Profil" href="/profil" />
          </>
        );
      default: 
        return (
          <>
            <MyButton icon={FaBookOpen} label="Prochains Tournois" href="/prochainstournoispublic" />
            <MyButton icon={FaMedal} label="Résultats Publics" href="/" />
            <MyButton icon={FaUserPlus} label="S'inscrire" href="/inscription" />
            <MyButton icon={FaDoorOpen} label="Se connecter" href="/connexion" />
          </>
        );
    }
  };

  return (
    <>
      <ButtonStyles />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        {mounted ? (
          hasCategories === null 
            ? <span>Chargement...</span>
            : renderButtons()
        ) : null}
      </div>
    </>
  );
}
