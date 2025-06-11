'use client';
import { Match, Competiteur } from '@/types/types';
import { ButtonPrimaryy } from '@/components/ui/ComponentForm';

interface Props {
  match: Match;
  onClick?: () => void;
  alreadyPlayedLabel?: string; 
  buttonLabel?: string;        
  showButton?: boolean;        
}

export default function MatchCard({
  match,
  onClick,
  alreadyPlayedLabel = "Déjà joué",
  buttonLabel = "Gérer ce combat",
  showButton = true,
}: Props) {
  const nom = (c?: Competiteur | null) =>
    c ? `${c.prenom} ${c.nom}` : <span style={{ color: "#888" }}>BYE</span>;

  const isPlayed = (match.scoreP1 ?? 0) !== 0 || (match.scoreP2 ?? 0) !== 0;

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      backgroundColor: '#f9f9f9',
      textAlign: 'center',
      minWidth: 220,
      maxWidth: 300,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>
        {nom(match.competiteur1)} <span style={{ color: '#2355a0', fontWeight: 700, margin: '0 5px' }}>vs</span> {nom(match.competiteur2)}
      </h4>
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>
        Score : {match.scoreP1 ?? 0} - {match.scoreP2 ?? 0}<br />
        {typeof match.penaliteP1 === "number" && typeof match.penaliteP2 === "number" && (
          <>Pénalités : {match.penaliteP1 ?? 0} - {match.penaliteP2 ?? 0}</>
        )}
      </div>
      {isPlayed && !showButton ? (
        <span style={{ color: "#4caf50", fontWeight: "bold" }}>{alreadyPlayedLabel}</span>
      ) : showButton ? (
        <ButtonPrimaryy
          style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#e83c28', marginTop: 4 }}
          onClick={onClick}
        >
          {buttonLabel}
        </ButtonPrimaryy>
      ) : null}
    </div>
  );
}
