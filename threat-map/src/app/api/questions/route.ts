import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QuestionPayload {
  titre?: string;
  texte?: string;
  idProfile?: string;
}

export async function POST(req: Request) {
  try {
    const { titre, texte, idProfile } = (await req.json()) as QuestionPayload;

    if (!titre && !texte) {
      return NextResponse.json({ message: "titre ou texte requis" }, { status: 400 });
    }

    const payload: QuestionPayload = { titre, texte, idProfile };

    const { data, error } = await supabase
      .from("question")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ message }, { status: 500 });
  }
}
