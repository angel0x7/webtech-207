import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://honeydb.io/api/bad-hosts", {
      headers: {
        "X-HoneyDb-ApiId": process.env.HONEYDB_API_ID!,
        "X-HoneyDb-ApiKey": process.env.HONEYDB_API_KEY!,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Erreur API HoneyDB:", res.status, await res.text());
      return NextResponse.json({ error: "Erreur API HoneyDB" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
