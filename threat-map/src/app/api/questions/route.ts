import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QuestionPayload {
  titre?: string;
  texte?: string;
  idProfile?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  try {
    const { titre, texte, idProfile } = req.body as QuestionPayload;

    if (!titre && !texte) {
      res.status(400).json({ message: "titre ou texte requis" });
      return;
    }

    const payload: QuestionPayload = { titre: titre ?? undefined, texte: texte ?? undefined };
    if (idProfile) payload.idProfile = idProfile;

    const { data, error } = await supabase
      .from("question")
      .insert(payload)
      .select()
      .single();

    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    res.status(500).json({ message });
  }
}
