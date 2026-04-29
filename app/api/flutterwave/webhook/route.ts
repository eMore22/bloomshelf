import { NextRequest, NextResponse } from 'next/server'
import { placeCJOrder } from '@/lib/cj'
import { supabaseAdmin } from '@/lib/supabase'

const FLW_BASE   = 'https://api.flutterwave.com/v3'
const FLW_SECRET = process.env.FLW_SECRET_KEY!
const FLW_HASH   = process.env.FLW_WEBHOOK_HASH!

async function verifyTransaction(transactionId: string) {
  const res  = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, { headers: { Authorization: `Bearer ${FLW_SECRET}` } })
  const data = await res.json()
  return data.data
}

export async function POST(req: NextRequest) {
  try {
    const hash = req.headers.get('verif-hash')
    if (!hash || hash !== FLW_HASH) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await req.json()
    if (payload.event !== 'charge.completed') return NextResponse.json({ received: true })

    const { id: transactionId, tx_ref, status } = payload.data
    if (status !== 'successful') return NextResponse.json({ received: true })

    const verified = await verifyTransaction(transactionId)
    if (verified.status !== 'successful') return NextResponse.json({ error: 'Verification failed' }, { status: 400 })

    const { data: existingOrder } = await supabaseAdmin.from('orders').select('id').eq('flw_tx_ref', tx_ref).single()
    if (existingOrder) return NextResponse.json({ received: true })

    const meta     = verified.meta || {}
    const rawItems = JSON.parse(meta.items || '[]')
    const customer = verified.customer

    const { data: order, error: dbError } = await supabaseAdmin.from('orders').insert({
      flw_tx_ref: tx_ref, flw_tx_id: String(transactionId),
      customer_email: customer.email, customer_name: customer.name,
      shipping_address: meta.shipping_address ? JSON.parse(meta.shipping_address) : null,
      items: rawItems, total: verified.amount, currency: verified.currency, status: 'processing',
    }).select().single()

    if (dbError) return NextResponse.json({ error: 'DB error' }, { status: 500 })

    if (meta.shipping_address) {
      try {
        const address  = JSON.parse(meta.shipping_address)
        const cjOrder  = await placeCJOrder(tx_ref, rawItems.map((i: any) => ({ vid: i.vid, quantity: i.qty })), {
          name: address.name, phone: address.phone || '0000000000', email: customer.email,
          countryCode: address.countryCode, province: address.province || '',
          city: address.city, address: address.address, zip: address.zip,
        })
        await supabaseAdmin.from('orders').update({ cj_order_id: cjOrder.orderNum, status: 'processing' }).eq('id', order.id)
      } catch (cjErr: any) {
        await supabaseAdmin.from('orders').update({ status: 'pending', cj_order_id: 'NEEDS_REVIEW' }).eq('id', order.id)
      }
    }
    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
