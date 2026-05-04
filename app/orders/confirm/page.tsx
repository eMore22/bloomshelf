import { Suspense } from 'react'
import ConfirmContent from './ConfirmContent'

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bloom-cream flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-bloom-rose border-t-bloom-berry rounded-full animate-spin" />
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}