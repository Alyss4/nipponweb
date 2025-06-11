'use client';

import { useEffect, useState } from 'react';
import { ButtonPrimaryy, ButtonSecondaryy, Input } from '@/components/ui/ComponentForm';

interface Demande {
  id: number;
  id_utilisateur: number;
  email_utilisateur?: string;
  message: string;
  date_demande: string;
  statut: 'en_attente' | 'acceptee' | 'refusee';
}

export default function DemandesComponent() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [erreur, setErreur] = useState('');
  const [saisie, setSaisie] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      setRole(storedRole || '');
      if (!token) {
        setErreur('Utilisateur non connecté');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (response.ok && result.id) {
          setUserId(result.id);
        } else {
          setErreur(result.message || "Erreur utilisateur");
        }
      } catch {
        setErreur("Impossible de joindre l'API.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId === undefined) return;
    const fetchDemandes = async () => {
      const token = localStorage.getItem('token');
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/demandes-competiteur', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setDemandes(data);
        } else {
          setErreur(data.message || "Erreur serveur.");
        }
      } catch {
        setErreur("Impossible de joindre l'API.");
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, [userId]);

  const handleStatutChange = async (id: number, statut: Demande['statut']) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/demandes-competiteur/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut }),
      });
      const data = await response.json();
      if (response.ok) {
        setDemandes(ds => ds.map(d => d.id === id ? { ...d, statut } : d));
        setMsg('Statut modifié.');
        setTimeout(() => setMsg(''), 2000);
      } else {
        setMsg(data.message || 'Erreur serveur.');
      }
    } catch {
      setMsg('Erreur réseau.');
    }
  };

  const handleNouvelleDemande = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/demande-role-competiteur', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: saisie }),
      });
      const result = await response.json();
      if (response.ok) {
        setDemandes(ds => [result, ...ds]);
        setStatus('Demande envoyée.');
        setSaisie('');
      } else {
        setStatus(result.message || "Erreur lors de l'envoi.");
      }
    } catch {
      setStatus("Erreur réseau.");
    }
  };

  if (loading) return <p>Chargement…</p>;
  if (erreur) return <p style={{ color: "#e83c28", textAlign: "center", marginTop: 20 }}>{erreur}</p>;

  return (
    <div style={{
      maxWidth: 700,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 10,
      padding: '36px 28px 32px 28px',
      boxShadow: '0 2px 18px 0 rgba(0,0,0,0.07)',
    }}>
      <h2 style={{
        color: '#aaa',
        fontWeight: 600,
        textAlign: 'center',
        fontSize: 28,
        marginBottom: 30,
        letterSpacing: 0.2,
      }}>
        Demandes de passage compétiteur
      </h2>

      {msg && <div style={{ color: '#198754', marginBottom: 10, textAlign: 'center' }}>{msg}</div>}

      {role !== 'a' && (
        <>
          <form onSubmit={handleNouvelleDemande}
            style={{
              margin: '24px 0 36px 0',
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Input
              type='text'
              label=""
              placeholder="Rédige ta demande…"
              value={saisie}
              onChange={e => setSaisie(e.target.value)}
              required
            />
            <ButtonPrimaryy
              type="submit"
              style={{
                minWidth: 110,
                fontSize: 15,
                height: 42
              }}
            >Envoyer</ButtonPrimaryy>
          </form>
          {status && <div style={{ color: '#198754', marginBottom: 16, textAlign: 'center' }}>{status}</div>}

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fcfcfc',
              marginTop: 14,
              fontSize: 15,
              minWidth: 480,
            }}>
              <thead>
                <tr style={{ background: '#f3f3f3' }}>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Message</th>
                  <th style={thStyle}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {demandes
                  .filter(d => d.id_utilisateur === userId)
                  .map(d => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={tdStyle}>{new Date(d.date_demande).toLocaleString()}</td>
                      <td style={tdStyle}>{d.message}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>
                        {d.statut === 'en_attente' && <span style={{ color: '#ffa500' }}>En attente</span>}
                        {d.statut === 'acceptee' && <span style={{ color: '#198754' }}>Acceptée</span>}
                        {d.statut === 'refusee' && <span style={{ color: '#e83c28' }}>Refusée</span>}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {role === 'a' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fcfcfc',
            marginTop: 10,
            fontSize: 15,
            minWidth: 520,
          }}>
            <thead>
              <tr style={{ background: '#f3f3f3' }}>
                <th style={thStyle}>Utilisateur</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={tdStyle}>{d.email_utilisateur || d.id_utilisateur}</td>
                  <td style={tdStyle}>{new Date(d.date_demande).toLocaleString()}</td>
                  <td style={tdStyle}>{d.message}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {d.statut === 'en_attente' && <span style={{ color: '#ffa500' }}>En attente</span>}
                    {d.statut === 'acceptee' && <span style={{ color: '#198754' }}>Acceptée</span>}
                    {d.statut === 'refusee' && <span style={{ color: '#e83c28' }}>Refusée</span>}
                  </td>
                  <td style={tdStyle}>
                    {d.statut === 'en_attente' && (
                      <>
                        <ButtonPrimaryy
                          style={{
                            marginRight: 8,
                            fontSize: 14,
                            padding: '6px 16px'
                          }}
                          onClick={() => handleStatutChange(d.id, 'acceptee')}>
                          Accepter
                        </ButtonPrimaryy>
                        <ButtonSecondaryy
                          style={{
                            fontSize: 14,
                            padding: '6px 14px'
                          }}
                          onClick={() => handleStatutChange(d.id, 'refusee')}>
                          Refuser
                        </ButtonSecondaryy>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: '10px 16px',
  textAlign: 'left' as const,
  fontWeight: 700,
  color: '#333',
  borderBottom: '2px solid #ececec',
  fontSize: 15,
  background: '#f6f6f6',
};

const tdStyle = {
  padding: '9px 14px',
  color: '#222',
  background: 'none',
};
