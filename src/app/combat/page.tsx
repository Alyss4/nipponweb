'use client';

import React, { useState } from 'react';

const poules = {
  'Poule A': ['Alice', 'Bob', 'Charlie'],
  'Poule B': ['David', 'Eva'],
  'Poule C': ['Gabriel', 'Hugo'],
};

interface Combat {
  combattant1: string;
  combattant2: string;
  poule: string;
}

export default function CombatTable() {
  const [message, setMessage] = useState('');

  const generateCombats = (combattants: string[], poule: string): Combat[] => {
    const combats: Combat[] = [];
    for (let i = 0; i < combattants.length; i++) {
      for (let j = i + 1; j < combattants.length; j++) {
        combats.push({
          combattant1: combattants[i],
          combattant2: combattants[j],
          poule,
        });
      }
    }
    return combats;
  };

  const allCombats = Object.entries(poules).flatMap(([poule, combattants]) =>
    generateCombats(combattants, poule)
  );

  const handleLancerCombat = (combat: Combat) => {
    setMessage(`Combat lancé entre ${combat.combattant1} et ${combat.combattant2} (${combat.poule}) 🥊`);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="text-center text-primary mb-4">Tableau des combats</h2>

      <table className="table table-striped table-hover" style={{ borderRadius: '10px' }}>
        <thead className="table-light">
          <tr>
            <th>Poule</th>
            <th>Combattant Rouge</th>
            <th>Combattant Blanc</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {allCombats.map((combat, index) => (
            <tr key={index}>
              <td>{combat.poule}</td>
              <td>{combat.combattant1}</td>
              <td>{combat.combattant2}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'var(--bg-button-primary)',
                    color: 'var(--text-button-primary)',
                    borderColor: 'var(--border-button-primary)',
                  }}
                  onClick={() => handleLancerCombat(combat)}
                >
                  Lancer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && <p className="text-success text-center">{message}</p>}
    </div>
  );
}
