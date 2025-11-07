import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { texte, idQuestion, idProfile } = await req.json();
    if (!texte || !idQuestion) {
      return NextResponse.json({ message: "texte and idQuestion required" }, { status: 400 });
    }

    const payload: any = { texte, idQuestion };
    if (idProfile) payload.idProfile = idProfile;

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

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
