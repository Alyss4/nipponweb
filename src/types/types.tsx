export interface Competiteur {
  id: number;
  nom: string;
  prenom: string;
}

export interface Match {
  id: number;
  scoreP1: number;
  scoreP2: number;
  penaliteP1: number;
  penaliteP2: number;
  competiteur1: Competiteur;
  competiteur2: Competiteur;
}
