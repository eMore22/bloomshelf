'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-24 pb-20 min-h-screen bg-bloom-cream">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Get In Touch</p>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Contact Us</h1>
            <p className="text-sm text-bloom-bark/50 mt-3 leading-relaxed">
              We typically respond within 24 hours. For order issues, please include your order reference.
            </p>
          </div>

          {status === 'success' ? (
            <div className="border border-bloom-sand p-8 text-center space-y-3">
              <div className="text-4xl">🌸</div>
              <h2 className="font-display text-2xl font-light text-bloom-bark">Message Sent!</h2>
              <p className="text-sm text-bloom-bark/60">We will get back to you within 24 hours.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs tracking-widest uppercase border-b border-bloom-bark/30 pb-0.5 hover:text-bloom-berry transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Full Name *</label>
                <input name="name" value={form.name} onChange={update}
                  className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Email *</label>
                <input name="email" value={form.email} onChange={update} type="email"
                  className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Subject</label>
                <input name="subject" value={form.subject} onChange={update}
                  className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors"
                  placeholder="Order issue, product question, etc." />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-bloom-bark/50 block mb-1">Message *</label>
                <textarea name="message" value={form.message} onChange={update} rows={6}
                  className="w-full border border-bloom-sand bg-transparent px-4 py-3 text-sm text-bloom-bark focus:outline-none focus:border-bloom-bark transition-colors resize-none"
                  placeholder="Tell us how we can help..." />
              </div>
              {status === 'error' && (
                <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="w-full bg-bloom-bark text-bloom-cream text-sm tracking-widest uppercase py-4 hover:bg-bloom-berry transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-bloom-sand grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mb-2">Email</p>
              <p className="text-sm text-bloom-bark">support@bloomshelf.store</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mb-2">Response Time</p>
              <p className="text-sm text-bloom-bark">Within 24 hours</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}