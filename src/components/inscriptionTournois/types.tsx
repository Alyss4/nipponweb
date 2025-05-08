export interface Grade {
    id: number;
    nom: string;
  }

export interface Pays {
    id: number;
    nom: string;
    nom_abrev?: string;
    drapeau_emoji?: string;
}
export interface Club {
    id: number;
    nom?: string;
}