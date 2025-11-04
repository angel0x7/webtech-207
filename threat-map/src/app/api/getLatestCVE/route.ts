import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://cve.circl.lu/api/last', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch latest CVEs' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching latest CVEs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
