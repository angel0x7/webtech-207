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
    const data = await res.json();

    if (!Array.isArray(data)) return NextResponse.json({ error: "Erreur HoneyDB" }, { status: 500 });

    const filtered = data.filter((h: any) => Number(h.count) > 5000);


    const Host = await Promise.all(
      filtered.map(async (host: any) => {
        try {
          const geoRes = await fetch(`https://honeydb.io/api/netinfo/geolocation/${host.remote_host}`, {
            headers: {
              "X-HoneyDb-ApiId": process.env.HONEYDB_API_ID!,
              "X-HoneyDb-ApiKey": process.env.HONEYDB_API_KEY!,
            },
            cache: "no-store",
          });
          const geo = await geoRes.json();
          return { ...host, geo };
        } catch {
          return { ...host, geo: null };
        }
      })
    );

    return NextResponse.json(Host);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
