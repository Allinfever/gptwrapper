'use client'

import { useAuth } from '@/components/AuthProvider'
import { LogOut, User, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function UserMenu() {
  const { user, signOut, isLoading } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
  }

  // Get user initials or first letter of email
  const displayName = user.user_metadata?.full_name || user.email || 'User'
  const initials = displayName.charAt(0).toUpperCase()
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayName}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
        )}
        <span className="text-sm text-gray-700 hidden sm:inline max-w-[150px] truncate">
          {displayName}
        </span>
      </div>
      
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        title="Déconnexion"
      >
        {isSigningOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
