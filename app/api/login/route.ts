import { NextResponse } from 'next/server';
import { login } from '@/lib/dummy-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await login(email, password);
    
    if (result.success) {
      return NextResponse.json({ user: result.user });
    } else {
      return NextResponse.json({ error: result.message }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 