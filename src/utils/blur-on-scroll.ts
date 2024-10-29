export default function blurBackgroundOnScroll({
  element
}: {
  element: HTMLElement | null
}) {
  if (element === null) {
    return
  }

  if (!(element instanceof HTMLElement)) {
    throw new Error('Param must be instace of Element')
  }

  window.addEventListener('scroll', () => {
    if (window.innerWidth < 425) {
      return
    }

    if (window.scrollY > 0) {
      element.classList.add('header-blur')
    } else {
      element.classList.remove('header-blur')
    }
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 425) {
      if (window.scrollY > 0) return

      element.classList.remove('header-blur')

      return
    }

    element.classList.add('header-blur')
  })

  document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 425) {
      return
    }

    element.classList.add('header-blur')
  })
}
