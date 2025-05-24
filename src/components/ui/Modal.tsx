'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonPrimaryy, ButtonSecondaryy } from '@/components/ui/ComponentForm';

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  tournoi?: { id: number } | null;
}

const LaModal: React.FC<ModalProps> = ({ opened, onClose, title, children, tournoi }) => {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const handleInscription = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const tournoiId = tournoi?.id;
      if (!tournoiId) return;

      const userRes = await fetch('http://localhost:8000/api/getIDCompetiteurUtilisateur', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      if (!userData.id_competiteur) {
        router.push(`/inscriptiontournois?id=${tournoiId}`);
        return;
      }

      const insRes = await fetch('http://localhost:8000/api/inscrireAuTournoiDejaCompetiteur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_tournoi: tournoiId,
          id_competiteur: userData.id_competiteur,
        }),
      });

      const insData = await insRes.json();

      if (insRes.ok) {
        setMessage('✅ Inscription réussie au tournoi.');
      } else {
        setMessage(`❌ ${insData.message || "Erreur lors de l'inscription."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (!opened) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose} aria-label="Fermer">×</button>
        <h2 style={styles.title}>{title}</h2>

        <div style={styles.content}>
          {children}
          {message && <div style={styles.message}>{message}</div>}
        </div>

        <div style={styles.footer}>
          <ButtonSecondaryy onClick={onClose}>Fermer</ButtonSecondaryy>
          {tournoi?.id && (
            <ButtonPrimaryy onClick={handleInscription}>
              S'inscrire
            </ButtonPrimaryy>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'relative' as const,
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
  },
  closeButton: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#888',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    marginBottom: '16px',
    color: '#023047',
  },
  content: {
    marginBottom: '20px',
    color: '#023047',
  },
  message: {
    marginTop: '12px',
    fontStyle: 'italic',
    color: '#027353',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
};

export default LaModal;
