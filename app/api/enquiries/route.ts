import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name || !body?.phone || !body?.email) return NextResponse.json({ ok:false, message:'Name, phone and email are required.' }, { status:400 });
  // Production hook: connect this validated payload to email/CRM/database via environment variables.
  console.log('New Creativatorss enquiry:', { ...body, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok:true, message:'Enquiry received.' });
}
