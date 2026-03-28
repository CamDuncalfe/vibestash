import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'trending'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  const from = (page - 1) * limit
  const to = from + limit - 1

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('approved', true)

  if (category) {
    query = query.contains('categories', [category])
  }

  switch (sort) {
    case 'trending':
      query = query
        .order('featured', { ascending: false })
        .order('released_at', { ascending: false, nullsFirst: false })
        .order('upvotes_count', { ascending: false })
        .order('likes_count', { ascending: false })
        .order('created_at', { ascending: false })
      break
    case 'popular':
      query = query.order('view_count', { ascending: false })
      break
    case 'liked':
      query = query.order('like_count', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }

  return NextResponse.json({ products: data, total: count })
}
