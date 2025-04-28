'use client';

import { FaUser, FaTrophy, FaBookOpen, FaClipboardList, FaUsersCog, FaCheckCircle, FaUserCircle } from 'react-icons/fa';

const Button = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button type="button" className="icon-button">
    <Icon size={64} />
    <span className="label">{label}</span>
  </button>
);

export const ButtonImportParticipants = () => <Button icon={FaUser} label="Ajouter des participants" />;
export const ButtonCreateTournament = () => <Button icon={FaTrophy} label="Créer / Commencer un tournoi" />;
export const ButtonGuideUser = () => <Button icon={FaBookOpen} label="Guide utilisateur" />;
export const ButtonMyProfile = () => <Button icon={FaUserCircle} label="Mon profil" />;
export const ButtonViewMyTournaments = () => <Button icon={FaClipboardList} label="Voir mes tournois" />;
export const ButtonConsultResults = () => <Button icon={FaClipboardList} label="Consulter mes résultats" />;
export const ButtonManageUsers = () => <Button icon={FaUsersCog} label="Gérer les utilisateurs" />;
export const ButtonValidateCategories = () => <Button icon={FaCheckCircle} label="Valider catégories / tournois" />;

export const ButtonStyles = () => (
  <style jsx global>{`
    .icon-button {
      width: 180px;
      height: 180px;
      background-color: #f5f8fa;
      border: 2px solid #003049;
      border-radius: 24px;
      color: #003049;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      gap: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .icon-button:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      background-color: #e1e8ed;
    }

    .label {
      margin-top: 8px;
      text-align: center;
    }
  `}
  </style>
);
