import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export interface Product {
  id: string; cj_pid: string; name: string; slug: string
  description: string; images: string[]; price: number
  compare_price: number; category: string; variants: any; created_at: string
}

export interface Order {
  id: string; flw_tx_ref: string; flw_tx_id: string; cj_order_id: string
  customer_email: string; customer_name: string; shipping_address: any
  items: any; total: number; currency: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  tracking_number: string; created_at: string
}
