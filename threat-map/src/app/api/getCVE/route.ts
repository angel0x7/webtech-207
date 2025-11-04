// File: app/api/getCVE/route.ts
import { NextResponse } from 'next/server';

const BASE_URL = 'https://app.opencve.io/api/cve';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vendor = searchParams.get('vendor') || '';
  const page = searchParams.get('page') || '1';

  try {
    const res = await fetch(`${BASE_URL}?vendor=${vendor}&page=${page}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch CVEs' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CVEs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}