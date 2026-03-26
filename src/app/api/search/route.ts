import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ products: [] })
  }

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('search_products', {
    search_query: q,
  })

  if (error) {
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ products: data })
}
