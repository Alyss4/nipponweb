import { Grade, Pays, Club } from '../gestionParticipants/types';

export const validerFormulaire = (data: any) => {
  if (!data.prenom || !data.nom || !data.date_naissance || !data.sexe || !data.poids || !data.id_pays || !data.id_club || !data.id_grade) {
    return { isValid: false, message: "Tous les champs doivent être remplis." };
  }
  if (parseFloat(data.poids) <= 0) {
    return { isValid: false, message: "Le poids doit être un nombre positif." };
  }

  return { isValid: true, message: "" };
};

  
  export const soumettreFormulaire = async (data: any) => {
    try {
        const response = await fetch('http://localhost:8000/api/inscrireAuTournoi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la soumission des données.');
        }

        const result = await response.json();
        return { success: true, message: "Inscription réussie !" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: 'Une erreur inconnue est survenue.' };
        }
    }
};

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
  