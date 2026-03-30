import { useNavigate } from 'react-router-dom'
import { PortalHeader } from '../components/PortalHeader'
import { PORTAL_SYSTEM_NAME } from '../branding'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="portal-shell portal-shell--login">
      <PortalHeader />
      <div className="portal-login-body">
        <article className="portal-card portal-login-card">
          <h1 className="portal-login-card-title">Sign in</h1>
          <p className="portal-login-card-lede">
            Sign in to the {PORTAL_SYSTEM_NAME} with your university credentials. This preview does
            not verify your identity.
          </p>
          <div className="portal-login-fields">
            <div className="portal-login-field">
              <label className="portal-login-label" htmlFor="login-username">
                Username
              </label>
              <input
                id="login-username"
                className="portal-login-input"
                type="text"
                name="username"
                autoComplete="username"
              />
            </div>
            <div className="portal-login-field">
              <label className="portal-login-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                className="portal-login-input"
                type="password"
                name="password"
                autoComplete="current-password"
              />
            </div>
          </div>
          <button
            type="button"
            className="portal-btn portal-btn--primary portal-login-submit"
            onClick={() => navigate('/')}
          >
            Sign In
          </button>
        </article>
      </div>
    </div>
  )
}
