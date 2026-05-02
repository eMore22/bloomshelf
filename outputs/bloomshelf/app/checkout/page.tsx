'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import { useCart } from '@/store/cart'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    phone:    '',
    address:  '',
    city:     '',
    province: '',
    zip:      '',
    country:  'US',
  })

  const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'GH', name: 'Ghana' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'KE', name: 'Kenya' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'SG', name: 'Singapore' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'IE', name: 'Ireland' },
  ]

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleCheckout() {
    if (!items.length) return
    const required = ['name', 'email', 'address', 'city', 'zip', 'country']
    const missing  = required.filter(f => !form[f as keyof typeof form])
    if (missing.length) { setError('Please fill in all required fields.'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/flutterwave/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerEmail: form.email,
          customerName:  form.name,
          customerPhone: form.phone,
          shippingAddress: JSON.stringify({
            name:        form.name,
            phone:       form.phone,
            address:     form.address,
            city:        form.city,
            province:    form.province,
            zip:         form.zip,
            countryCode: form.country,
          }),
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Payment failed. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen bg-bloom-cream flex flex-col items-center justify-center gap-4">
          <p className="font-display text-3xl font-light text-bloom-bark">Your bag is empty</p>
          <Link href="/shop" className="text-xs tracking-widest uppercase border-b border-bloom-bark pb-0.5 hover:text-bloom-berry transition-colors">
            Continue Shopping
          </Link>
        </main>
      </>
    )
  }

  const subtotal = total()
  const shipping = 4.99
  const grandTotal = subtotal + shipping

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-20 min-h-screen bg-bloom-cream">
        <div className="max-w-5xl mx-auto px-6">

          <div className="mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Almost there</p>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Shipping form */}
            <div className="space-y-6">
              <h2 className="font-display text-xl font-light text-bloom-bark">Shipping Details</h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Full Name *</label>
                  <input
                    name="name" value={form.name} onChange={update}
                    className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                    placeholder="Ruth Ozomoge"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Email *</label>
                  <input
                    name="email" value={form.email} onChange={update} type="email"
                    className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                    placeholder="ruth@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Phone</label>
                  <input
                    name="phone" value={form.phone} onChange={update} type="tel"
                    className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Country *</label>
                  <select
                    name="country" value={form.country} onChange={update}
                    className="w-full border border-bloom-sand bg-bloom-cream px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Street Address *</label>
                  <input
                    name="address" value={form.address} onChange={update}
                    className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                    placeholder="123 Main Street"
                  />
                </div>

                {/* City + Province */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">City *</label>
                    <input
                      name="city" value={form.city} onChange={update}
                      className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">State / Province</label>
                    <input
                      name="province" value={form.province} onChange={update}
                      className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                      placeholder="NY"
                    />
                  </div>
                </div>

                {/* ZIP */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">ZIP / Postal Code *</label>
                  <input
                    name="zip" value={form.zip} onChange={update}
                    className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                    placeholder="10001"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 tracking-wide">{error}</p>
              )}
            </div>

            {/* Order summary */}
            <div className="space-y-6">
              <h2 className="font-display text-xl font-light text-bloom-bark">Order Summary</h2>

              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-bloom-sand rounded-sm overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-bloom-bark line-clamp-1">{item.name}</p>
                      {item.variant && <p className="text-xs text-bloom-bark/50">{item.variant}</p>}
                      <p className="text-xs text-bloom-bark/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-display text-sm text-bloom-bark">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-bloom-sand pt-4 space-y-2">
                <div className="flex justify-between text-sm text-bloom-bark/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-bloom-bark/60">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display text-lg text-bloom-bark pt-2 border-t border-bloom-sand">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[11px] text-bloom-bark/40 tracking-wide">
                🌍 Ships worldwide · 10–20 business days · Tracked delivery
              </p>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-bloom-bark text-bloom-cream text-sm tracking-widest uppercase py-4 hover:bg-bloom-berry transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Redirecting to payment...' : `Pay $${grandTotal.toFixed(2)}`}
              </button>

              <p className="text-[11px] text-bloom-bark/40 text-center tracking-wide">
                🔒 Secured by Flutterwave · SSL Encrypted
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
