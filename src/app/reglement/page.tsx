'use client';

import React, { useState } from 'react';

interface Règlement {
  section: string;
  description: string;
}

export default function RèglementPage() {
  const [message, setMessage] = useState('');

  const sectionsRèglement: Règlement[] = [
    {
      section: 'Objectif de la Compétition',
      description:
        'La compétition de Nippon Kempo a pour objectif de promouvoir la pratique de cet art martial traditionnel tout en offrant aux pratiquants un cadre structuré pour tester leurs compétences.',
    },
    {
      section: 'Prérequis des Participants',
      description:
        'Tous les participants doivent être inscrits auprès de [Nom de l\'organisation/club] et disposer d\'une licence valide. Une vérification médicale préalable est obligatoire.',
    },
    {
      section: 'Règles de Combat',
      description:
        'Les combats de Nippon Kempo se dérouleront dans un temps limité. Des techniques comme les frappes légères, les projections et les clés articulaires sont autorisées sous certaines conditions.',
    },
    {
      section: 'Comportement des Participants',
      description:
        'Les compétiteurs doivent adopter un comportement respectueux envers leurs adversaires, les arbitres et les spectateurs. Toute forme de violence excessive entraînera des sanctions.',
    },
  ];

  const handleAccepterRèglement = () => {
    setMessage('Vous avez accepté le règlement de la compétition de Nippon Kempo.');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="text-center text-primary mb-4">Règlement de la Compétition de Nippon Kempo</h2>

      <table className="table table-striped table-hover" style={{ borderRadius: '10px' }}>
        <thead className="table-light">
          <tr>
            <th>Section</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {sectionsRèglement.map((règlement, index) => (
            <tr key={index}>
              <td>{règlement.section}</td>
              <td>{règlement.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={handleAccepterRèglement}
          style={{
            backgroundColor: 'var(--bg-button-primary)',
            color: 'var(--text-button-primary)',
            borderColor: 'var(--border-button-primary)',
          }}
        >
          Accepter le règlement
        </button>
      </div>

      {message && <p className="text-success text-center mt-4">{message}</p>}
    </div>
  );
}
