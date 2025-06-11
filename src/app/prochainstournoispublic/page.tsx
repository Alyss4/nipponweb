'use client';

import React, { useEffect, useState } from 'react';
import ProchainsTournoisTable from '@/components/componentsTables/ProchainsTournoisTable';
import { ButtonSecondaryy } from '@/components/ui/ComponentForm';
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function ProchainsTournoisPublic() {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const [selectedTournoi, setSelectedTournoi] = useState<Tournoi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        // Appel SANS token
        const [gradesRes, catRes] = await Promise.all([
          fetch(`${API_BASE_URL}/grades`),
          fetch(`${API_BASE_URL}/categories`)
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
        // Toujours l'id = 0 (anonyme/public)
        const url = `${API_BASE_URL}/tournoisPublics`;
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        if (Array.isArray(data)) {
          setTournois(data);
        }
      } catch (error) {
        console.error('Erreur lors du fetch des tournois publics :', error);
      }
    };
    fetchTournoisPublics();
  }, []);

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
        }}
        idUtilisateurCourant={0} // anonyme
        hideInscrits={false}
        showNonInscrits={false}
        sortByDate={null}
        etatGlobal={null}
        setHideInscrits={() => {}}
        setShowNonInscrits={() => {}}
        setSortByDate={() => {}}
        setEtatGlobal={() => {}}
        grades={grades}
        categories={categories}
      />

      {selectedTournoi && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 my-4">
          {/* PAS DE BOUTON INSCRIPTION */}
          <ButtonSecondaryy onClick={() => setIsModalOpen(true)}>
            Détails
          </ButtonSecondaryy>
        </div>
      )}

      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: Math.ceil(tournois.length / itemsPerPage) }, (_, index) => (
          <ButtonSecondaryy
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'font-bold' : ''}
          >
            {index + 1}
          </ButtonSecondaryy>
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
