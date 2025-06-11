'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PouleSection from '@/components/componentsPages/PouleSectionMatch';
import CombatModal from '@/components/componentsPages/CombatModal';
import { Match, Competiteur } from '@/types/types';
import { ButtonPrimaryy } from '@/components/ui/ComponentForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Poule {
  id: number;
  numero: number;
  competiteurs: Competiteur[];
}

export default function MatchsPage() {
  const router = useRouter();
  const { id: tournoiId } = useParams();
  const [poules, setPoules] = useState<Poule[]>([]);
  const [matchsParPoule, setMatchsParPoule] = useState<Record<number, Match[]>>({});
  const [systeme, setSysteme] = useState<string>('');
  const [matchActif, setMatchActif] = useState<Match | null>(null);

  useEffect(() => {
    const fetchPoulesEtSysteme = async () => {
      try {
        const token = localStorage.getItem('token');
        const tournoiRes = await fetch(`${API_BASE_URL}/tournois/${tournoiId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tournoiData = await tournoiRes.json();
        setSysteme(tournoiData.systemeElimination);
        const poulesRes = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/poules-avec-competiteurs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const poulesData = await poulesRes.json();
        if (!Array.isArray(poulesData)) {
          console.error('Réponse inattendue :', poulesData);
          return;
        }
        setPoules(poulesData);
        if (poulesData.length === 0) {
          router.push(`/poules/${tournoiId}`);
          return;
        }
        for (const poule of poulesData) {
          await fetchMatchs(poule.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (tournoiId) fetchPoulesEtSysteme();
  }, [tournoiId]);

  const genererMatchs = async (pouleId: number) => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      switch (systeme) {
        case 'Poule ( tous contre tous )':
        case 'Poule ( Tableau final )':
        case 'Round robin':
          endpoint = `${API_BASE_URL}/poules/${pouleId}/matchs/generer`;
          break;
        case 'Elimination directe':
          endpoint = `${API_BASE_URL}/poules/${pouleId}/matchs/elimination-directe`;
          break;
        case 'Double elimination':
          endpoint = `${API_BASE_URL}/poules/${pouleId}/matchs/double-elimination`;
          break;
        case 'Tableau final':
          endpoint = `${API_BASE_URL}/poules/${pouleId}/matchs/tableau-final`;
          break;
        default:
          alert('Système d’élimination non pris en charge.');
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la génération des matchs");
      await fetchMatchs(pouleId);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération des matchs.");
    }
  };

  const fetchMatchs = async (pouleId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/poules/${pouleId}/matchs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setMatchsParPoule(prev => ({ ...prev, [pouleId]: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const updateMatch = async (matchId: number, updates: Partial<Match>) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/matchs/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const pouleId = Object.entries(matchsParPoule).find(([_, matchs]) =>
        matchs.some(m => m.id === matchId)
      )?.[0];

      if (pouleId) await fetchMatchs(Number(pouleId));
    } catch (error) {
      console.error("Erreur de mise à jour du match", error);
    }
  };

  const toutesPoulesTerminees =
    Object.values(matchsParPoule).length === poules.length &&
    Object.values(matchsParPoule).every(
      matchs =>
        matchs.length > 0 &&
        matchs.every(
          m =>
            (typeof m.scoreP1 === "number" && typeof m.scoreP2 === "number") &&
            (m.scoreP1 !== 0 || m.scoreP2 !== 0)
        )
    );

  return (
    <div className="p-6 max-w-5xl mx-auto text-o-primary">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-500">Lancer un combat</h1>
      <p className="text-center mb-6 text-lg font-semibold text-slate-800">
        Système d'élimination : <span className="font-bold text-indigo-600">{systeme}</span>
      </p>
      {systeme.toLowerCase().includes("tous contre tous") && toutesPoulesTerminees && (
        <div className="text-center mt-12">
          <ButtonPrimaryy
            className="btn btn-primary text-lg"
            onClick={() => router.push(`/resultats-poules/${tournoiId}`)}
          >
            Voir les résultats des poules
          </ButtonPrimaryy>
        </div>
      )}
      {systeme === "Poule ( Tableau final )" && toutesPoulesTerminees && (
        <div className="text-center mt-12">
          <ButtonPrimaryy
            className="btn btn-primary text-lg"
            onClick={() => router.push(`/bracket/${tournoiId}`)} 
          >
            Lancer le bracket
          </ButtonPrimaryy>
        </div>
      )}

      {poules.map((poule) => (
        <PouleSection
          key={poule.id}
          poule={poule}
          matchs={matchsParPoule[poule.id] || []}
          genererMatchs={genererMatchs}
          onLancerCombat={setMatchActif}
        />
      ))}

      {matchActif && (
        <CombatModal
          match={matchActif}
          onClose={() => setMatchActif(null)}
          onScoreUpdate={updateMatch}
        />
      )}
    </div>
  );
}
