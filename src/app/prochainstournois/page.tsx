'use client';

import React, { useState, useEffect } from 'react';
import ProchainsTournoisTable from '@/components/componentsTables/ProchainsTournoisTable';
import { ButtonPrimaryy, ButtonSecondaryy, Checkbox } from '../../components/componentsUI/ComponentForm';
import LaModal from '../../components/componentsUI/Modal';

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

  const idUtilisateurCourant = typeof window !== 'undefined' ? parseInt(localStorage.getItem('userId') || '0', 10) : 0;

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
        console.log('URL avec paramètres :', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Données reçues :', data);

        // Assurez-vous que la réponse est un tableau avant de le définir
        if (Array.isArray(data)) {
          setTournois(data);
        } else {
          console.error('La réponse n\'est pas un tableau');
        }
      } catch (error) {
        console.error('Erreur lors du fetch des tournois publics :', error);
      }
    };

    fetchTournoisPublics();
  }, [hideInscrits, showNonInscrits, sortByDate, etat]);

  const handleSelectTournoi = (tournoi: Tournoi | null) => {
    setSelectedTournoi(tournoi);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const indexOfLastTournoi = currentPage * itemsPerPage;
  const indexOfFirstTournoi = indexOfLastTournoi - itemsPerPage;
  
  const currentTournois = Array.isArray(tournois) ? tournois.slice(indexOfFirstTournoi, indexOfLastTournoi) : [];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-3 z-0">
      <h1 className="text-2xl font-semibold my-4">Prochains Tournois</h1>

      <ButtonPrimaryy className="mx-2">Filtrer</ButtonPrimaryy>

      <Checkbox
        label="Masquer les tournois où je suis inscrit"
        checked={hideInscrits}
        onChange={(e) => setHideInscrits(e.target.checked)}
      />
      <Checkbox
        label="Afficher les tournois sans mon inscription"
        checked={showNonInscrits}
        onChange={(e) => setShowNonInscrits(e.target.checked)}
      />

      <select onChange={(e) => setSortByDate(e.target.value)} value={sortByDate || ''}>
        <option value="">Trier par date</option>
        <option value="asc">Croissant</option>
        <option value="desc">Décroissant</option>
      </select>

      <select onChange={(e) => setEtat(e.target.value)} value={etat || ''}>
        <option value="">Trier par statut</option>
        <option value="en_attente">En attente</option>
        <option value="en_cours">En cours</option>
        <option value="termine">Terminé</option>
      </select>

      {selectedTournoi && (
        <div className="d-flex justify-end mb-4">
          <ButtonPrimaryy className="mx-2">S'inscrire au tournoi</ButtonPrimaryy>
          <ButtonSecondaryy onClick={openModal}>Voir les détails</ButtonSecondaryy>
        </div>
      )}

      {!isModalOpen && (
        <ProchainsTournoisTable
          tournois={currentTournois}
          onSelectTournoi={handleSelectTournoi}
          idUtilisateurCourant={idUtilisateurCourant}
        />
      )}

      <div className="pagination">
        {Array.from({ length: Math.ceil(tournois.length / itemsPerPage) }, (_, index) => (
          <ButtonPrimaryy
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </ButtonPrimaryy>
        ))}
      </div>

      <LaModal opened={isModalOpen} onClose={closeModal} title="Détails du Tournoi" tournoi={selectedTournoi}>
        {selectedTournoi && (
          <div className="text-o-primary tournament-details-grid grid grid-cols-2 gap-2 text-sm">
            <div className="font-semibold">🏆 Nom :</div>
            <div>{selectedTournoi.nom}</div>
            <div className="font-semibold">📅 Date :</div>
            <div>{selectedTournoi.date}</div>
            <div className="font-semibold">📍 Lieu :</div>
            <div>{selectedTournoi.lieu}</div>
            <div className="font-semibold">🎯 Élimination :</div>
            <div>{getSystemeLabel(selectedTournoi.systemeElimination)}</div>
            <div className="font-semibold">📁 Catégorie :</div>
            <div>{selectedTournoi.id_categorie ?? '-'}</div>
            <div className="font-semibold">🥋 Grade Min :</div>
            <div>{selectedTournoi.id_grade_min ?? '-'}</div>
            <div className="font-semibold">🥋 Grade Max :</div>
            <div>{selectedTournoi.id_grade_max ?? '-'}</div>
            <div className="font-semibold">👥 Participants :</div>
            <div>{selectedTournoi.nombre_participants ?? 0}</div>
            <div className="font-semibold">📊 Poules :</div>
            <div>{selectedTournoi.nombre_poules ?? '-'}</div>
            <div className="font-semibold">⏱ État :</div>
            <div>{getEtatLabel(selectedTournoi.etat)}</div>
            <div className="font-semibold">🔓 Public :</div>
            <div>{selectedTournoi.is_public ? 'Oui' : 'Non'}</div>
          </div>
        )}
      </LaModal>
    </div>
  );
}

const getEtatLabel = (etat?: string) => {
  switch (etat) {
    case 'en_attente':
      return 'En attente';
    case 'en_cours':
      return 'En cours';
    case 'termine':
      return 'Terminé';
    default:
      return '-';
  }
};
const getSystemeLabel = (code?: string) => {
  switch (code) {
    case 'S':
      return 'Élimination simple';
    case 'D':
      return 'Élimination double';
    default:
      return '-';
  }
};
