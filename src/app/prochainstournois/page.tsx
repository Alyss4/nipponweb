'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProchainsTournoisTable from '@/components/componentsTables/ProchainsTournoisTable';
import {
  ButtonPrimaryy,
  ButtonSecondaryy,
  Checkbox,
  Select,
} from '@/components/ui/ComponentForm';
import LaModal from '@/components/ui/Modal';

interface Tournoi {
  id: number;
  id_categorie?: number;
  id_grade_min?: number;
  id_grade_max?: number;
  systemeElimination?: string;
  lieu?: string;
  date?: string;
  nom?: string;
  etat?: 'en_attente' | 'en_cours' | 'termine';
  created_at?: string;
  updated_at?: string;
  id_utilisateur?: number;
  nombre_poules?: number;
  nombre_participants?: number;
  description?: string;
  is_public?: boolean | number;
}

interface Grade {
  id: number;
  nom: string;
}

interface Categorie {
  id: number;
  nom: string;
}

export default function ProchainsTournois() {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const [selectedTournoi, setSelectedTournoi] = useState<Tournoi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hideInscrits, setHideInscrits] = useState(false);
  const [showNonInscrits, setShowNonInscrits] = useState(false);
  const [sortByDate, setSortByDate] = useState<string | null>(null);
  const [etat, setEtat] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [inscriptionDisabled, setInscriptionDisabled] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);

  const router = useRouter();

  const idUtilisateurCourant =
    typeof window !== 'undefined'
      ? parseInt(localStorage.getItem('userId') || '0', 10)
      : 0;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const token = localStorage.getItem('token') || '';

        const [gradesRes, catRes] = await Promise.all([
          fetch('http://localhost:8000/api/grades', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/api/categories', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const gradesData = await gradesRes.json();
        const categoriesData = await catRes.json();

        setGrades(gradesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Erreur chargement des grades/catégories', err);
      }
    };

    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchTournoisPublics = async () => {
      try {
        const params = new URLSearchParams();
        if (hideInscrits) params.append('hideInscrits', 'true');
        if (showNonInscrits) params.append('showNonInscrits', 'true');
        if (sortByDate) params.append('sortByDate', sortByDate);
        if (etat) params.append('etat', etat);

        const userId = localStorage.getItem('userId') || '0';
        const token = localStorage.getItem('token') || '';

        const url = `http://localhost:8000/api/tournoisPublic/${userId}?${params.toString()}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setTournois(data);
        }
      } catch (error) {
        console.error('Erreur lors du fetch des tournois publics :', error);
      }
    };

    fetchTournoisPublics();
  }, [hideInscrits, showNonInscrits, sortByDate, etat]);

  const handleInscription = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const tournoiId = selectedTournoi?.id;
      if (!tournoiId) return;

      const userRes = await fetch(
        'http://localhost:8000/api/getIDCompetiteurUtilisateur',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userRes.json();

      if (!userData.id_competiteur) {
        router.push(`/inscriptiontournois?id=${tournoiId}`);
        return;
      }

      const insRes = await fetch(
        'http://localhost:8000/api/inscrireAuTournoiDejaCompetiteur',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_tournoi: tournoiId,
            id_competiteur: userData.id_competiteur,
          }),
        }
      );

      const insData = await insRes.json();

      if (insRes.ok) {
        setMessage('✅ Inscription réussie au tournoi.');
        setInscriptionDisabled(true);
      } else {
        setMessage(`❌ ${insData.message || "Erreur lors de l'inscription."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const indexOfLastTournoi = currentPage * itemsPerPage;
  const indexOfFirstTournoi = indexOfLastTournoi - itemsPerPage;
  const currentTournois = tournois.slice(indexOfFirstTournoi, indexOfLastTournoi);

  const getGradeName = (id?: number) => grades.find(g => g.id === id)?.nom ?? '-';
  const getCategorieName = (id?: number) => categories.find(c => c.id === id)?.nom ?? '-';

  return (
    <div className="container mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-o-primary">Prochains Tournois</h1>
      </div>

      <ProchainsTournoisTable
        tournois={currentTournois}
        onSelectTournoi={(tournoi) => {
          setSelectedTournoi(tournoi);
          setMessage(null);
          setInscriptionDisabled(false);
        }}
        idUtilisateurCourant={idUtilisateurCourant}
        hideInscrits={hideInscrits}
        showNonInscrits={showNonInscrits}
        sortByDate={sortByDate}
        etatGlobal={etat}
        setHideInscrits={setHideInscrits}
        setShowNonInscrits={setShowNonInscrits}
        setSortByDate={setSortByDate}
        setEtatGlobal={setEtat}
        grades={grades}
        categories={categories}
      />

      {selectedTournoi && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 my-4">
          <ButtonPrimaryy onClick={handleInscription} disabled={inscriptionDisabled}>
            {inscriptionDisabled ? 'Déjà inscrit' : "S'inscrire au tournoi"}
          </ButtonPrimaryy>
          <ButtonSecondaryy onClick={() => setIsModalOpen(true)}>
            Détails
          </ButtonSecondaryy>
          {message && (
            <div className="text-sm text-o-primary font-semibold mt-2">
              {message}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: Math.ceil(tournois.length / itemsPerPage) }, (_, index) => (
          <ButtonPrimaryy
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'font-bold' : ''}
          >
            {index + 1}
          </ButtonPrimaryy>
        ))}
      </div>

      <LaModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Détails du Tournoi"
        tournoi={selectedTournoi}
      >
        {selectedTournoi && (
          <div className="mt-4">
            <Info label="Nom" value={selectedTournoi.nom} />
            <Info label="Date" value={selectedTournoi.date} />
            <Info label="Lieu" value={selectedTournoi.lieu} />
            <Info label="Système" value={getSystemeLabel(selectedTournoi.systemeElimination)} />
            <Info label="Catégorie" value={getCategorieName(selectedTournoi.id_categorie)} />
            <Info label="Grade Min" value={getGradeName(selectedTournoi.id_grade_min)} />
            <Info label="Grade Max" value={getGradeName(selectedTournoi.id_grade_max)} />
            <Info label="Participants" value={selectedTournoi.nombre_participants?.toString()} />
            <Info label="Poules" value={selectedTournoi.nombre_poules?.toString()} />
            <Info label="État" value={getEtatLabel(selectedTournoi.etat)} />
            <Info label="Public" value={selectedTournoi.is_public ? 'Oui' : 'Non'} />
          </div>
        )}
      </LaModal>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', marginBottom: '8px' }}>
      <div style={{ width: '140px', fontWeight: 600, color: '#023047' }}>{label}</div>
      <div style={{ color: '#023047' }}>{value}</div>
    </div>
  );
};

const getEtatLabel = (etat?: string) => {
  switch (etat) {
    case 'en_attente': return 'En attente';
    case 'en_cours': return 'En cours';
    case 'termine': return 'Terminé';
    default: return '-';
  }
};

const getSystemeLabel = (code?: string) => {
  switch (code) {
    case 'S': return 'Élimination simple';
    case 'D': return 'Élimination double';
    default: return '-';
  }
};
