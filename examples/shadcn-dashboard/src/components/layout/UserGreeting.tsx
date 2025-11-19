import { useCurrentUser } from 'hass-react'
import { User } from 'lucide-react'

export function UserGreeting() {
  const user = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
      <User className="h-4 w-4 text-slate-400" />
      <span className="text-sm font-medium text-slate-300">
        Hello, {user.name}!
      </span>
      {user.is_admin && (
        <span className="px-2 py-0.5 text-xs font-semibold text-blue-400 bg-blue-500/20 border border-blue-500/30 rounded uppercase tracking-wide">
          Admin
        </span>
      )}
      {user.is_owner && (
        <span className="px-2 py-0.5 text-xs font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded uppercase tracking-wide">
          Owner
        </span>
      )}
    </div>
  )
}
