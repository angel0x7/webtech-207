import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type QuestionPayload = {
  titre?: string;
  texte?: string;
  idProfile?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuestionPayload;
    const { titre, texte, idProfile } = body;

    if (!titre && !texte) {
      return NextResponse.json(
        { message: "titre or texte required" },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      titre: titre ?? null,
      texte: texte ?? null,
    };

    if (idProfile) {
      payload.idProfile = idProfile;
    }

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
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
