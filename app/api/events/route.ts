import { NextResponse } from 'next/server';
import { events } from '../../../lib/dummy-data';

export async function GET() {
  return NextResponse.json(events);
} 