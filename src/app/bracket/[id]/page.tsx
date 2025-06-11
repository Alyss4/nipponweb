'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ButtonPrimaryy } from '@/components/ui/ComponentForm';
import CombatModal from '@/components/componentsPages/CombatModal';
import { Match } from '@/types/types';
import MatchCard from '@/components/ui/MatchCard';
import BracketSection from '@/components/componentsPages/BracketSection';

interface BracketMatch extends Match {
  round: number;
  numero: number;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BracketPage() {
  const { id: tournoiId } = useParams();
  const router = useRouter();
  const [bracket, setBracket] = useState<BracketMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [matchActif, setMatchActif] = useState<BracketMatch | null>(null);

  const fetchBracket = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/bracket`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBracket(data);
    } catch (e) {
      alert('Erreur lors du chargement du bracket');
    } finally {
      setLoading(false);
    }
  };

  const handleGenererBracket = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/bracket/generer`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      await fetchBracket();
    } catch {
      alert('Erreur lors de la génération du bracket');
    } finally {
      setLoading(false);
    }
  };

  const handleGenererNextRound = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/bracket/next-round`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      await fetchBracket();
    } catch {
      alert('Erreur lors de la génération du prochain tour');
    } finally {
      setLoading(false);
    }
  };

  const updateMatch = async (matchId: number, updates: Partial<Match>) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/matchs/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      fetchBracket();
    } catch (e) {
      alert('Erreur lors de la mise à jour du match');
    }
  };

  useEffect(() => {
    fetchBracket();
  }, [tournoiId]);

  const matchsParRound: { [round: number]: BracketMatch[] } = {};
  bracket.forEach(match => {
    if (!matchsParRound[match.round]) matchsParRound[match.round] = [];
    matchsParRound[match.round].push(match);
  });

  const afficherMatch = (match: BracketMatch) =>
    match.competiteur1 || match.competiteur2;

  const maxRound = Math.max(...bracket.map(m => m.round ?? 1), 1);

  const finaleMatch = matchsParRound[maxRound]?.find(afficherMatch);
  const isFinale = matchsParRound[maxRound]?.length === 1 && maxRound >= 1;
  const finaleJouee =
    isFinale &&
    finaleMatch &&
    ((finaleMatch.scoreP1 ?? 0) !== 0 || (finaleMatch.scoreP2 ?? 0) !== 0);

  const totalMatchs = Object.values(matchsParRound)
    .reduce((sum, matches) => sum + matches.length, 0);

  return (
    <div className="page-bracket container py-4 mx-auto text-dark">
      <h1 className="text-center mb-4 text-o-primary font-weight-bold display-5">
        Tableau final / Bracket
      </h1>
      <p className="text-center mb-4 h5 font-weight-semibold text-o-primary">
        Affichage du bracket du tournoi
      </p>
      <div className="d-flex justify-content-center gap-3 mb-4">
        {bracket.length === 0 && (
          <ButtonPrimaryy onClick={handleGenererBracket} disabled={loading}>
            Générer le tableau final (Bracket)
          </ButtonPrimaryy>
        )}
        {bracket.length > 0 && !isFinale && (
          <ButtonPrimaryy onClick={handleGenererNextRound} disabled={loading}>
            Générer le prochain tour
          </ButtonPrimaryy>
        )}
        {isFinale && finaleJouee && (
          <ButtonPrimaryy
            onClick={() => router.push(`/resultats/${tournoiId}`)}
            disabled={loading}
          >
            Résultats
          </ButtonPrimaryy>
        )}
      </div>
      {loading && <div className="text-center mb-4">Chargement…</div>}

      {Array.from({ length: maxRound }, (_, idx) => idx + 1).map(round => {
        const title =
          totalMatchs === 1 && round === 1
            ? 'Finale'
            : round === 1
            ? 'Quarts de finale'
            : round === 2
            ? 'Demi-finales'
            : round === 3
            ? 'Finale'
            : `Tour ${round}`;

        return (
          <BracketSection
            key={round}
            title={title}
            matchs={matchsParRound[round] || []}
            onGererCombat={match => {
              setMatchActif(match);
              setShowModal(true);
            }}
          />
        );
      })}

      {showModal && matchActif && (
        <CombatModal
          match={matchActif}
          onClose={() => setShowModal(false)}
          onScoreUpdate={updateMatch}
        />
      )}
    </div>
  );
}
