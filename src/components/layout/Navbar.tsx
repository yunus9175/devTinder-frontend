import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { logout } from '../../api/auth'

const DEFAULT_AVATAR = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === ROUTES.LOGIN
  const isSignupPage = location.pathname === ROUTES.SIGNUP

  const handleLogout = async () => {
    try {
      await logout()
      navigate(ROUTES.HOME)
    } catch {
      navigate(ROUTES.HOME)
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to={ROUTES.HOME} className="btn btn-ghost text-xl">
          DevTinder
        </Link>
      </div>
      <div className="flex gap-2">
        {isLoginPage && (
          <Link to={ROUTES.SIGNUP} className="btn btn-ghost">
            Sign up
          </Link>
        )}
        {isSignupPage && (
          <Link to={ROUTES.LOGIN} className="btn btn-ghost">
            Log in
          </Link>
        )}
        {!isLoginPage && !isSignupPage && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src={DEFAULT_AVATAR}
                />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={ROUTES.DASHBOARD} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><a>Settings</a></li>
              <li><button type="button" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
