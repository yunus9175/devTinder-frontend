import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthInitializer } from './components/auth/AuthInitializer'
import { UnauthorizedHandler } from './components/auth/UnauthorizedHandler'
import { GuestOnly } from './components/auth/GuestOnly'
import { PageLoader } from './components/ui/PageLoader'
import { ROUTES } from './constants'

const Layout = lazy(() =>
  import('./components/layout/Layout').then((m) => ({ default: m.Layout })),
)
const Landing = lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.Landing })),
)
const Login = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.Login })),
)
const Signup = lazy(() =>
  import('./pages/SignupPage').then((m) => ({ default: m.Signup })),
)
const Feed = lazy(() =>
  import('./pages/FeedPage').then((m) => ({ default: m.Feed })),
)
const Profile = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.Profile })),
)
const Connections = lazy(() =>
  import('./pages/ConnectionsPage').then((m) => ({ default: m.Connections })),
)
const Requests = lazy(() =>
  import('./pages/RequestsPage').then((m) => ({ default: m.Requests })),
)
const Payments = lazy(() =>
  import('./pages/Payments').then((m) => ({ default: m.Payments })),
)
export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer />
      <UnauthorizedHandler />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<GuestOnly />}>
              <Route path={ROUTES.HOME} element={<Landing />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
            </Route>
            <Route path={ROUTES.DASHBOARD} element={<Feed />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.CONNECTIONS} element={<Connections />} />
            <Route path={ROUTES.REQUESTS} element={<Requests />} />
            <Route path={ROUTES.PAYMENT} element={<Payments />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
