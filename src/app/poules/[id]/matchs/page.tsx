'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Competiteur {
  id: number;
  nom: string;
  prenom: string;
}

interface Match {
  id: number;
  id_competiteur1: number;
  id_competiteur2: number;
  scoreP1: number;
  scoreP2: number;
  penaliteP1: number;
  penaliteP2: number;
  competiteur1: Competiteur;
  competiteur2: Competiteur;
}

interface Poule {
  id: number;
  numero: number;
  competiteurs: Competiteur[];
}

export default function MatchsPage() {
  const { id: tournoiId } = useParams();
  const [poules, setPoules] = useState<Poule[]>([]);
  const [matchsParPoule, setMatchsParPoule] = useState<Record<number, Match[]>>({});

  useEffect(() => {
    const fetchPoules = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/tournois/${tournoiId}/poules-avec-competiteurs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        if (!response.ok) throw new Error("Erreur lors du chargement des poules");
        const data = await response.json();
        setPoules(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (tournoiId) fetchPoules();
  }, [tournoiId]);

  const genererMatchs = async (pouleId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/poules/${pouleId}/matchs/generer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la génération des matchs");

      await fetchMatchs(pouleId); 
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMatchs = async (pouleId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/poules/${pouleId}/matchs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors du chargement des matchs");

      const data = await response.json();
          console.log(data);
      setMatchsParPoule(prev => ({ ...prev, [pouleId]: data }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 text-o-primary">
      <h1 className="text-2xl font-bold">Matchs pour le tournoi #{tournoiId}</h1>

      {poules.map((poule) => (
        <div key={poule.id} className="mt-4 border p-3 rounded">
          <h2 className="text-lg font-semibold mb-2">Poule {poule.numero}</h2>

          {Array.isArray(poule.competiteurs) && poule.competiteurs.map(c => (
            <li key={c.id}>{c.prenom} {c.nom}</li>
          ))}


          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => genererMatchs(poule.id)}
          >
            Générer les matchs
          </button>

          {matchsParPoule[poule.id]?.length > 0 && (
            <div className="mt-3">
              <h3 className="font-semibold">Matchs :</h3>
              <ul className="list-disc ml-6">
                {matchsParPoule[poule.id].map(match => (
                  <li key={match.id}>
                    {match.competiteur1?.prenom} {match.competiteur1?.nom} vs {match.competiteur2?.prenom} {match.competiteur2?.nom} — 
                    Score: {match.scoreP1} - {match.scoreP2}, Pénalités: {match.penaliteP1} - {match.penaliteP2}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
