import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ref = searchParams.get('ref')

  if (!ref) {
    return NextResponse.json({ ok: false, error: 'Missing order reference' }, { status: 400 })
  }

  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('flw_tx_ref', ref.trim())
      .single()

    if (error || !order) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, order })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}