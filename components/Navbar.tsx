'use client'
import Link from 'next/link'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/store/cart'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, openCart } = useCart()
  const count = itemCount()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bloom-cream/80 backdrop-blur-md border-b border-bloom-sand">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button className="md:hidden text-bloom-bark" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm tracking-widest uppercase text-bloom-bark/70 hover:text-bloom-berry transition-colors">Shop</Link>
            <Link href="/shop?cat=beauty" className="text-sm tracking-widest uppercase text-bloom-bark/70 hover:text-bloom-berry transition-colors">Beauty</Link>
            <Link href="/shop?cat=home" className="text-sm tracking-widest uppercase text-bloom-bark/70 hover:text-bloom-berry transition-colors">Home</Link>
          </div>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-display text-2xl font-light tracking-wider text-bloom-bark">BloomShelf</span>
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <button aria-label="Search" className="text-bloom-bark/70 hover:text-bloom-berry transition-colors"><Search size={18} /></button>
            <button aria-label="Cart" onClick={openCart} className="relative text-bloom-bark/70 hover:text-bloom-berry transition-colors">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-bloom-berry text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-body font-medium">{count}</span>
              )}
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-bloom-cream pt-16 flex flex-col items-center justify-center gap-10">
          {['Shop', 'Beauty', 'Home'].map(link => (
            <Link key={link} href={link === 'Shop' ? '/shop' : `/shop?cat=${link.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="font-display text-4xl font-light text-bloom-bark hover:text-bloom-berry transition-colors">{link}</Link>
          ))}
        </div>
      )}
    </>
  )
}
