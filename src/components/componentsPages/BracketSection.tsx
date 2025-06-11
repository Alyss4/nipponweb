'use client';
import MatchCard from '@/components/ui/MatchCard';
import { Match } from '@/types/types';

interface BracketMatch extends Match {
  round: number;
  numero: number;
}

interface BracketSectionProps {
  title: string;
  matchs: BracketMatch[];
  onGererCombat: (match: BracketMatch) => void;
}

export default function BracketSection({
  title,
  matchs,
  onGererCombat
}: BracketSectionProps) {
  return (
    <div style={{
      marginTop: 40,
      border: '1px solid #ddd',
      borderRadius: 10,
      padding: 24,
      marginBottom: 40
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 18,
        color: '#2355a0',
        fontWeight: 700
      }}>
        {title}
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        justifyContent: 'center'
      }}>
        {matchs.length > 0 ? (
          matchs
            .filter(match => match.competiteur1 || match.competiteur2)
            .map(match => {
              const isBye = !match.competiteur1 || !match.competiteur2;
              return (
                <div key={match.id} style={{
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  padding: 16,
                  background: isBye ? '#f8f8f8' : '#fff',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16 }}>
                    {match.competiteur1
                      ? `${match.competiteur1.prenom} ${match.competiteur1.nom}`
                      : <span style={{ color: '#aaa' }}>BYE</span>}
                    {' '}
                    vs{' '}
                    {match.competiteur2
                      ? `${match.competiteur2.prenom} ${match.competiteur2.nom}`
                      : <span style={{ color: '#aaa' }}>BYE</span>}
                  </div>
                  {!isBye ? (
                    <MatchCard
                      match={match}
                      showButton={(match.scoreP1 ?? 0) === 0 && (match.scoreP2 ?? 0) === 0}
                      alreadyPlayedLabel="Déjà joué"
                      buttonLabel="Gérer ce combat"
                      onClick={() => onGererCombat(match)}
                    />
                  ) : (
                    <div style={{ marginTop: 8, color: '#a13' }}>
                      Gagné par BYE
                    </div>
                  )}
                </div>
              );
            })
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#aaa',
            fontSize: 16,
            gridColumn: '1/-1'
          }}>
            Aucun match
          </div>
        )}
      </div>
    </div>
  );
}
