'use client'
import Button, { ButtonStyles } from '../components/componentsPages/AccueilButton';
import { 
  FaUserPlus, FaTrophy, FaBookOpen, FaClipboardList, 
  FaUsersCog, FaCheckCircle, FaUserCircle, FaTags, 
  FaMedal, FaLayerGroup
} from 'react-icons/fa';


export default function Dashboard() {
  return (
    <>
      <ButtonStyles />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        <Button icon={FaLayerGroup} label="Créer des catégories" href="/categorie" />
        <Button icon={FaTrophy} label="Créer un tournois" href="./tournois" />
        <Button icon={FaUserPlus} label="Ajouter des participants" href="./gestionparticipants" />
        <Button icon={FaUserCircle} label="Mon profil" href="/profil" />
        <Button icon={FaUsersCog} label="Gérer les utilisateurs" href="/roles" />
        {/* A faire a la fin <Button icon={FaBookOpen} label="Guide utilisateur" href="/" /> 
          <Button icon={FaClipboardList} label="Voir les tournois" href="/" />
          <Button icon={FaMedal} label="Consulter les résultats" href="./resultats" />
          <Button icon={FaCheckCircle} label="Valider catégories / tournois" href="/" /> */}

      </div>
    </>
  );
}
