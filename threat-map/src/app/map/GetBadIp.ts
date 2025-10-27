import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://honeydb.io/api/bad-hosts", {
      headers: {
        "X-HoneyDb-ApiId": process.env.HONEYDB_API_ID!,
        "X-HoneyDb-ApiKey": process.env.HONEYDB_API_KEY!,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching HoneyDB data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
