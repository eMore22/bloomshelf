import { NextRequest, NextResponse } from 'next/server'

const FLW_BASE   = 'https://api.flutterwave.com/v3'
const FLW_SECRET = process.env.FLW_SECRET_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const transactionId    = searchParams.get('transaction_id')
  const txRef            = searchParams.get('tx_ref')
  if (!transactionId || !txRef) return NextResponse.json({ ok: false, error: 'Missing params' }, { status: 400 })
  try {
    const res  = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, { headers: { Authorization: `Bearer ${FLW_SECRET}` } })
    const data = await res.json()
    const tx   = data.data
    if (tx.status === 'successful' && tx.tx_ref === txRef) {
      return NextResponse.json({ ok: true, message: 'Payment verified', txRef: tx.tx_ref, amount: tx.amount, currency: tx.currency })
    }
    return NextResponse.json({ ok: false, error: 'Payment not verified' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
