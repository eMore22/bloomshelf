import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Link from 'next/link'

export default function ReturnsPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-24 pb-20 min-h-screen bg-bloom-cream">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Our Policy</p>
            <h1 className="font-display text-4xl font-light text-bloom-bark">Returns & Refunds</h1>
          </div>

          <div className="space-y-8 text-sm text-bloom-bark/70 leading-relaxed">

            <div className="border-l-2 border-bloom-rose pl-6 space-y-2">
              <h2 className="font-display text-xl font-light text-bloom-bark">30-Day Return Policy</h2>
              <p>We want you to love every BloomShelf purchase. If you are not completely satisfied, we accept returns within 30 days of delivery.</p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-light text-bloom-bark">Eligible for Return</h2>
              <ul className="space-y-2">
                {[
                  'Item arrived damaged or defective',
                  'Wrong item was sent',
                  'Item significantly different from description',
                  'Item never arrived (after 30 business days)',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-bloom-rose mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-light text-bloom-bark">Not Eligible for Return</h2>
              <ul className="space-y-2">
                {[
                  'Change of mind after item has shipped',
                  'Items damaged due to misuse',
                  'Items returned without contacting us first',
                  'Items returned after 30 days of delivery',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-bloom-bark/30 mt-0.5">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-light text-bloom-bark">How to Request a Return</h2>
              <ol className="space-y-3">
                {[
                  'Contact us at support@bloomshelf.store with your order reference and reason for return.',
                  'Include photos of the item if it arrived damaged or defective.',
                  'We will review your request within 2 business days.',
                  'If approved, we will provide return instructions or process your refund directly.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-display text-bloom-rose text-lg leading-none mt-0.5">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-light text-bloom-bark">Refund Processing</h2>
              <p>Once your return is approved, refunds are processed within <strong className="text-bloom-bark">5–10 business days</strong> back to your original payment method. You will receive an email confirmation when the refund is issued.</p>
            </div>

            <div className="bg-bloom-mist p-6 space-y-3">
              <p className="font-display text-lg font-light text-bloom-bark">Ready to start a return?</p>
              <p>Contact our support team and we will make it right.</p>
              <Link
                href="/contact"
                className="inline-block bg-bloom-bark text-bloom-cream text-xs tracking-widest uppercase px-6 py-3 hover:bg-bloom-berry transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}