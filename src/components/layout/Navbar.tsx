import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/index'
import { logout } from '../../api/auth.ts'
import { useAppDispatch, useAppSelector } from '../../store/index.ts'
import { clearCredentials } from '../../store/slices/authSlice'

const DEFAULT_AVATAR = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'

interface NavbarProps {
  hidden?: boolean
}

export function Navbar({ hidden = false }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const profilePicture = user?.profilePicture ?? DEFAULT_AVATAR
  const isLoginPage = location.pathname === ROUTES.LOGIN
  const isSignupPage = location.pathname === ROUTES.SIGNUP

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
    }
    dispatch(clearCredentials())
    navigate(ROUTES.HOME)
  }

  const translateClass = hidden ? '-translate-y-full' : 'translate-y-0'

  return (
    <div className={`navbar bg-base-300 shadow-sm sticky top-0 z-20 transition-transform duration-300 ease-out ${translateClass}`}>
      <div className="flex-1 flex items-center gap-2 sm:gap-4 justify-between">
        <Link to={ROUTES.HOME} className="btn btn-ghost text-xl">
          DevTinder
        </Link>
        {user && (
          <span className="text-sm sm:text-base text-base-content/80 truncate max-w-[140px] sm:max-w-none mr-2">
            Welcome, {user.firstName}
          </span>
        )}
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
        {!isLoginPage && !isSignupPage && user && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={`${user.firstName} profile`}
                  src={profilePicture}
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    ; (e.target as HTMLImageElement).src = DEFAULT_AVATAR
                  }}
                />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={ROUTES.PROFILE} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONNECTIONS}>Connections</Link>
              </li>
              <li>
                <Link to={ROUTES.REQUESTS}>Requests</Link>
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
