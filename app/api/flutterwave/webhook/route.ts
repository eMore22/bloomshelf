import { NextRequest, NextResponse } from 'next/server'
import { placeCJOrder } from '@/lib/cj'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOrderConfirmation } from '@/lib/email'

const FLW_BASE   = 'https://api.flutterwave.com/v3'
const FLW_SECRET = process.env.FLW_SECRET_KEY!
const FLW_HASH   = process.env.FLW_WEBHOOK_HASH!

async function verifyTransaction(transactionId: string) {
  const res  = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${FLW_SECRET}` },
  })
  const data = await res.json()
  return data.data
}

export async function POST(req: NextRequest) {
  try {
    const hash = req.headers.get('verif-hash')
    if (!hash || hash !== FLW_HASH) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await req.json()
    if (payload.event !== 'charge.completed') return NextResponse.json({ received: true })

    const { id: transactionId, tx_ref, status } = payload.data
    if (status !== 'successful') return NextResponse.json({ received: true })

    const verified = await verifyTransaction(transactionId)
    if (verified.status !== 'successful') {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    // Idempotency check
    const { data: existingOrder } = await supabaseAdmin
      .from('orders').select('id').eq('flw_tx_ref', tx_ref).single()
    if (existingOrder) return NextResponse.json({ received: true })

    const meta     = verified.meta || {}
    const rawItems = JSON.parse(meta.items || '[]')
    const customer = verified.customer

    // Save order
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders').insert({
        flw_tx_ref:      tx_ref,
        flw_tx_id:       String(transactionId),
        customer_email:  customer.email,
        customer_name:   customer.name,
        shipping_address: meta.shipping_address ? JSON.parse(meta.shipping_address) : null,
        items:           rawItems,
        total:           verified.amount,
        currency:        verified.currency,
        status:          'processing',
      }).select().single()

    if (dbError) {
      console.error('[Webhook] DB error:', dbError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // Place CJ order
    if (meta.shipping_address) {
      try {
        const address = JSON.parse(meta.shipping_address)
        const cjOrder = await placeCJOrder(
          tx_ref,
          rawItems.map((i: any) => ({ vid: i.vid, quantity: i.qty })),
          {
            name:        address.name,
            phone:       address.phone || '0000000000',
            email:       customer.email,
            countryCode: address.countryCode,
            province:    address.province || '',
            city:        address.city,
            address:     address.address,
            zip:         address.zip,
          }
        )
        await supabaseAdmin.from('orders')
          .update({ cj_order_id: cjOrder.orderNum, status: 'processing' })
          .eq('id', order.id)
      } catch (cjErr: any) {
        console.error('[Webhook] CJ order failed:', cjErr.message)
        await supabaseAdmin.from('orders')
          .update({ status: 'pending', cj_order_id: 'NEEDS_REVIEW' })
          .eq('id', order.id)
      }
    }

    // Send confirmation email
    try {
      await sendOrderConfirmation({
        to:       customer.email,
        name:     customer.name,
        orderRef: tx_ref,
        items:    rawItems.map((i: any) => ({
          name:  i.name || i.vid,
          qty:   i.qty,
          price: i.price || 0,
        })),
        total:    verified.amount,
        currency: verified.currency,
      })
    } catch (emailErr) {
      console.error('[Webhook] Email failed:', emailErr)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Webhook] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}