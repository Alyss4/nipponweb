'use client';

import React, { useEffect, useState } from 'react';
import { Match } from '@/types/types';

interface CombatModalProps {
  match: Match;
  onClose: () => void;
  onScoreUpdate: (matchId: number, updates: Partial<Match>) => void;
}

const CombatModal: React.FC<CombatModalProps> = ({ match, onClose, onScoreUpdate }) => {
  const [localMatch, setLocalMatch] = useState<Match>(match);

  // Sync props.match → localMatch if props.match changes
  useEffect(() => {
    setLocalMatch(match);
  }, [match]);

  const handleScore = (field: 'scoreP1' | 'scoreP2' | 'penaliteP1' | 'penaliteP2', value: number) => {
    const updatedValue = (localMatch[field] ?? 0) + value;

    const updatedMatch = {
      ...localMatch,
      [field]: updatedValue,
    };

    setLocalMatch(updatedMatch); // update UI
    onScoreUpdate(match.id, { [field]: updatedValue }); // update backend
  };

  const confirmClose = () => {
    const confirmed = window.confirm("Voulez-vous vraiment fermer ce combat ?");
    if (confirmed) onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {localMatch.competiteur1?.prenom} {localMatch.competiteur1?.nom} vs {localMatch.competiteur2?.prenom} {localMatch.competiteur2?.nom}
        </h2>

        <div style={styles.section}>
          {/* Joueur 1 */}
          <div style={styles.playerBlock}>
            <h3 style={styles.playerName}>{localMatch.competiteur1?.prenom} {localMatch.competiteur1?.nom}</h3>
            <p>Score : <strong>{localMatch.scoreP1}</strong></p>
            <p>Pénalités : <strong>{localMatch.penaliteP1}</strong></p>
            <div style={styles.buttonGroup}>
              <button style={styles.scoreBtn} onClick={() => handleScore('scoreP1', 1)}>+1 pt</button>
              <button style={styles.penaltyBtn} onClick={() => handleScore('penaliteP1', 1)}>+1 faute</button>
            </div>
          </div>

          {/* Joueur 2 */}
          <div style={styles.playerBlock}>
            <h3 style={styles.playerName}>{localMatch.competiteur2?.prenom} {localMatch.competiteur2?.nom}</h3>
            <p>Score : <strong>{localMatch.scoreP2}</strong></p>
            <p>Pénalités : <strong>{localMatch.penaliteP2}</strong></p>
            <div style={styles.buttonGroup}>
              <button style={styles.scoreBtn} onClick={() => handleScore('scoreP2', 1)}>+1 pt</button>
              <button style={styles.penaltyBtn} onClick={() => handleScore('penaliteP2', 1)}>+1 faute</button>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.closeFooterBtn} onClick={confirmClose}>Fermer</button>
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
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold' as const,
    marginBottom: '24px',
    color: '#023047',
    textAlign: 'center' as const,
  },
  section: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'space-between',
  },
  playerBlock: {
    flex: 1,
    textAlign: 'center' as const,
  },
  playerName: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#2f2f2f',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '10px',
  },
  scoreBtn: {
    padding: '8px 14px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  penaltyBtn: {
    padding: '8px 14px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'right' as const,
  },
  closeFooterBtn: {
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  },
};

export default CombatModal;
