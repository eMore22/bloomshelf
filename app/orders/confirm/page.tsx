'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import Link from 'next/link'

type Status = 'loading' | 'success' | 'failed' | 'cancelled'

export default function ConfirmPage() {
  const params    = useSearchParams()
  const router    = useRouter()
  const clearCart = useCart(s => s.clearCart)
  const [status,  setStatus]  = useState<Status>('loading')
  const [txRef,   setTxRef]   = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const paymentStatus = params.get('status')
    const ref           = params.get('tx_ref') || ''
    const txId          = params.get('transaction_id') || ''
    setTxRef(ref)
    if (paymentStatus === 'successful' && txId) {
      fetch(`/api/flutterwave/verify?transaction_id=${txId}&tx_ref=${ref}`)
        .then(r => r.json())
        .then(data => {
          if (data.ok) { clearCart(); setStatus('success') }
          else { setStatus('failed'); setMessage(data.error || 'Verification failed.') }
        })
        .catch(() => { setStatus('failed'); setMessage('Could not verify payment. Contact support.') })
    } else if (paymentStatus === 'cancelled') {
      setStatus('cancelled')
    } else {
      setStatus('failed'); setMessage('Payment was not completed.')
    }
  }, [params, clearCart])

  return (
    <main className="min-h-screen bg-bloom-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <><div className="w-12 h-12 border-2 border-bloom-rose border-t-bloom-berry rounded-full animate-spin mx-auto" /><p className="font-body text-bloom-bark/60 tracking-wide">Confirming your payment…</p></>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl">🌸</div>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Order Confirmed!</h1>
            <p className="font-body text-sm text-bloom-bark/60 leading-relaxed">Thank you for shopping with BloomShelf. Your order is being prepared for shipment.</p>
            <div className="bg-bloom-mist rounded-sm p-4">
              <p className="text-xs tracking-widest uppercase text-bloom-bark/40 mb-1">Order Reference</p>
              <p className="font-body text-sm text-bloom-bark font-medium">{txRef}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/orders?ref=${txRef}`} className="bg-bloom-bark text-bloom-cream text-sm tracking-widest uppercase px-6 py-3 hover:bg-bloom-berry transition-colors">Track Order</Link>
              <Link href="/shop" className="border border-bloom-sand text-bloom-bark text-sm tracking-widest uppercase px-6 py-3 hover:border-bloom-berry hover:text-bloom-berry transition-colors">Continue Shopping</Link>
            </div>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="text-5xl">😔</div>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Payment Failed</h1>
            <p className="font-body text-sm text-bloom-bark/60">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => router.back()} className="bg-bloom-bark text-bloom-cream text-sm tracking-widest uppercase px-6 py-3 hover:bg-bloom-berry transition-colors">Try Again</button>
              <Link href="/shop" className="border border-bloom-sand text-bloom-bark text-sm tracking-widest uppercase px-6 py-3 hover:border-bloom-berry hover:text-bloom-berry transition-colors">Back to Shop</Link>
            </div>
          </>
        )}
        {status === 'cancelled' && (
          <>
            <div className="text-5xl">🛒</div>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Payment Cancelled</h1>
            <p className="font-body text-sm text-bloom-bark/60">Your cart is still saved. Ready when you are.</p>
            <button onClick={() => router.back()} className="bg-bloom-bark text-bloom-cream text-sm tracking-widest uppercase px-6 py-3 hover:bg-bloom-berry transition-colors">Return to Cart</button>
          </>
        )}
      </div>
    </main>
  )
}
