import React, { useState, useEffect, ChangeEvent } from 'react';
import Row from '../ui/Row';
import Col from '../ui/Col';
import GestionParticipants from './GestionParticipants';
import { Input, Select, Radio, ButtonPrimaryy, Checkbox } from '../ui/ComponentForm';

type Categorie = {
  id: number;
  nom: string;
  sexe: string;
  id_grade_max: number;
  id_grade_min: number;
};

type Grade = {
  id: number;
  nom: string;
};

const genreMap: Record<string, string> = { H: 'Homme', F: 'Femme', M: 'Mixte' };

const TournoiForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    gradeMin: '',
    gradeMax: '',
    date: '',
    importType: 'Manuellement',
    genre: '',
    systemeElimination: '',
    participantsLimit: '',
    sponsor: '',
    csvFile: null as File | null,
    selectedCategorieId: '',
    id_grade_max: null as number | null,
    id_grade_min: null as number | null,
    lieu: '',
    description: '',
  });

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [showGestionParticipants, setShowGestionParticipants] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);
  const [showLimit, setShowLimit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [catRes, gradesRes] = await Promise.all([
          fetch('http://localhost:8000/api/categories/has/utilisateur', { headers }),
          fetch('http://localhost:8000/api/grades', { headers }),
        ]);

        const [categoriesData, gradesData] = await Promise.all([catRes.json(), gradesRes.json()]);

        if (Array.isArray(categoriesData)) setCategories(categoriesData);
        if (Array.isArray(gradesData)) setGrades(gradesData);
      } catch (error) {
        console.error('Erreur de chargement des données :', error);
      }
    };

    fetchData();
  }, []);

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategorieChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    updateForm('selectedCategorieId', categoryId);

    const selected = categories.find((c) => c.id.toString() === categoryId);
    if (selected) {
      const { id_grade_max, id_grade_min, sexe } = selected;

      const gradeMax = grades.find((g) => g.id === id_grade_max);
      const gradeMin = grades.find((g) => g.id === id_grade_min);

      setFormData((prev) => ({
        ...prev,
        genre: genreMap[sexe] || '',
        id_grade_max,
        id_grade_min,
        gradeMax: gradeMax?.nom || '',
        gradeMin: gradeMin?.nom || '',
      }));
    }
  };

  const isFormValid = () => {
    const {
      nom, date, systemeElimination, sponsor,
      participantsLimit, gradeMin, gradeMax,
      selectedCategorieId, lieu, description, genre,
    } = formData;

    return (
      nom.trim() &&
      date &&
      systemeElimination &&
      (!showSponsor || sponsor.trim()) &&
      (!showLimit || (participantsLimit && !isNaN(+participantsLimit) && +participantsLimit > 0)) &&
      gradeMin &&
      gradeMax &&
      selectedCategorieId &&
      lieu.trim() &&
      description.trim() &&
      genre
    );
  };

  const toggleGestionParticipants = () => {
    console.log('Form data:', formData);
    setShowGestionParticipants((prev) => !prev);
  };

  if (showGestionParticipants) {
    return <GestionParticipants formData={formData} />;
  }

  return (
    <div className="container mt-3">
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
              value={formData.systemeElimination}
              onChange={(e) => updateForm('systemeElimination', e.target.value)}
              options={[
                { value: '', label: 'Sélectionner un système' },
                { value: 'Poule', label: 'Poules (tous contre tous)' },
                { value: 'Elimination directe', label: 'Élimination directe (KO simple)' },
                { value: 'Double elimination', label: 'Double élimination' },
                { value: 'Tableau final', label: 'Poules + Phase finale' },
                { value: 'Round robin', label: 'Round Robin' },
                { value: 'Système suisse', label: 'Système suisse' },
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
              options={[{ value: '', label: 'Sélectionner un grade minimum' }, ...grades.map((g) => ({ value: g.nom, label: g.nom }))]}
              disabled={!!formData.selectedCategorieId}
            />
            <Select
              label="Grade maximum"
              value={formData.gradeMax}
              onChange={(e) => updateForm('gradeMax', e.target.value)}
              options={[{ value: '', label: 'Sélectionner un grade maximum' }, ...grades.map((g) => ({ value: g.nom, label: g.nom }))]}
              disabled={!!formData.selectedCategorieId}
            />
            <div>
              {['Homme', 'Femme', 'Mixte'].map((label) => (
                <Radio
                  key={label}
                  name="genre"
                  label={label}
                  checked={formData.genre === label}
                  onChange={() => updateForm('genre', label)}
                  disabled={!!formData.selectedCategorieId}
                />
              ))}
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
    </div>
  );
};

export default TournoiForm;
