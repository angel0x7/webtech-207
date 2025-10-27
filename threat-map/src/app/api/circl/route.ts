import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://cve.circl.lu/api/last", {
      // Force server-side fetch
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
