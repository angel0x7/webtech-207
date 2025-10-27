import { NextResponse } from "next/server";

interface BadHost {
  remote_host: string;
  count: number | string;
  [key: string]: unknown;
}

interface EnrichedHost extends BadHost {
  geo: Record<string, unknown> | null;
}

export async function GET() {
  try {
    const res = await fetch("https://honeydb.io/api/bad-hosts", {
      headers: {
        "X-HoneyDb-ApiId": process.env.HONEYDB_API_ID ?? "",
        "X-HoneyDb-ApiKey": process.env.HONEYDB_API_KEY ?? "",
      },
      cache: "no-store",
    });

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Erreur HoneyDB" }, { status: 500 });
    }

    const filtered: BadHost[] = data.filter(
      (h: BadHost) => Number(h.count) > 5000
    );

    const enrichedHosts: EnrichedHost[] = await Promise.all(
      filtered.map(async (host): Promise<EnrichedHost> => {
        try {
          const geoRes = await fetch(
            `https://honeydb.io/api/netinfo/geolocation/${host.remote_host}`,
            {
              headers: {
                "X-HoneyDb-ApiId": process.env.HONEYDB_API_ID ?? "",
                "X-HoneyDb-ApiKey": process.env.HONEYDB_API_KEY ?? "",
              },
              cache: "no-store",
            }
          );
          const geo: Record<string, unknown> = await geoRes.json();
          return { ...host, geo };
        } catch {
          return { ...host, geo: null };
        }
      })
    );

    return NextResponse.json(enrichedHosts);
  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
