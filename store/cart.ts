import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string; pid: string; name: string
  image: string; price: number; quantity: number; variant?: string
}

interface CartStore {
  items: CartItem[]; isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], isOpen: false,
      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id)
        if (existing) {
          set(state => ({ items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) }))
        } else {
          set(state => ({ items: [...state.items, item] }))
        }
        set({ isOpen: true })
      },
      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
      updateQty: (id, quantity) => {
        if (quantity <= 0) { get().removeItem(id); return }
        set(state => ({ items: state.items.map(i => (i.id === id ? { ...i, quantity } : i)) }))
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'bloomshelf-cart' }
  )
)
