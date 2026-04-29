'use client'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCart()
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-50 bg-bloom-bark/30 backdrop-blur-sm" onClick={closeCart} />}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-bloom-cream flex flex-col shadow-2xl transition-transform duration-400 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-bloom-sand">
          <span className="font-display text-xl font-light tracking-wide">Your Bag</span>
          <button onClick={closeCart} className="text-bloom-bark/50 hover:text-bloom-bark transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-bloom-bark/40">
              <ShoppingBag size={40} strokeWidth={1} />
              <p className="font-body text-sm tracking-wide">Your bag is empty</p>
              <button onClick={closeCart} className="text-xs tracking-widest uppercase border-b border-bloom-bark/30 pb-0.5 hover:text-bloom-berry hover:border-bloom-berry transition-colors">Continue Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-24 rounded-sm overflow-hidden bg-bloom-sand flex-shrink-0">
                  <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-bloom-bark line-clamp-2 leading-snug">{item.name}</p>
                  {item.variant && <p className="text-xs text-bloom-bark/50 mt-0.5">{item.variant}</p>}
                  <p className="font-display text-base mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center border border-bloom-sand rounded-full hover:border-bloom-berry transition-colors"><Minus size={10} /></button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center border border-bloom-sand rounded-full hover:border-bloom-berry transition-colors"><Plus size={10} /></button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-[10px] tracking-widest uppercase text-bloom-bark/30 hover:text-bloom-berry transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-bloom-sand space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-bloom-bark/60 tracking-wide">Subtotal</span>
              <span className="font-display text-xl">${total().toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-bloom-bark/40 tracking-wide">Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={closeCart} className="block w-full bg-bloom-bark text-bloom-cream text-center text-sm tracking-widest uppercase py-4 hover:bg-bloom-berry transition-colors duration-300">Checkout</Link>
          </div>
        )}
      </div>
    </>
  )
}
