'use client';

import React, { useState } from 'react';

interface Utilisateur {
  email: string;
  role: 'visiteur' | 'competiteur' | 'gestionnaire' | 'admin';
  is_active: boolean;
}

export default function RolePage() {
  const [emailRecherche, setEmailRecherche] = useState('');
  const [resultats, setResultats] = useState<Utilisateur[]>([]);
  const [message, setMessage] = useState('');

  const handleRecherche = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/utilisateurs/search?email=${emailRecherche}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setResultats(data);
    } catch {
      setMessage('Erreur lors de la recherche');
    }
  };

  const handleChangeRole = async (email: string, nouveauRole: Utilisateur['role']) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/utilisateurs/${email}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: nouveauRole }),
      });

      if (response.ok) {
        const miseAJour = resultats.map((u) =>
          u.email === email ? { ...u, role: nouveauRole } : u
        );
        setResultats(miseAJour);
        setMessage(`Rôle de ${email} mis à jour en "${nouveauRole}"`);
      } else {
        const erreur = await response.json();
        setMessage(`Erreur : ${erreur.message || 'Échec de la mise à jour'}`);
      }
    } catch {
      setMessage('Erreur lors du changement de rôle');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Gestion des rôles</h2>
      <p className="text-muted text-center">
        Afin de changer de rôle d'un utilisateur, veuillez saisir l'email de l'utilisateur, puis changer son rôle.
      </p>

      <div className="d-flex justify-content-between mb-3" style={{ maxWidth: '500px', margin: 'auto' }}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher par email..."
          value={emailRecherche}
          onChange={(e) => setEmailRecherche(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--text-primary)',
            borderRadius: '5px',
          }}
        />
        <button
          className="btn"
          onClick={handleRecherche}
          style={{
            backgroundColor: 'var(--bg-button-primary)',
            color: 'var(--text-button-primary)',
            borderColor: 'var(--border-button-primary)',
          }}
        >
          Rechercher
        </button>
      </div>

      {message && <p className="text-success text-center">{message}</p>}

      {resultats.length > 0 && (
        <table className="table table-striped table-hover mt-4" style={{ borderRadius: '10px' }}>
          <thead>
            <tr>
              <th>Email</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resultats.map((utilisateur) => (
              <tr key={utilisateur.email}>
                <td>{utilisateur.email}</td>
                <td className="text-center">
                  <div className="btn-group" role="group">
                    {['visiteur', 'competiteur', 'gestionnaire', 'admin'].map((role) => (
                      <button
                        key={role}
                        className={`btn btn-sm ${
                          utilisateur.role === role ? 'btn-primary' : 'btn-outline-primary'
                        }`}
                        onClick={() => handleChangeRole(utilisateur.email, role as Utilisateur['role'])}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {resultats.length === 0 && (
        <p className="text-center text-muted mt-3">Aucun résultat pour cet email.</p>
      )}
    </div>
  );
}
