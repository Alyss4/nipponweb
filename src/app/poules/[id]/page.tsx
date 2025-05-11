'use client';
import { useParams } from 'next/navigation';
import { Select } from '@/components/componentsUI/ComponentForm';
import { useEffect, useState } from 'react';
import DragDropPoules from '@/components/componentsPages/DragDropPoules';
import { useRouter } from 'next/navigation';

interface Competiteur {
  id: number;
  nom: string;
  prenom: string;
}

interface Poule {
  id: number;
  competiteurs: Competiteur[];
}

export default function Poules() {
  const params = useParams();
  const tournoiId = params.id;
  const [modeGestion, setModeGestion] = useState<'automatique' | 'manuelle' | ''>('');
  const [competiteurs, setCompetiteurs] = useState<Competiteur[]>([]);
  const [poules, setPoules] = useState<Poule[]>([]);
  const router = useRouter();

  const options = [
    { value: '', label: '-- Choisir un mode --' },
    { value: 'automatique', label: 'Automatique' },
    { value: 'manuelle', label: 'Manuelle' },
  ];

  useEffect(() => {
    const fetchCompetiteurs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/tournois/${tournoiId}/competiteurs`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des compétiteurs");
        }

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
    if (modeGestion === 'manuelle' && competiteurs.length > 0 && poules.length === 0) {
      const nombrePoules = Math.ceil(competiteurs.length / 4);
      const poulesVides: Poule[] = Array.from({ length: nombrePoules }, (_, i) => ({
        id: i + 1,
        competiteurs: [],
      }));
      setPoules(poulesVides);
    }
  }, [modeGestion, competiteurs, poules]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const generatePoules = () => {
    const competiteursShuffled = shuffleArray(competiteurs);
    const total = competiteursShuffled.length;
    let nombrePoules = Math.ceil(total / 4);
    if (total / nombrePoules > 5) nombrePoules += 1;

    const poulesTemp: Poule[] = Array.from({ length: nombrePoules }, (_, index) => ({
      id: index + 1,
      competiteurs: [],
    }));

    competiteursShuffled.forEach((competiteur, index) => {
      poulesTemp[index % nombrePoules].competiteurs.push(competiteur);
    });

    setPoules(poulesTemp);
  };

  const handlePouleRemove = (competiteurId: number, pouleIndex: number) => {
    setPoules((prevPoules) => {
      const newPoules = [...prevPoules];
      newPoules[pouleIndex].competiteurs = newPoules[pouleIndex].competiteurs.filter(
        (c) => c.id !== competiteurId
      );
      return newPoules;
    });
  };

  const handleResetPoules = () => {
    setPoules([]);
  };

  const handleExportPoulesCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Poule,ID,Nom,Prénom\n";

    poules.forEach((poule) => {
      poule.competiteurs.forEach((competiteur) => {
        csvContent += `Poule ${poule.id},${competiteur.id},${competiteur.nom},${competiteur.prenom}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `poules-tournoi-${tournoiId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    const handleSavePoules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/tournois/${tournoiId}/poules`, {
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

      <p className="mb-2">Veuillez sélectionner le mode de gestion des poules :</p>
      <Select
        label=""
        value={modeGestion}
        onChange={(e) => {
          setModeGestion(e.target.value as 'automatique' | 'manuelle');
          setPoules([]);
        }}
        options={options}
      />

      {modeGestion === 'automatique' && (
        <div className="mt-4">
          <p>Vous avez choisi la <strong>gestion automatique</strong> des poules.</p>
          <p className="mt-2">Nombre de compétiteurs : {competiteurs.length}</p>
          <button onClick={generatePoules} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Générer les Poules
          </button>

          <div className="flex gap-2 mt-4">
            <button onClick={handleResetPoules} className="p-2 bg-yellow-500 text-white rounded">
              Réinitialiser les Poules
            </button>
            {poules.length > 0 && (
              <>
                <button onClick={handleExportPoulesCSV} className="p-2 bg-gray-700 text-white rounded">
                  Exporter CSV
                </button>
                <button onClick={handleSavePoules} className="p-2 bg-green-600 text-white rounded">
                  Enregistrer les poules
                </button>
              </>
            )}
          </div>

          {poules.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Poules générées :</h3>
              {poules.map((poule, index) => (
                <div key={poule.id} className="mt-2">
                  <h4 className="font-bold">Poule {index + 1}</h4>
                  <ul className="list-disc ml-5">
                    {poule.competiteurs.map((competiteur) => (
                      <li key={competiteur.id}>
                        {competiteur.prenom} {competiteur.nom}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {modeGestion === 'manuelle' && (
        <div className="mt-4">
          <p>Vous avez choisi la <strong>gestion manuelle</strong> des poules.</p>
          <p className="mt-2">Nombre de compétiteurs : {competiteurs.length}</p>
          <DragDropPoules
            poules={poules}
            setPoules={setPoules}
            competiteurs={competiteurs}
          />
          <div className="flex gap-2 mt-4">
            <button onClick={handleResetPoules} className="p-2 bg-yellow-500 text-white rounded">
              Réinitialiser les Poules
            </button>
            {poules.length > 0 && (
              <>
                <button onClick={handleExportPoulesCSV} className="p-2 bg-gray-700 text-white rounded">
                  Exporter CSV
                </button>
                <button onClick={handleSavePoules} className="p-2 bg-green-600 text-white rounded">
                  Enregistrer les poules
                </button>
              </>
            )}
          </div>

          {poules.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Aperçu des Poules :</h3>
              {poules.map((poule, index) => (
                <div key={poule.id} className="mt-4 border border-gray-300 rounded p-3">
                  <h4 className="font-bold">Poule {index + 1}</h4>
                  {poule.competiteurs.length === 0 ? (
                    <p className="italic text-gray-500">Aucun compétiteur</p>
                  ) : (
                    <ul className="list-disc ml-5">
                      {poule.competiteurs.map((competiteur) => (
                        <li key={competiteur.id} className="flex justify-between items-center">
                          {competiteur.prenom} {competiteur.nom}
                          <button
                            onClick={() => handlePouleRemove(competiteur.id, index)}
                            className="ml-4 p-1 px-2 bg-red-500 text-white rounded"
                          >
                            Retirer
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
