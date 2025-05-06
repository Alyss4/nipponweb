import React, { useState, useEffect, ChangeEvent } from 'react';
import Row from '../Row';
import Col from '../Col';
import GestionParticipants from './GestionParticipants';
import { Input, Select, Radio, ButtonPrimaryy, Checkbox } from '../ComponentForm';

type Categorie = {
  id: number;
  nom: string;
  sexe: string;
  id_grade_max: number;
  id_grade_min: number;
};

const TournoiForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    gradeMin: '',
    gradeMax: '',
    date: '',
    importType: 'Manuellement',
    genre: '',
    systeme: '',
    participantsLimit: '',
    sponsor: '',
    csvFile: null,
    selectedCategorieId: '',
    id_grade_max: null as number | null,
    id_grade_min: null as number | null,
    lieu: '',
    description: '',
  });

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [grades, setGrades] = useState<{ id: number; nom: string }[]>([]);
  const [showGestionParticipants, setShowGestionParticipants] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);
  const [showLimit, setShowLimit] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories/has/utilisateur', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const result = await response.json();
        if (Array.isArray(result)) setCategories(result);
      } catch {}
    };

    const fetchGrades = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/grades', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const result = await response.json();
        setGrades(result);
      } catch {}
    };

    fetchCategories();
    fetchGrades();
  }, []);

  const updateForm = (key: string, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    updateForm('selectedCategorieId', categoryId);

    const selectedCategory = categories.find((c) => c.id.toString() === categoryId);
    if (selectedCategory) {
      const { id_grade_max, id_grade_min, sexe } = selectedCategory;
      const genreMap: Record<string, string> = { H: 'Homme', F: 'Femme', M: 'Mixte' };

      const selectedGradeMax = grades.find((g) => g.id === id_grade_max);
      const selectedGradeMin = grades.find((g) => g.id === id_grade_min);

      setFormData((prev) => ({
        ...prev,
        genre: genreMap[sexe] || '',
        id_grade_max,
        id_grade_min,
        gradeMin: selectedGradeMin?.nom || '',
        gradeMax: selectedGradeMax?.nom || '',
      }));
    }
  };

  const isFormValid = () => {
    const {
      nom,
      date,
      systeme,
      sponsor,
      participantsLimit,
      gradeMin,
      gradeMax,
      selectedCategorieId,
      lieu,
      description,
      genre,
    } = formData;
  
    return (
      nom.trim() !== '' &&
      date !== '' &&
      systeme !== '' &&
      (!showSponsor || sponsor.trim() !== '') &&
      (!showLimit || (participantsLimit !== '' && !isNaN(Number(participantsLimit)) && Number(participantsLimit) > 0)) &&
      gradeMin !== '' &&
      gradeMax !== '' &&
      selectedCategorieId !== '' &&
      lieu.trim() !== '' &&
      description.trim() !== '' &&
      genre !== ''
    );
  };
  
  const toggleGestionParticipants = () => {
    console.log('Form data:', formData); 
    setShowGestionParticipants((prev) => !prev);
  };

  return (
    <div className="container mt-3">
      {showGestionParticipants ? (
      <GestionParticipants formData={formData} />
      ) : (
        <>
      <h2 className="text-center text-o-primary mb-4">Ajouter un tournoi sur place</h2>
        <form>
          <Row>
            <Col>
              <Input
                label="Nom du tournoi"
                type="text"
                placeholder="Entrez le nom du tournoi"
                value={formData.nom}
                onChange={(e) => updateForm('nom', e.target.value)}
                required
              />
              <Input
              placeholder=''
                label="Date du tournoi"
                type="date"
                value={formData.date}
                onChange={(e) => updateForm('date', e.target.value)}
                required
              />
              <Input
                label="Lieu du tournoi"
                type="text"
                placeholder="Entrez le lieu du tournoi"
                value={formData.lieu}
                onChange={(e) => updateForm('lieu', e.target.value)}
                required
              />

              <Input
                label="Description"
                type="text"
                placeholder="Entrez une description"
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                required
              />

              <Select
                label="Système d’élimination"
                value={formData.systeme}
                onChange={(e) => updateForm('systeme', e.target.value)}
                options={[
                  { value: '', label: 'Sélectionner un système' },
                  { value: 'Poule', label: 'Poule' },
                  { value: 'Élimination directe', label: 'Élimination directe' },
                ]}
              />

              <Checkbox
                label="Ajouter un sponsor"
                checked={showSponsor}
                onChange={(e) => setShowSponsor(e.target.checked)}
              />
              {showSponsor && (
                <Input
                  label="Sponsor du tournoi"
                  type="text"
                  placeholder="Nom du sponsor"
                  value={formData.sponsor}
                  onChange={(e) => updateForm('sponsor', e.target.value)}
                />
              )}

              <Checkbox
                label="Limiter le nombre de participants"
                checked={showLimit}
                onChange={(e) => setShowLimit(e.target.checked)}
              />
              {showLimit && (
                <Input
                  label="Limite de participants"
                  type="number"
                  placeholder="Nombre maximum de participants"
                  value={formData.participantsLimit}
                  onChange={(e) => updateForm('participantsLimit', e.target.value)}
                />
              )}
            </Col>

            <Col>
              <Select
                label="Sélectionner une catégorie"
                value={formData.selectedCategorieId}
                onChange={handleCategorieChange}
                options={[
                  { value: '', label: 'Sélectionner une catégorie' },
                  ...categories.map((c) => ({ value: c.id.toString(), label: c.nom })),
                ]}
              />
              <Select
                label="Grade minimum"
                value={formData.gradeMin}
                onChange={(e) => updateForm('gradeMin', e.target.value)}
                options={[
                  { value: '', label: 'Sélectionner un grade minimum' },
                  ...grades.map((g) => ({ value: g.nom, label: g.nom })),
                ]}
              />
              <Select
                label="Grade maximum"
                value={formData.gradeMax}
                onChange={(e) => updateForm('gradeMax', e.target.value)}
                options={[
                  { value: '', label: 'Sélectionner un grade maximum' },
                  ...grades.map((g) => ({ value: g.nom, label: g.nom })),
                ]}
              />
              <div>
                <Radio
                  name="genre"
                  label="Homme"
                  checked={formData.genre === 'Homme'}
                  onChange={() => updateForm('genre', 'Homme')}
                />
                <Radio
                  name="genre"
                  label="Femme"
                  checked={formData.genre === 'Femme'}
                  onChange={() => updateForm('genre', 'Femme')}
                />
                <Radio
                  name="genre"
                  label="Mixte"
                  checked={formData.genre === 'Mixte'}
                  onChange={() => updateForm('genre', 'Mixte')}
                />
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <ButtonPrimaryy
                type="button"
                onClick={toggleGestionParticipants}
                disabled={!isFormValid()}
              >
                Aller à la gestion des participants
              </ButtonPrimaryy>
              {!isFormValid() && (
                <p className="text-danger mt-2">
                  Veuillez remplir tous les champs obligatoires avant de continuer.
                </p>
              )}
            </Col>
          </Row>
        </form>
        </>
      )}
    </div>
  );
};

export default TournoiForm;
