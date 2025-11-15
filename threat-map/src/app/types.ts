export type Profile = {
  username?: string | null;
};

export type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null; 
  profile?: Profile;
};

export type Answer = {
  id: number;
  texte: string;
  created_at: string;
  idProfile: string | null;
  idQuestion: number;
  profile?: Profile;
};
