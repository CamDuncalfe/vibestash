import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  let body: { email?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const { email } = body

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email })

  if (error) {
    // Handle unique constraint violation — already subscribed is fine
    if (error.code === '23505') {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
