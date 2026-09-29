import { NextResponse } from 'next/server';

import { fetchSlotsAction } from '@/app/(frontend)/book/actions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await fetchSlotsAction();
  return NextResponse.json(result, {
    status: result.ok ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
