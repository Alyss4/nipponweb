import { Participant } from "./types";

// Fonction pour convertir une date du format DD/MM/YYYY en YYYY-MM-DD
const formatDate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

export const parseCSV = (content: string): Participant[] => {
  const rows = content.split("\n").filter((row) => row.trim() !== "");
  const headers = rows[0].split(",").map(h => h.trim());

  // Correspondance des entêtes du CSV avec les clés de Participant
  const headerMap: Record<string, keyof Participant> = {
    "nom": "nom",
    "prénom": "prenom",
    "club": "id_club",
    "grade": "id_grade", 
    "genre": "sexe",
    "poids": "poids",
    "datedenaissance": "date_naissance",
    "dateinscription": "created_at"
  };
  

  return rows.slice(1).map((row) => {
    const values = row.split(",").map(v => v.trim());
    const participant: any = {};

    headers.forEach((header, i) => {
      const key = headerMap[header.toLowerCase()];  // Ajouter toLowerCase pour gérer les majuscules
      if (!key) return; 
      participant[key] = values[i];
    });

    // Conversion des types de données
    if (participant.poids) participant.poids = parseFloat(participant.poids);
    if (isNaN(participant.poids)) participant.poids = 0;

    if (participant.id_club) participant.id_club = parseInt(participant.id_club); 
    if (isNaN(participant.id_club)) participant.id_club = 0;

    if (participant.id_grade) participant.id_grade = parseInt(participant.id_grade);
    if (isNaN(participant.id_grade)) participant.id_grade = 0;

    // Conversion et gestion des dates
    if (participant.date_naissance) participant.date_naissance = formatDate(participant.date_naissance);
    if (participant.created_at) participant.created_at = formatDate(participant.created_at);

    participant.updated_at = new Date().toISOString();  // Met à jour updated_at avec la date actuelle

    return participant as Participant;
  });
};
