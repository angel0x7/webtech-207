import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing CVE ID parameter' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://cve.circl.lu/api/cve/${id}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'CVE not found' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CVE details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
