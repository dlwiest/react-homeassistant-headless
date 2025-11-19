import { useCurrentUser } from 'hass-react'
import '../../styles/dashboard.css'

export function UserGreeting() {
  const user = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div className="user-greeting">
      <span className="greeting-text">Hello, {user.name}!</span>
      {user.is_admin && <span className="user-badge admin">Admin</span>}
      {user.is_owner && <span className="user-badge owner">Owner</span>}
    </div>
  )
}
