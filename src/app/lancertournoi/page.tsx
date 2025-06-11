'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Tournoi {
  id: number;
  nom: string;
  date: string;
  systemeElimination: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export default function LancerTournoiPage() {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    setRole(r);

    if (!['a', 'g'].includes(r || '')) {
      router.push('/unauthorized');
      return;
    }

    const fetchTournois = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/mes-tournois`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erreur de chargement des tournois');
        const data = await res.json();
        setTournois(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTournois();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Voulez-vous vraiment supprimer ce tournoi ?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/tournois/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      setTournois(tournois.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Échec de la suppression');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/lancertournoi/${id}/modifier`);
  };

  return (
    <div className="text-o-primary" style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '24px' }}>
        Tournois que vous avez créés
      </h1>
      {tournois.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Aucun tournoi pour le moment.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nom</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Système</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournois.map((tournoi) => (
              <tr key={tournoi.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{tournoi.nom}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{tournoi.date}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{tournoi.systemeElimination}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', display: 'flex', gap: '6px' }}>
                  <button
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/poules/${tournoi.id}/matchs`)}
                  >
                    Lancer
                  </button>
                  <button
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleEdit(tournoi.id)}
                  >
                    Modifier
                  </button>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDelete(tournoi.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
