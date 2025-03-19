import { NextResponse } from 'next/server';
import { groups } from '../../../lib/dummy-data';

export async function GET() {
  return NextResponse.json(groups);
}
