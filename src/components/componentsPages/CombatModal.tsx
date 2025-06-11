'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Match } from '@/types/types';
import { io, Socket } from 'socket.io-client';
import { ButtonPrimaryy, ButtonSecondaryy } from '../ui/ComponentForm';

const SOCKET_URL = 'http://localhost:4000';

interface CombatModalProps {
  match: Match;
  onClose: () => void;
  onScoreUpdate?: (matchId: number, updates: Partial<Match>) => void;
  readonly?: boolean;
}

const CombatModal: React.FC<CombatModalProps> = ({
  match,
  onClose,
  onScoreUpdate,
  readonly = false,
}) => {
  const [localMatch, setLocalMatch] = useState<Match>(match);
  const [modified, setModified] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Sync avec le match reçu en props
  useEffect(() => {
    setLocalMatch(match);
    setModified(false); // Reset l'état modifié si nouveau match
  }, [match]);

  // Socket.io connexion
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('subscribeMatch', match.id);

    socketRef.current.on('scoreUpdate', ({ updates }) => {
      setLocalMatch(updates);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [match.id]);

  // Détecte si localMatch a été modifié (score ou pénalités)
  useEffect(() => {
    if (
      localMatch.scoreP1 !== match.scoreP1 ||
      localMatch.scoreP2 !== match.scoreP2 ||
      (localMatch.penaliteP1 ?? 0) !== (match.penaliteP1 ?? 0) ||
      (localMatch.penaliteP2 ?? 0) !== (match.penaliteP2 ?? 0)
    ) {
      setModified(true);
    } else {
      setModified(false);
    }
  }, [localMatch, match]);

  const handleScore = (
    field: 'scoreP1' | 'scoreP2' | 'penaliteP1' | 'penaliteP2',
    value: number
  ) => {
    if (readonly) return;
    const updatedValue = Math.max((localMatch[field] ?? 0) + value, 0);

    const updatedMatch = {
      ...localMatch,
      [field]: updatedValue,
    };

    setLocalMatch(updatedMatch);

    // Broadcast sur le socket
    socketRef.current?.emit('updateScore', {
      matchId: match.id,
      updates: updatedMatch,
    });

    if (onScoreUpdate) {
      onScoreUpdate(match.id, { [field]: updatedValue });
    }
  };

  const enregistrerEtFermer = async () => {
    await fetch(`http://localhost:8000/api/matchs/${match.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localMatch),
    });
    onClose();
  };

  const confirmClose = () => {
    if (modified) {
      if (window.confirm("Voulez-vous vraiment fermer et enregistrer ce combat ?")) {
        enregistrerEtFermer();
      }
    } else {
      if (window.confirm("Voulez-vous vraiment fermer ce combat ?")) {
        onClose();
      }
    }
  };

  const getButtonStyle = (val: number, baseStyle: any) => ({
    ...baseStyle,
    opacity: val <= 0 ? 0.8 : 1,
    cursor: val <= 0 ? 'not-allowed' : 'pointer'
  });

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {localMatch.competiteur1?.prenom} {localMatch.competiteur1?.nom} vs {localMatch.competiteur2?.prenom} {localMatch.competiteur2?.nom}
        </h2>
        <div style={styles.section}>
          {/* Joueur 1 */}
          <div style={styles.playerBlock}>
            <h3 style={styles.playerName}>
              {localMatch.competiteur1?.prenom} {localMatch.competiteur1?.nom}
            </h3>
            <p>Score : <strong>{localMatch.scoreP1}</strong></p>
            <p>Pénalités : <strong>{localMatch.penaliteP1}</strong></p>
            {!readonly && (
              <div>
                {/* LIGNE 1 */}
                <div style={styles.buttonRow}>
                  <button
                    style={getButtonStyle(localMatch.scoreP1 ?? 0, styles.minusBtn)}
                    onClick={() => handleScore('scoreP1', -1)}
                    disabled={localMatch.scoreP1 <= 0}
                  >
                    -1 pt
                  </button>
                  <button
                    style={styles.scoreBtn}
                    onClick={() => handleScore('scoreP1', 1)}
                  >
                    +1 pt
                  </button>
                </div>
                {/* LIGNE 2 */}
                <div style={styles.buttonRow}>
                  <button
                    style={getButtonStyle(localMatch.penaliteP1 ?? 0, styles.minusPenaltyBtn)}
                    onClick={() => handleScore('penaliteP1', -1)}
                    disabled={localMatch.penaliteP1 <= 0}
                  >
                    -1 faute
                  </button>
                  <button
                    style={styles.penaltyBtn}
                    onClick={() => handleScore('penaliteP1', 1)}
                  >
                    +1 faute
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Joueur 2 */}
          <div style={styles.playerBlock}>
            <h3 style={styles.playerName}>
              {localMatch.competiteur2?.prenom} {localMatch.competiteur2?.nom}
            </h3>
            <p>Score : <strong>{localMatch.scoreP2}</strong></p>
            <p>Pénalités : <strong>{localMatch.penaliteP2}</strong></p>
            {!readonly && (
              <div>
                {/* LIGNE 1 */}
                <div style={styles.buttonRow}>
                  <button
                    style={getButtonStyle(localMatch.scoreP2 ?? 0, styles.minusBtn)}
                    onClick={() => handleScore('scoreP2', -1)}
                    disabled={localMatch.scoreP2 <= 0}
                  >
                    -1 pt
                  </button>
                  <button
                    style={styles.scoreBtn}
                    onClick={() => handleScore('scoreP2', 1)}
                  >
                    +1 pt
                  </button>
                </div>
                {/* LIGNE 2 */}
                <div style={styles.buttonRow}>
                  <button
                    style={getButtonStyle(localMatch.penaliteP2 ?? 0, styles.minusPenaltyBtn)}
                    onClick={() => handleScore('penaliteP2', -1)}
                    disabled={localMatch.penaliteP2 <= 0}
                  >
                    -1 faute
                  </button>
                  <button
                    style={styles.penaltyBtn}
                    onClick={() => handleScore('penaliteP2', 1)}
                  >
                    +1 faute
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={styles.footer}>
          {!readonly && (
            <ButtonPrimaryy

              onClick={() =>
                window.open(`/scoreboard-live/${match.id}`, '_blank', 'width=1200,height=700')
              }
            >
              Ouvrir le scoreboard
            </ButtonPrimaryy>
          )}
          <ButtonSecondaryy  onClick={confirmClose}>
            {modified ? "Fermer et enregistrer" : "Fermer"}
          </ButtonSecondaryy>
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
  buttonRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '8px',
    marginBottom: '4px',
  },
  scoreBtn: {
    padding: '8px 14px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    minWidth: 70,
  },
  minusBtn: {
    padding: '8px 14px',
    backgroundColor: '#9be3af',
    color: '#19722b',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    minWidth: 70,
  },
  penaltyBtn: {
    padding: '8px 14px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    minWidth: 90,
  },
  minusPenaltyBtn: {
    padding: '8px 14px',
    backgroundColor: '#fff3b8',
    color: '#c38706',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    minWidth: 90,
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
