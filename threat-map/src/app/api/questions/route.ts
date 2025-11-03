import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { titre, texte } = await req.json();
    if (!titre && !texte) return NextResponse.json({ message: "Title or text required" }, { status: 400 });

    const payload = { titre: titre ?? null, texte: texte ?? null, idProfile: null };
    const { data, error } = await supabase.from("questions").insert(payload).select().single();

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
