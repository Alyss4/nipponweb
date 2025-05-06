import { Grade, Participant, Pays, Club } from "./types";


export const fetchGrades = async (setGrades: React.Dispatch<React.SetStateAction<Grade[]>>) => {
  try {
    const response = await fetch('http://localhost:8000/api/grades', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const result = await response.json();
    setGrades(result);
  } catch (error) {
    console.error("Erreur lors du chargement des grades:", error);
  }
};
//TODO
export const fetchPays = async (setPays: React.Dispatch<React.SetStateAction<Pays[]>>)=>{
    try{
        const response = await fetch ('http://localhost:8000/api/pays',{
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const result = await response.json();
        setPays(result);
      } catch (error) {
        console.error("Erreur lors du chargement des pays:", error);
      }
};
//TODO
export const fetchClub = async (setClub: React.Dispatch<React.SetStateAction<Club[]>>)=>{
    try{
        const response = await fetch ('http://localhost:8000/api/clubs',{
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
    const response = await fetch(`http://localhost:8000/api/tournois/${tournoiId}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ participants }),
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
) => {
  try {
    const response = await fetch('http://localhost:8000/api/tournois', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ ...formData, statut }),
    });

    const tournoi = await response.json();
    if (!response.ok) throw new Error(tournoi.message || "Erreur lors de la création du tournoi");

    if (!ajoutParticipantsPlusTard) await handleCreateParticipants(tournoi.id, participants);

    alert("Tournoi enregistré avec succès !");
  } catch (err) {
    alert("Échec de la création du tournoi.");
    console.error(err);
  }
};
