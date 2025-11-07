import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CommentPayload {
  texte: string;
  idQuestion: number;
  idProfile?: string;
}

interface CommentResponse {
  id: number;
  texte: string;
  created_at: string;
  idProfile: string | null;
  idQuestion: number;
  profiles: { username: string | null }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CommentPayload;
    const { texte, idQuestion, idProfile } = body;

    if (!texte || !idQuestion) {
      return NextResponse.json(
        { message: "texte and idQuestion required" },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      texte,
      idQuestion,
      ...(idProfile ? { idProfile } : {}),
    };

    const { data, error } = await supabase
      .from("commentaire")
      .insert(payload)
      .select(`
        id,
        texte,
        created_at,
        idProfile,
        idQuestion,
        profiles: idProfile ( username )
      `)
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const response: CommentResponse = {
      id: data.id,
      texte: data.texte,
      created_at: data.created_at,
      idProfile: data.idProfile ?? null,
      idQuestion: data.idQuestion,
      profiles: Array.isArray(data.profiles) ? data.profiles : [],
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
