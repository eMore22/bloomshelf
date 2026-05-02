'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Link from 'next/link'

export default function OrdersPage() {
  const [ref,     setRef]     = useState('')
  const [order,   setOrder]   = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function trackOrder() {
    if (!ref.trim()) { setError('Please enter your order reference.'); return }
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res  = await fetch(`/api/orders/track?ref=${encodeURIComponent(ref.trim())}`)
      const data = await res.json()
      if (data.ok) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Order not found. Check your reference and try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const STATUS_LABELS: Record<string, string> = {
    pending:    'Order Received',
    processing: 'Being Prepared',
    shipped:    'On Its Way',
    delivered:  'Delivered',
    cancelled:  'Cancelled',
  }

  const STATUS_COLORS: Record<string, string> = {
    pending:    'text-yellow-600 bg-yellow-50',
    processing: 'text-blue-600 bg-blue-50',
    shipped:    'text-green-600 bg-green-50',
    delivered:  'text-bloom-berry bg-bloom-rose/20',
    cancelled:  'text-red-600 bg-red-50',
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-20 min-h-screen bg-bloom-cream">
        <div className="max-w-2xl mx-auto px-6">

          <div className="mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Your Orders</p>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Track Order</h1>
            <p className="text-sm text-bloom-bark/50 mt-3 leading-relaxed">
              Enter your order reference from your confirmation email to track your delivery.
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-10">
            <input
              value={ref}
              onChange={e => setRef(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && trackOrder()}
              placeholder="e.g. BS-1234567890-ABCDE"
              className="flex-1 border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
            />
            <button
              onClick={trackOrder}
              disabled={loading}
              className="bg-bloom-bark text-bloom-cream text-xs tracking-widest uppercase px-6 py-3 hover:bg-bloom-berry transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Track'}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-6">{error}</p>
          )}

          {/* Order result */}
          {order && (
            <div className="space-y-6">
              {/* Status */}
              <div className="border border-bloom-sand p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40">Order Reference</p>
                  <p className="text-sm font-medium text-bloom-bark">{order.flw_tx_ref}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40">Status</p>
                  <span className={`text-xs tracking-wide px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'text-bloom-bark bg-bloom-sand'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40">Total Paid</p>
                  <p className="font-display text-lg text-bloom-bark">${Number(order.total).toFixed(2)} {order.currency}</p>
                </div>
                {order.tracking_number && (
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40">Tracking Number</p>
                    <p className="text-sm text-bloom-bark font-medium">{order.tracking_number}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40">Order Date</p>
                  <p className="text-sm text-bloom-bark/60">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Items */}
              {order.items && order.items.length > 0 && (
                <div className="border border-bloom-sand p-6 space-y-4">
                  <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mb-4">Items Ordered</p>
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-bloom-bark">
                      <span className="text-bloom-bark/70">{item.name || item.vid} × {item.qty}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping */}
              {order.shipping_address && (
                <div className="border border-bloom-sand p-6 space-y-2">
                  <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mb-3">Shipping To</p>
                  <p className="text-sm text-bloom-bark">{order.shipping_address.name}</p>
                  <p className="text-sm text-bloom-bark/60">{order.shipping_address.address}</p>
                  <p className="text-sm text-bloom-bark/60">{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.zip}</p>
                  <p className="text-sm text-bloom-bark/60">{order.shipping_address.countryCode}</p>
                </div>
              )}

              <p className="text-xs text-bloom-bark/40 text-center tracking-wide">
                Estimated delivery: 10–20 business days from order date
              </p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-bloom-sand text-center">
            <p className="text-sm text-bloom-bark/50 mb-3">Need help with your order?</p>
            <Link href="/contact" className="text-xs tracking-widest uppercase border-b border-bloom-bark/30 pb-0.5 hover:text-bloom-berry hover:border-bloom-berry transition-colors">
              Contact Us
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
