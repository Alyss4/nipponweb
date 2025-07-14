'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input, Select, Checkbox, ButtonPrimaryy } from '@/components/ui/ComponentForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Tournoi {
  id: number;
  nom: string;
  date: string;
  systemeElimination: string;
  lieu: string;
  sponsor?: string;
  etat: string;
  genre: string;
  id_utilisateur: number;
  id_categorie?: number;
  id_grade_min?: number;
  id_grade_max?: number;
  nombre_poules?: number;
  nombre_participants?: number;
  description?: string;
  is_public: number;
}

export default function ModifierTournoiPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournoi = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/tournois/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTournoi(data);
      setLoading(false);
    };
    fetchTournoi();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/tournois/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tournoi),
    });
    if (res.ok) {
      alert('Tournoi modifié avec succès');
      router.push('/lancertournoi');
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading || !tournoi) return <p style={{ textAlign: 'center' }}>Chargement...</p>;

  const updateField = <K extends keyof Tournoi>(key: K, value: Tournoi[K]) => {
    setTournoi(prev => prev ? { ...prev, [key]: value } : prev);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px' }}>
      <h2 className="text-center mb-4">Modifier le tournoi</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Nom"
            type="text"
            placeholder="Nom du tournoi"
            value={tournoi.nom}
            onChange={(e) => updateField('nom', e.target.value)}
            required
          />
        </div>

        <Input
          label="Lieu"
          type="text"
          value={tournoi.lieu}
          onChange={(e) => updateField('lieu', e.target.value)}
          placeholder="Lieu"
          required
        />

        <Input
          label="Date"
          type="date"
          value={tournoi.date}
          onChange={(e) => updateField('date', e.target.value)}
          placeholder=""
          required
        />

        <Input
          label="Sponsor"
          type="text"
          value={tournoi.sponsor ?? ''}
          onChange={(e) => updateField('sponsor', e.target.value)}
          placeholder="Sponsor"
        />

        <Input
          label="Nombre de participants"
          type="number"
          value={tournoi.nombre_participants !== undefined ? String(tournoi.nombre_participants) : ''}
          onChange={(e) => updateField('nombre_participants', Number(e.target.value))}
          placeholder=""
        />

        <Input
          label="Nombre de poules"
          type="number"
          value={tournoi.nombre_poules !== undefined ? String(tournoi.nombre_poules) : ''}
          onChange={(e) => updateField('nombre_poules', Number(e.target.value))}
          placeholder=""
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Description"
            type="text"
            value={tournoi.description ?? ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder=""
          />
        </div>

        <Select
          label="Système d'élimination"
          value={tournoi.systemeElimination}
          onChange={(e) => updateField('systemeElimination', e.target.value)}
          options={[
            { value: 'Poule', label: 'Poule' },
            { value: 'Round robin', label: 'Round robin' },
            { value: 'Elimination directe', label: 'Élimination directe' },
            { value: 'Double elimination', label: 'Double élimination' },
            { value: 'Tableau final', label: 'Tableau final' },
            { value: 'Système suisse', label: 'Système suisse' },
          ]}
        />

        <Select
          label="État"
          value={tournoi.etat}
          onChange={(e) => updateField('etat', e.target.value)}
          options={[
            { value: 'en_attente', label: 'En attente' },
            { value: 'en_cours', label: 'En cours' },
            { value: 'termine', label: 'Terminé' },
          ]}
        />

        <Select
          label="Genre"
          value={tournoi.genre}
          onChange={(e) => updateField('genre', e.target.value)}
          options={[
            { value: 'Homme', label: 'Homme' },
            { value: 'Femme', label: 'Femme' },
            { value: 'Mixte', label: 'Mixte' },
          ]}
        />

        <div style={{ alignSelf: 'center' }}>
          <Checkbox
            label="Tournoi public"
            checked={tournoi.is_public === 1}
            onChange={(e) => updateField('is_public', e.target.checked ? 1 : 0)}
          />
        </div>

        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '24px' }}>
          <ButtonPrimaryy type="submit">Enregistrer</ButtonPrimaryy>
        </div>
      </form>
    </div>
  );
}
