import { NextResponse } from 'next/server';

interface CVEMetadata {
  cveId?: string;
  datePublished?: string;
  dateUpdated?: string;
}

interface CNAContainerDescription {
  lang: string;
  value: string;
}

interface CNAAffectedVersion {
  version: string;
  status: string;
  lessThan?: string;
  versionType?: string;
  changes?: unknown[];
}

interface CNAAffected {
  vendor?: string;
  product?: string;
  versions?: CNAAffectedVersion[];
}

interface CNAContainerReference {
  url: string;
  name?: string;
  tags?: string[];
}

interface CNAContainer {
  title?: string;
  descriptions?: CNAContainerDescription[];
  affected?: CNAAffected[];
  references?: CNAContainerReference[];
}

interface CVEData {
  cveMetadata?: CVEMetadata;
  containers?: {
    cna?: CNAContainer;
  };
  [key: string]: unknown; // pour le champ raw
}

interface NormalizedCVE {
  id: string;
  title: string;
  description: string;
  published: string;
  modified: string;
  vendors: string[];
  products: string[];
  references: string[];
  raw: CVEData;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing CVE ID parameter' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://cve.circl.lu/api/cve/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'CVE not found' }, { status: res.status });
    }

    const data: CVEData = await res.json();

    const cveMetadata = data.cveMetadata ?? {};
    const cna = data.containers?.cna ?? {};
    const affected = cna.affected ?? [];
    const references = cna.references?.map(r => r.url).filter(Boolean) ?? [];

    const normalized: NormalizedCVE = {
      id: cveMetadata.cveId ?? id,
      title: cna.title ?? '',
      description: cna.descriptions?.[0]?.value ?? '',
      published: cveMetadata.datePublished ?? '',
      modified: cveMetadata.dateUpdated ?? '',
      vendors: affected.map(a => a.vendor ?? '').filter(Boolean),
      products: affected.map(a => a.product ?? '').filter(Boolean),
      references,
      raw: data,
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Error fetching CVE details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
