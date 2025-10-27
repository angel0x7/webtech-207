import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kevRes = await fetch(
      "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
    );

    if (!kevRes.ok) {
      throw new Error(`Failed to fetch KEV data: ${kevRes.status}`);
    }

    const kevData = await kevRes.json();

    // Return only the vulnerabilities array if you want to simplify
    return NextResponse.json(kevData.vulnerabilities || kevData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
