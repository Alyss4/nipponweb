'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Match, Competiteur } from '@/types/types';
import { ButtonPrimaryy } from '@/components/ui/ComponentForm';

interface BracketMatch extends Match {
  round: number;
  numero: number;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function ResultatsPage() {
  const { id: tournoiId } = useParams();
  const router = useRouter();
  const [finale, setFinale] = useState<BracketMatch | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFinale = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/bracket`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: BracketMatch[] = await res.json();
        const maxRound = Math.max(...data.map(m => m.round ?? 1), 1);
        const finaleMatch = data.find(m => m.round === maxRound);
        setFinale(finaleMatch ?? null);
      } catch {
        alert('Erreur lors du chargement des résultats');
      } finally {
        setLoading(false);
      }
    };
    if (tournoiId) fetchFinale();
  }, [tournoiId]);

  const getGagnant = (m: BracketMatch) => {
    if (!m) return null;
    if ((m.scoreP1 ?? 0) > (m.scoreP2 ?? 0)) return m.competiteur1;
    if ((m.scoreP2 ?? 0) > (m.scoreP1 ?? 0)) return m.competiteur2;
    return null; 
  };

  if (loading) {
    return <div className="text-center my-5">Chargement…</div>;
  }

  if (!finale) {
    return (
      <div className="container py-5">
        <h1 className="text-center text-o-primary mb-4 display-6">Résultats</h1>
        <div className="alert alert-warning text-center">
          Finale non trouvée ou tournoi non terminé.
        </div>
        <div className="text-center mt-4">
          <ButtonPrimaryy onClick={() => router.back()}>Retour</ButtonPrimaryy>
        </div>
      </div>
    );
  }

  const gagnant = getGagnant(finale);
  const perdant =
    gagnant === finale.competiteur1 ? finale.competiteur2 : finale.competiteur1;

  return (
    <div className="container py-5 page-resultats mx-auto" style={{ maxWidth: 500 }}>
      <h1 className="text-center text-o-primary mb-4 display-6">
        Résultats - Finale
      </h1>
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="text-center mb-4 h4 text-o-primary font-weight-bold">
            {finale.competiteur1?.prenom} {finale.competiteur1?.nom} vs {finale.competiteur2?.prenom} {finale.competiteur2?.nom}
          </h3>
          <div className="d-flex justify-content-center align-items-center mb-3 gap-3">
            <span className="h5 mb-0">{finale.competiteur1?.prenom} {finale.competiteur1?.nom}</span>
            <span className="h3 text-o-primary font-weight-bold mx-2">
              {finale.scoreP1 ?? 0} - {finale.scoreP2 ?? 0}
            </span>
            <span className="h5 mb-0">{finale.competiteur2?.prenom} {finale.competiteur2?.nom}</span>
          </div>
          <div className="text-center mt-3">
            {gagnant ? (
              <div className="alert alert-success">
                🥇 <strong>Vainqueur : {gagnant.prenom} {gagnant.nom}</strong>
              </div>
            ) : (
              <div className="alert alert-warning">
                Match nul ou résultat non disponible.
              </div>
            )}
            {perdant && (
              <div className="mt-2">
                🥈 <strong>Finaliste : {perdant.prenom} {perdant.nom}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <ButtonPrimaryy onClick={() => router.push(`/`)}>Retour à l'accueil</ButtonPrimaryy>
      </div>
    </div>
  );
}
