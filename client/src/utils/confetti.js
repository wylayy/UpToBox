export function celebrateUpload() {
  if (typeof window === 'undefined') return

  const isMobile =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 640px)').matches

  const baseCount = isMobile ? 80 : 200
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  }

  import('canvas-confetti')
    .then(({ default: confetti }) => {
      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(baseCount * particleRatio)
        })
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55
      })

      fire(0.2, {
        spread: 60
      })

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 45
      })
    })
    .catch(() => {
      // fail silently if confetti fails to load
    })
}
