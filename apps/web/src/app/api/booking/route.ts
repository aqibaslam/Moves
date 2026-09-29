import { NextResponse } from 'next/server';

import { createBookingAction } from '@/app/(frontend)/book/actions';

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid booking request.' }, { status: 400 });
  }

  const result = await createBookingAction(input);
  const status = result.ok ? 201 : result.code === 'slot_taken' ? 409 : 400;
  return NextResponse.json(result, { status });
}
