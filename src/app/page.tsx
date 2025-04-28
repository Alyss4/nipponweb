'use client'
import Button, { ButtonStyles } from '../components/componentsPages/AccueilButton';
import { 
  FaUser, FaTrophy, FaBookOpen, FaClipboardList, 
  FaUsersCog, FaCheckCircle, FaUserCircle, FaTags 
} from 'react-icons/fa';

export default function Dashboard() {
  return (
    <>
      <ButtonStyles />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        <Button icon={FaUser} label="Ajouter des participants" href="/" />
        <Button icon={FaTrophy} label="Créer / Commencer un tournoi" href="/" />
        <Button icon={FaBookOpen} label="Guide utilisateur" href="/" />
        <Button icon={FaUserCircle} label="Mon profil" href="/" />
        <Button icon={FaClipboardList} label="Voir mes tournois" href="/" />
        <Button icon={FaClipboardList} label="Consulter mes résultats" href="/" />
        <Button icon={FaUsersCog} label="Gérer les utilisateurs" href="/" />
        <Button icon={FaCheckCircle} label="Valider catégories / tournois" href="/" />
        <Button icon={FaTags} label="Créer des catégories" href="/" />
      </div>
    </>
  );
}
