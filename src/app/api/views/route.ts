import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  let body: { product_id?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const { product_id } = body

  if (!product_id) {
    return NextResponse.json(
      { error: 'product_id is required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.rpc('increment_views', {
    product_id,
  })

  if (error) {
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
