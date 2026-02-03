import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const location = useLocation()
  const hideFooter = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP || location.pathname === ROUTES.HOME
  const [navHidden, setNavHidden] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const lastScrollTop = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const current = el.scrollTop
      const delta = current - lastScrollTop.current
      const threshold = 6

      if (Math.abs(delta) < threshold) {
        return
      }

      if (current <= 0) {
        setNavHidden(false)
      } else if (delta > 0) {
        // scrolling down -> hide navbar
        setNavHidden(true)
      } else {
        // scrolling up -> show navbar
        setNavHidden(false)
      }

      lastScrollTop.current = current
    }

    el.addEventListener('scroll', handleScroll)
    return () => {
      el.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar hidden={navHidden} />
      <main ref={scrollRef} className="flex-1 min-h-0 flex flex-col overflow-auto">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
