import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ip_address: string }> }
) {
  const { ip_address } = await context.params;

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ip_address}`, {
      headers: {
        "x-apikey": process.env.VIRUSTOTAL_API_KEY ?? "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur VirusTotal" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
