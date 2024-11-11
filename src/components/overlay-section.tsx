import useUnmounted from '@/hooks/use-unmounted'
import { cn } from '@/utils/cn'
import { LazyMotion, m } from 'framer-motion'
import type React from 'react'
import { useEffect } from 'react'

const features = await import('@/framer-motion-features').then(
  (file) => file.default
)

export default function OverlayedSection({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  useUnmounted(() => {
    document.body.style.overflow = ''
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  return (
    <LazyMotion features={features}>
      <m.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, y: 100 }}
        className={cn(
          'fixed top-0 left-0 w-screen h-screen bg-soft-white z-50 overflow-y-auto overflow-x-hidden',
          className
        )}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
