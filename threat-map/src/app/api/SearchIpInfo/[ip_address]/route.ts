import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { ip_address: string } }
) {
  const ipAddress = await params.ip_address;

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`, {
      headers: {
        "x-apikey": process.env.VirusTotal_API_Key!,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur VirusTotal" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
