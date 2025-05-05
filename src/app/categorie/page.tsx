'use client'
import React, { useState, useEffect } from 'react';
import { Input, Checkbox, ButtonPrimaryy, Select } from '../../components/ComponentForm';

export default function Categorie() {
  const [nom, setNom] = useState('');
  const [poidsMin, setPoidsMin] = useState('');
  const [poidsMax, setPoidsMax] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [gradeMin, setGradeMin] = useState('');
  const [gradeMax, setGradeMax] = useState('');
  const [gradeMinRequired, setGradeMinRequired] = useState(false);
  const [gradeMaxRequired, setGradeMaxRequired] = useState(false);
  const [sexe, setSexe] = useState('Homme'); // Default to 'Homme'
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [noPoidsRestriction, setNoPoidsRestriction] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/grades', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        setGrades(result);
      } catch (error) {
        console.error('Erreur lors du chargement des grades:', error);
      }
    };

    fetchGrades();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !ageMin || !ageMax) {
      setErreur('Tous les champs sont obligatoires.');
      setMessage('');
      return;
    }
    if (!noPoidsRestriction) {
      const poidsMinVal = parseFloat(poidsMin);
      const poidsMaxVal = parseFloat(poidsMax);

      if (poidsMinVal < 3 || poidsMaxVal > 300) {
        setErreur('Le poids doit être compris entre 3 kg et 300 kg.');
        setMessage('');
        return;
      }

      if (poidsMinVal > poidsMaxVal) {
        setErreur('Le poids minimum ne peut pas être supérieur au poids maximum.');
        setMessage('');
        return;
      }
    }
    const ageMinVal = parseInt(ageMin);
    const ageMaxVal = parseInt(ageMax);
    if (ageMinVal < 3 || ageMaxVal > 100) {
      setErreur("L'âge doit être compris entre 3 et 100 ans.");
      setMessage('');
      return;
    }

    if (ageMinVal > ageMaxVal) {
      setErreur("L'âge minimum ne peut pas être supérieur à l'âge maximum.");
      setMessage('');
      return;
    }

    if ((gradeMinRequired && !gradeMin) || (gradeMaxRequired && !gradeMax)) {
      setErreur('Veuillez remplir les grades minimum ou maximum si requis.');
      setMessage('');
      return;
    }

    if (gradeMinRequired && gradeMaxRequired && parseInt(gradeMin) > parseInt(gradeMax)) {
      setErreur('Le grade minimum ne peut pas être supérieur au grade maximum.');
      setMessage('');
      return;
    }
    const sexeMapped = sexe === 'Homme' ? 'H' : sexe === 'Femme' ? 'F' : 'M';

    const data = {
      nom,
      sexe: sexeMapped,
      poidsMin: noPoidsRestriction ? null : parseFloat(poidsMin),
      poidsMax: noPoidsRestriction ? null : parseFloat(poidsMax),
      ageMin: parseInt(ageMin),
      ageMax: parseInt(ageMax),
      gradeMin: gradeMinRequired ? parseInt(gradeMin) : null,
      gradeMax: gradeMaxRequired ? parseInt(gradeMax) : null,
      noPoidsRestriction,
    };
    console.log(data);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setErreur(result.message || 'Une erreur est survenue.');
        setMessage('');
        return;
      }

      setMessage('Catégorie créée avec succès ✅');
      setErreur('');

      setNom('');
      setPoidsMin('');
      setPoidsMax('');
      setAgeMin('');
      setAgeMax('');
      setGradeMin('');
      setGradeMax('');
      setGradeMinRequired(false);
      setGradeMaxRequired(false);
      setSexe('');
    } catch (error) {
      setErreur('Erreur réseau ou serveur.');
      setMessage('');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '50px' }}>
      <h2 className="text-center text-primary mb-4">Créer une catégorie</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom de la catégorie"
          type="text"
          placeholder="Ex: -66kg Juniors"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <Checkbox
          label="Pas de restriction de poids"
          checked={noPoidsRestriction}
          onChange={(e) => setNoPoidsRestriction(e.target.checked)}
        />

        {!noPoidsRestriction && (
          <>
            <Input
              label="Poids minimum (kg)"
              type="number"
              placeholder="Ex: 60"
              value={poidsMin}
              onChange={(e) => setPoidsMin(e.target.value)}
              required
            />
            <Input
              label="Poids maximum (kg)"
              type="number"
              placeholder="Ex: 66"
              value={poidsMax}
              onChange={(e) => setPoidsMax(e.target.value)}
              required
            />
          </>
        )}
        <div className="mb-3">
          <label htmlFor="ageMin" className="form-label text-dark fw-bold">Tranche d'âge</label>
          <div className="d-flex justify-content-between">
            <input
              type="number"
              className="form-control"
              id="ageMin"
              placeholder="Ex: 18"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              required
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--text-primary)',
                borderRadius: '5px',
              }}
            />
            <span>-</span>
            <input
              type="number"
              className="form-control"
              id="ageMax"
              placeholder="Ex: 21"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              required
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--text-primary)',
                borderRadius: '5px',
              }}
            />
          </div>
        </div>

        <div className="mb-3">
          <Select
            label="Sexe"
            value={sexe}
            onChange={(e) => setSexe(e.target.value)}
            options={[
              { value: 'Homme', label: 'Homme' },
              { value: 'Femme', label: 'Femme' },
              { value: 'Mixte', label: 'Mixte' },
            ]}
          />
        </div>

        <Checkbox
          label="Le grade minimum est requis"
          checked={gradeMinRequired}
          onChange={(e) => setGradeMinRequired(e.target.checked)}
        />
        <Checkbox
          label="Le grade maximum est requis"
          checked={gradeMaxRequired}
          onChange={(e) => setGradeMaxRequired(e.target.checked)}
        />

        {gradeMinRequired && (
          <div className="mb-3 grade-fields-container show">
            <Select
              label="Grade minimum"
              value={gradeMin}
              onChange={(e) => setGradeMin(e.target.value)}
              options={grades.map(grade => ({ value: grade.id, label: grade.nom }))}
            />
          </div>
        )}

        {gradeMaxRequired && (
          <div className="mb-3 grade-fields-container show">
            <Select
              label="Grade maximum"
              value={gradeMax}
              onChange={(e) => setGradeMax(e.target.value)}
              options={grades.map(grade => ({ value: grade.id, label: grade.nom }))}
            />
          </div>
        )}

        {erreur && <p className="text-danger">{erreur}</p>}
        {message && <p className="text-success">{message}</p>}

        <div className="d-grid mt-3">
          <ButtonPrimaryy>Créer la catégorie</ButtonPrimaryy>
        </div>
      </form>
    </div>
  );
}
