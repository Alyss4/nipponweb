'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ButtonPrimaryy } from '@/components/ui/ComponentForm';

interface Competiteur {
  id: number;
  prenom: string;
  nom: string;
}

interface Classement {
  competiteur: Competiteur;
  points: number;
  classement: number;
}

interface PouleClassement {
  id: number;
  numero: number;
  classement: Classement[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function ResultatsPoulesPage() {
  const { id: tournoiId } = useParams();
  const router = useRouter();
  const [classements, setClassements] = useState<PouleClassement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassements = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${API_BASE_URL}/tournois/${tournoiId}/classement-poules`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setClassements(data);
      } catch (e) {
        alert('Erreur lors du chargement du classement des poules.');
      } finally {
        setLoading(false);
      }
    };
    if (tournoiId) fetchClassements();
  }, [tournoiId]);

  if (loading) {
    return <div className="text-center my-5">Chargement…</div>;
  }

  if (!classements.length) {
    return (
      <div className="container py-5">
        <h1 className="text-center text-o-primary mb-4 display-6">Classement des Poules</h1>
        <div className="alert alert-warning text-center">
          Aucun classement disponible pour ce tournoi.
        </div>
        <div className="text-center mt-4">
          <ButtonPrimaryy onClick={() => router.back()}>Retour</ButtonPrimaryy>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 page-resultats mx-auto" style={{ maxWidth: 540 }}>
      <h1 className="text-center text-o-primary mb-4 display-6">
        Classement des Poules
      </h1>
      {classements
        .sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0))
        .map((poule, idx) => (
          <div key={poule.id} className="card shadow mb-4">
            <div className="card-body px-4 py-3">
              <h2 className="text-center mb-3 h5 text-red-500 font-bold">
                Poule n°{idx + 1}
              </h2>
              <div className="table-responsive">
                <table className="table mb-2">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poule.classement.map((c, cidx) => (
                      <tr key={c.competiteur.id} className={cidx === 0 ? 'bg-green-100 font-bold' : ''}>
                        <td>{c.classement}</td>
                        <td>{c.competiteur.nom}</td>
                        <td>{c.competiteur.prenom}</td>
                        <td>{c.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      <div className="text-center mt-4">
        <ButtonPrimaryy onClick={() => router.push('/')}>
          Retour à l'accueil
        </ButtonPrimaryy>
      </div>
    </div>
  );
}
