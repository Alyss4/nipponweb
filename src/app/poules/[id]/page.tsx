"use client";

import { useParams } from 'next/navigation';
import { Select, Input, ButtonPrimaryy, ButtonSecondaryy } from '@/components/ui/ComponentForm';
import { useEffect, useState } from 'react';
import DragDropPoules from '@/components/componentsPages/DragDropPoules';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Competiteur {
  id: number;
  nom: string;
  prenom: string;
}

interface Poule {
  id: number;
  competiteurs: Competiteur[];
}

interface Match {
  joueur1: Competiteur | null;
  joueur2: Competiteur | null;
}

export default function Poules() {
  const params = useParams();
  const tournoiId = params.id;
  const [modeGestion, setModeGestion] = useState<'automatique' | 'manuelle' | ''>('');
  const [competiteurs, setCompetiteurs] = useState<Competiteur[]>([]);
  const [poules, setPoules] = useState<Poule[]>([]);
  const [matchs, setMatchs] = useState<Match[]>([]);
  const [nombrePoulesInput, setNombrePoulesInput] = useState<string>('1');
  const router = useRouter();
  const [tournoi, setTournoi] = useState<{ systemeElimination?: string }>({});

  const options = [
    { value: '', label: '-- Choisir un mode --' },
    { value: 'automatique', label: 'Automatique' },
    { value: 'manuelle', label: 'Manuelle' },
  ];

  useEffect(() => {
    const fetchCompetiteurs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/competiteurs`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des compétiteurs");
        const data = await response.json();
        setCompetiteurs(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };
    if (modeGestion && tournoiId) {
      fetchCompetiteurs();
    }
  }, [modeGestion, tournoiId]);

  useEffect(() => {
    const nombrePoules = parseInt(nombrePoulesInput) || 1;
    if (modeGestion === 'manuelle' && competiteurs.length > 0) {
      const poulesVides: Poule[] = Array.from({ length: nombrePoules }, (_, i) => ({
        id: i + 1,
        competiteurs: poules[i]?.competiteurs || [],
      }));
      setPoules(poulesVides);
    }
  }, [modeGestion, competiteurs, nombrePoulesInput]);

  useEffect(() => {
    const fetchTournoi = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/tournois/${tournoiId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération du tournoi");
        const data = await response.json();
        setTournoi(data);
      } catch (error) {
        console.error("Erreur tournoi:", error);
      }
    };
    if (tournoiId) {
      fetchTournoi();
    }
  }, [tournoiId]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const generateEliminationDirecte = () => {
    const shuffled = shuffleArray(competiteurs);
    const total = shuffled.length;
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(total)));
    const byes = nextPowerOf2 - total;
    const extended = [...shuffled, ...Array(byes).fill(null)];
    const firstRound: Match[] = [];
    for (let i = 0; i < extended.length; i += 2) {
      firstRound.push({
        joueur1: extended[i] || null,
        joueur2: extended[i + 1] || null,
      });
    }
    setPoules([{ id: 1, competiteurs: shuffled }]);
    setMatchs(firstRound);
  };

  const generatePoules = () => {
    if (!tournoi.systemeElimination) {
      alert("Aucun système d’élimination défini pour ce tournoi.");
      return;
    }
    const competiteursShuffled = shuffleArray(competiteurs);
    const nombrePoules = parseInt(nombrePoulesInput) || 1;

    switch (tournoi.systemeElimination) {
      case 'Poule ( tous contre tous )': {
        const poulesPoule: Poule[] = Array.from({ length: nombrePoules }, (_, index) => ({
          id: index + 1,
          competiteurs: [],
        }));
        competiteursShuffled.forEach((competiteur, index) => {
          poulesPoule[index % nombrePoules].competiteurs.push(competiteur);
        });
        setPoules(poulesPoule);
        setMatchs([]);
        break;
      }
      case 'Poule ( Tableau final )':
      {
        const poulesTableauFinal: Poule[] = Array.from({ length: nombrePoules }, (_, index) => ({
          id: index + 1,
          competiteurs: [],
        }));
        competiteursShuffled.forEach((competiteur, index) => {
          poulesTableauFinal[index % nombrePoules].competiteurs.push(competiteur);
        });
        setPoules(poulesTableauFinal);
        setMatchs([]);
        break;
      }
      case 'Elimination directe': {
        generateEliminationDirecte();
        break;
      }
      case 'Round robin': {
        const pouleUnique: Poule[] = [{
          id: 1,
          competiteurs: competiteursShuffled,
        }];
        setPoules(pouleUnique);
        const matchsRR: Match[] = [];
        for (let i = 0; i < competiteursShuffled.length; i++) {
          for (let j = i + 1; j < competiteursShuffled.length; j++) {
            matchsRR.push({
              joueur1: competiteursShuffled[i],
              joueur2: competiteursShuffled[j],
            });
          }
        }
        setMatchs(matchsRR);
        break;
      }
      case 'Double elimination':
      case 'Tableau final': {
        const uniquePoule: Poule[] = [{
          id: 1,
          competiteurs: competiteursShuffled,
        }];
        setPoules(uniquePoule);
        setMatchs([]);
        break;
      }
      case 'Système suisse': {
        alert("Le système suisse nécessite une logique d’appariement spécifique. À implémenter.");
        setPoules([]);
        setMatchs([]);
        break;
      }
      default:
        alert("Système d’élimination non reconnu.");
        break;
    }
  };
  const handleSavePoules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/poules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          poules: poules.map((p, index) => ({
            numero: index + 1,
            competiteurs: p.competiteurs.map(c => ({ id: c.id })),
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        alert("Erreur lors de l'enregistrement des poules.");
        return;
      }

      alert("Poules enregistrées avec succès !");
      router.push(`/poules/${tournoiId}/matchs`);
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur de communication avec le serveur.");
    }
  };
  return (
    <div className="text-o-primary p-5">
      <h1 className="text-2xl font-bold mb-4">
        Création des Poules pour le tournoi #{tournoiId}
      </h1>

      <Select
        label=""
        value={modeGestion}
        onChange={(e) => {
          setModeGestion(e.target.value as 'automatique' | 'manuelle');
          setPoules([]);
          setMatchs([]);
        }}
        options={options}
      />

      <Input
        label="Nombre de poules"
        type="number"
        placeholder="Ex: 4"
        value={nombrePoulesInput}
        onChange={(e) => setNombrePoulesInput(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <ButtonPrimaryy onClick={generatePoules}>Générer les Poules</ButtonPrimaryy>
        <ButtonPrimaryy onClick={handleSavePoules}>Enregistrer les poules</ButtonPrimaryy>
        <ButtonSecondaryy onClick={() => { setPoules([]); setMatchs([]); }}>Réinitialiser</ButtonSecondaryy>
        
      </div>

      {modeGestion === 'manuelle' && (
        <div className="mt-6 drag-drop-wrapper">
          <DragDropPoules
            poules={poules}
            setPoules={setPoules}
            competiteurs={competiteurs}
          />
        </div>
      )}


      {poules.length > 0 && modeGestion !== 'manuelle' && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Poules générées :</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {poules.map((poule, index) => (
              <div
                key={poule.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-5"
              >
                <h4 className="text-xl font-semibold mb-2 text-blue-700">Poule {index + 1}</h4>
                {poule.competiteurs.length === 0 ? (
                  <p className="italic text-gray-500">Aucun compétiteur</p>
                ) : (
                  <ul className="list-disc ml-5 space-y-1 text-gray-700">
                    {poule.competiteurs.map((competiteur) => (
                      <li key={competiteur?.id}>
                        {competiteur?.prenom} {competiteur?.nom}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {matchs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Matchs (Premier tour élimination directe) :</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-700">
            {matchs.map((match, index) => (
              <li key={index}>
                {match.joueur1?.prenom || 'BYE'} {match.joueur1?.nom || ''} vs {match.joueur2?.prenom || 'BYE'} {match.joueur2?.nom || ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}