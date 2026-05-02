import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-24 pb-20 min-h-screen bg-bloom-cream">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Delivery Info</p>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Shipping Info</h1>
          </div>

          <div className="space-y-8 text-sm text-bloom-bark/70 leading-relaxed">

            <div className="border-l-2 border-bloom-rose pl-6 space-y-2">
              <h2 className="font-display text-xl font-light text-bloom-bark">Worldwide Shipping</h2>
              <p>We ship to 40+ countries worldwide. Every order is fulfilled and shipped directly from our warehouse partners.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-light text-bloom-bark">Delivery Times</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { region: 'United States', time: '10–15 business days' },
                  { region: 'United Kingdom', time: '10–15 business days' },
                  { region: 'Canada', time: '12–18 business days' },
                  { region: 'Australia', time: '12–20 business days' },
                  { region: 'Europe', time: '10–18 business days' },
                  { region: 'Africa', time: '15–25 business days' },
                  { region: 'Asia Pacific', time: '10–18 business days' },
                  { region: 'Rest of World', time: '15–25 business days' },
                ].map(r => (
                  <div key={r.region} className="border border-bloom-sand p-4">
                    <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mb-1">{r.region}</p>
                    <p className="text-bloom-bark text-sm">{r.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-light text-bloom-bark">Shipping Costs</h2>
              <p>Standard shipping is <strong className="text-bloom-bark">$4.99</strong> on all orders. We offer free shipping on orders over <strong className="text-bloom-bark">$50</strong>.</p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-light text-bloom-bark">Order Tracking</h2>
              <p>Once your order ships, you will receive a tracking number via email. You can also track your order anytime on our <a href="/orders" className="border-b border-bloom-bark/30 hover:text-bloom-berry transition-colors">order tracking page</a>.</p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-light text-bloom-bark">Important Notes</h2>
              <ul className="space-y-2">
                {[
                  'Delivery times are estimates and may vary due to customs clearance.',
                  'International orders may be subject to import duties and taxes.',
                  'We are not responsible for delays caused by customs or postal services.',
                  'Please ensure your shipping address is correct before placing your order.',
                ].map((note, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-bloom-rose mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-bloom-mist p-6 space-y-2">
              <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40">Need Help?</p>
              <p>If your order hasn&apos;t arrived within the estimated timeframe, please <a href="/contact" className="border-b border-bloom-bark/30 hover:text-bloom-berry transition-colors">contact us</a> and we will investigate immediately.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}