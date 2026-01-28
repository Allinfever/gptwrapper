import { Suspense } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { Loader2 } from 'lucide-react'

function LoginFallback() {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
