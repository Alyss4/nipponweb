'use client';

import { useState } from 'react';
import { ButtonPrimaryy, ButtonSecondaryy } from '../ui/ComponentForm';
import { Match, Competiteur } from '@/types/types';

interface Poule {
  id: number;
  numero: number;
  competiteurs: Competiteur[];
}

interface Props {
  poule: Poule;
  matchs: Match[];
  genererMatchs: (pouleId: number) => void;
  onLancerCombat: (match: Match) => void; 
}

export default function PouleSection({ poule, matchs, genererMatchs, onLancerCombat }: Props) {
  const [page, setPage] = useState(1);
  const matchsParPage = 12;

  const matchsNonScorés = matchs.filter(
    m => m.scoreP1 === 0 && m.scoreP2 === 0
  );
  const matchsScorés = matchs.filter(
    m => m.scoreP1 !== 0 || m.scoreP2 !== 0
  );
  const matchsTriés = [...matchsNonScorés, ...matchsScorés];

  const totalPages = Math.ceil(matchsTriés.length / matchsParPage);
  const matchsAffiches = matchsTriés.slice((page - 1) * matchsParPage, page * matchsParPage);

  return (
    <div style={{ marginTop: '40px', border: '1px solid #ddd', borderRadius: '10px', padding: '24px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '10px', color: '#2c3e50' }}>
        Poule {poule.numero}
      </h2>

      <h3 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '8px' }}>Compétiteurs :</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {poule.competiteurs.map(c => (
          <span key={c.id} style={{
            backgroundColor: '#eaeaea',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            {c.prenom} {c.nom}
          </span>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {matchs.length === 0 ? (
          <ButtonPrimaryy onClick={() => genererMatchs(poule.id)}>
            Générer les matchs
          </ButtonPrimaryy>
        ) : (
          <span className="text-green-600 font-bold" style={{ fontSize: 16 }}>
            Les matchs ont été générés !
          </span>
        )}
      </div>

      {matchsAffiches.length > 0 && (
        <>
          <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '16px' }}>Matchs</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {matchsAffiches.map(match => {
              const isScored = match.scoreP1 !== 0 || match.scoreP2 !== 0;
              return (
                <div key={match.id} style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#f9f9f9',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>
                    {match.competiteur1?.prenom ?? 'BYE'} {match.competiteur1?.nom ?? ''} vs {match.competiteur2?.prenom ?? 'BYE'} {match.competiteur2?.nom ?? ''}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>
                    Score : {match.scoreP1 ?? 0} - {match.scoreP2 ?? 0} <br />
                    Pénalités : {match.penaliteP1 ?? 0} - {match.penaliteP2 ?? 0}
                  </div>
                  {isScored ? (
                    <span style={{ color: "#4caf50", fontWeight: "bold" }}>Déjà joué</span>
                  ) : (
                    <ButtonSecondaryy
                      style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#e83c28' }}
                      onClick={() => onLancerCombat(match)}
                    >
                      Lancer le combat
                    </ButtonSecondaryy>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <ButtonPrimaryy
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                style={{
                  opacity: page === 1 ? 0.6 : 1,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ◀ Précédent
              </ButtonPrimaryy>

              <span style={{ fontWeight: 'bold' }}>Page {page} / {totalPages}</span>

              <ButtonPrimaryy
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{
                  opacity: page === totalPages ? 0.6 : 1,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Suivant ▶
              </ButtonPrimaryy>
            </div>
          )}
        </>
      )}
    </div>
  );
}
