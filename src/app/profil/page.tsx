'use client';

import { useEffect, useState } from 'react';
import { Input, Select, ButtonPrimaryy, ButtonSecondaryy } from '@/components/ui/ComponentForm';
import DemandesComponent from '@/components/componentsPages/DemandesComponent';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function ProfilPage() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState('');
  const [poids, setPoids] = useState('');
  const [idPays, setIdPays] = useState('');
  const [idClub, setIdClub] = useState('');
  const [idGrade, setIdGrade] = useState('');

  const [paysList, setPaysList] = useState<any[]>([]);
  const [clubList, setClubList] = useState<any[]>([]);
  const [gradeList, setGradeList] = useState<any[]>([]);

  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || '');

    if (!token) {
      router.push('/connexion');
      return;
    }

    fetch(`${API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setEmail(data.email);
        setUserId(data.id);
      });

    if (storedRole === 'c') {
      fetch(`${API_BASE_URL}/getIDCompetiteurUtilisateur`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(({ id }) => {
          return fetch(`${API_BASE_URL}/getCompetiteurById`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });
        })
        .then(res => res.json())
        .then(data => {
          const c = data.competiteur;
          setPrenom(c.prenom);
          setNom(c.nom);
          setDateNaissance(c.date_naissance);
          setSexe(c.sexe);
          setPoids(c.poids);
          setIdPays(c.id_pays?.toString() || '');
          setIdClub(c.id_club?.toString() || '');
          setIdGrade(c.id_grade?.toString() || '');
        });
    }

    const fetchSelectData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const [paysRes, clubsRes, gradesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/pays`, { headers }),
        fetch(`${API_BASE_URL}/clubs`, { headers }),
        fetch(`${API_BASE_URL}/grades`, { headers }),
      ]);
      setPaysList(await paysRes.json());
      setClubList(await clubsRes.json());
      setGradeList(await gradesRes.json());
    };

    fetchSelectData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (motDePasse && motDePasse !== confirmMdp) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || !userId) return;

    const payload: any = {
      email,
      motDePasse: motDePasse || undefined,
    };

    if (role === 'c') {
      payload.competiteur = {
        prenom,
        nom,
        date_naissance: dateNaissance,
        sexe,
        poids,
        id_pays: idPays,
        id_club: idClub,
        id_grade: idGrade,
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/profil/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Profil mis à jour.');
        setErreur('');
        setEditMode(false);
      } else {
        setErreur(data.message || 'Erreur lors de la mise à jour.');
        setMessage('');
      }
    } catch (err) {
      setErreur('Erreur réseau.');
    }
  };


  return (
    <div className="container" style={{ maxWidth: '900px', marginTop: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="mb-4 text-o-primary">Mon profil</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!editMode} required />
        <br/>
        <Input label="Nouveau mot de passe" type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} disabled={!editMode} />
        <Input label="Confirmer mot de passe" type="password" value={confirmMdp} onChange={e => setConfirmMdp(e.target.value)} disabled={!editMode} />
        {role === 'c' && (
          <>
            <Input label="Prénom" type="text" value={prenom} onChange={e => setPrenom(e.target.value)} disabled={!editMode} required />
            <Input label="Nom" type="text" value={nom} onChange={e => setNom(e.target.value)} disabled={!editMode} required />
            <Input label="Date de naissance" type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} disabled={!editMode} required />
            <Select
              label="Sexe"
              value={sexe}
              onChange={e => setSexe(e.target.value)}
              disabled={!editMode}
              options={[
                { value: 'M', label: 'Homme' },
                { value: 'F', label: 'Femme' },
              ]}
              required
            />
            <Input label="Poids (kg)" type="number" value={poids} onChange={e => setPoids(e.target.value)} disabled={!editMode} required />
            <Select
              label="Pays"
              value={idPays}
              onChange={e => setIdPays(e.target.value)}
              options={paysList.map((p: any) => ({ value: p.id.toString(), label: p.nom }))}
              disabled={!editMode}
              required
            />
            <Select
              label="Club"
              value={idClub}
              onChange={e => setIdClub(e.target.value)}
              options={clubList.map((c: any) => ({ value: c.id.toString(), label: c.nom }))}
              disabled={!editMode}
              required
            />
            <Select
              label="Grade"
              value={idGrade}
              onChange={e => setIdGrade(e.target.value)}
              options={gradeList.map((g: any) => ({ value: g.id.toString(), label: g.nom }))}
              disabled={!editMode}
              required
            />
          </>
        )}

        {message && <p className="text-success" style={{ gridColumn: '1 / -1' }}>{message}</p>}
        {erreur && <p className="text-danger" style={{ gridColumn: '1 / -1' }}>{erreur}</p>}

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          {!editMode && (
            <ButtonPrimaryy onClick={() => setEditMode(true)}>Modifier</ButtonPrimaryy>
          )}
          <ButtonSecondaryy type="button" onClick={() => router.push('/')}>Retour</ButtonSecondaryy>  
          {editMode && <ButtonPrimaryy type="submit">Mettre à jour</ButtonPrimaryy>}
        </div>
      </form>

      <div style={{ marginTop: 40 }}>
        <DemandesComponent />
      </div>
    </div>
  );
}
