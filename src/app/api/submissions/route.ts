import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  let body: {
    product_url: string
    product_name?: string
    tools_used?: string[]
    maker_name?: string
    maker_url?: string
    comments?: string
    user_id?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.product_url) {
    return NextResponse.json({ error: 'Product URL is required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase.from('submissions').insert({
    product_url: body.product_url,
    product_name: body.product_name || null,
    tools_used: body.tools_used || [],
    maker_name: body.maker_name || null,
    maker_url: body.maker_url || null,
    comments: body.comments || null,
    user_id: body.user_id || null,
    status: 'pending',
  }).select().single()

  if (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }

  return NextResponse.json({ success: true, submission: data })
}

// GET pending submissions (for admin review)
export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }

  return NextResponse.json({ submissions: data })
}
