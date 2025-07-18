import { Grade, Participant, Pays, Club } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const fetchGrades = async (setGrades: React.Dispatch<React.SetStateAction<Grade[]>>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/grades`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const result = await response.json();
    setGrades(result);
  } catch (error) {
    console.error("Erreur lors du chargement des grades:", error);
  }
};

export const fetchPays = async (setPays: React.Dispatch<React.SetStateAction<Pays[]>>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pays`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const result = await response.json();
    setPays(result);
  } catch (error) {
    console.error("Erreur lors du chargement des pays:", error);
  }
};

export const fetchClub = async (setClub: React.Dispatch<React.SetStateAction<Club[]>>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const result = await response.json();
    setClub(result);
  } catch (error) {
    console.error("Erreur lors du chargement des clubs:", error);
  }
};

export const handleCSVImport = (
  e: React.ChangeEvent<HTMLInputElement>,
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>
) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const { parseCSV } = require("./parseCSV");
      const importedParticipants = parseCSV(content);
      setParticipants(prev => [...prev, ...importedParticipants]);
    };
    reader.readAsText(file);
  }
};

const handleCreateParticipants = async (tournoiId: number, participants: Participant[]) => {
  try {
    const participantsWithTournoi = participants.map(p => ({
      ...p,
      id_tournoi: tournoiId,
    }));

    const response = await fetch(`${API_BASE_URL}/tournois/${tournoiId}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ participants: participantsWithTournoi }),
    });

    if (!response.ok) throw new Error("Erreur lors de l'enregistrement des participants");
  } catch (err) {
    alert("Échec de l'ajout des participants.");
    console.error(err);
  }
};

export const handleCreateTournoi = async (
  formData: any,
  statut: string,
  participants: Participant[],
  ajoutParticipantsPlusTard: boolean
): Promise<{ id: number } | null> => {
  try {
    const userId = Number(localStorage.getItem('userId')) || 0;
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Token d'authentification manquant.");
      return null;
    }

    const parseOptionalNumber = (value: any) =>
      value !== undefined && value !== null && value !== '' ? Number(value) : null;

    const body = {
      nom: formData.nom,
      date: formData.date,
      lieu: formData.lieu,
      description: formData.description || null,
      systemeElimination: formData.systemeElimination,
      sponsor: formData.sponsor || null,
      id_categorie: parseOptionalNumber(formData.selectedCategorieId),
      id_grade_max: parseOptionalNumber(formData.id_grade_max),
      id_grade_min: parseOptionalNumber(formData.id_grade_min),
      id_utilisateur: userId,
      nombre_participants: parseOptionalNumber(formData.participantsLimit),
      genre: formData.genre,
      statut,
    };

    const response = await fetch(`${API_BASE_URL}/tournois`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const tournoi = await response.json();

    if (!response.ok) {
      throw new Error(tournoi.message || 'Erreur lors de la création du tournoi');
    }

    if (!ajoutParticipantsPlusTard) {
      await handleCreateParticipants(tournoi.id, participants);
    }

    alert('Tournoi enregistré avec succès !');
    return tournoi;
  } catch (err) {
    alert('Échec de la création du tournoi.');
    console.error('Erreur lors de la création du tournoi :', err);
    return null;
  }
};
