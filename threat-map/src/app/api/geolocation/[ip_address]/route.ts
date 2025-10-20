
import { NextResponse } from "next/server";

interface BadHost {
  remote_host: string;
  count: string;
  last_seen: string;
}

interface GeoData {
  city: string | null;
  country_iso: string | null;
  country_name: string | null;
  latitude: number | null;
  longitude: number | null;
  postal_code: string | null;
  region_iso: string | null;
  region_name: string | null;
}

interface Host extends BadHost {
  geo?: GeoData | null;
}

export async function GET() {
  try {

    const res = await fetch("https://honeydb.io/api/bad-hosts", {
      headers: {
        "X-HoneyDb-ApiId": process.env.HONEYDB_API_ID!,
        "X-HoneyDb-ApiKey": process.env.HONEYDB_API_KEY!,
      },
      cache: "no-store",
    });

    if (!res.ok) return NextResponse.json({ error: "Erreur HoneyDB" }, { status: res.status });

    const data: BadHost[] = await res.json();

    if (!Array.isArray(data)) return NextResponse.json({ error: "Données invalides" }, { status: 500 });


    const filtered = data.filter(h => Number(h.count) > 10000);


    const enriched: Host[] = [];
    for (const host of filtered) {
      try {
        const geoRes = await fetch(`https://honeydb.io/api/netinfo/geolocation/${host.remote_host}`, {
          headers: {
            "X-HoneyDb-ApiId": process.env.HONEYDB_API_ID!,
            "X-HoneyDb-ApiKey": process.env.HONEYDB_API_KEY!,
          },
          cache: "no-store",
        });

        const geo: GeoData = await geoRes.json();
        enriched.push({ ...host, geo });
      } catch (err) {
        console.error(`Erreur géoloc pour ${host.remote_host}:`, err);
        enriched.push({ ...host, geo: null });
      }
    }

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
