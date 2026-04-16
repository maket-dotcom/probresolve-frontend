import Link from "next/link"
import { signup, resendConfirmation } from "../login/actions"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string, error?: string }>
}) {
  const params = await searchParams;

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-dark-s0 border border-dark-border rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-dark-pop">Create Account</h1>

      {params?.error && (
        <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6 text-sm">
          {params.error}
        </div>
      )}

      {params?.message && (
        <div className="bg-green-900/40 border border-green-500/50 text-green-200 px-4 py-3 rounded-md mb-6 text-sm">
          {params.message}
        </div>
      )}

      <form className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-muted mb-1" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-dark-s1 border border-dark-border rounded-md px-3 py-2 text-dark-pop focus:outline-none focus:border-brand-teal"
            placeholder="you@example.com"
          />
          <p className="text-xs text-dark-muted mt-1">We will send a verification link to this email.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-muted mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full bg-dark-s1 border border-dark-border rounded-md px-3 py-2 text-dark-pop focus:outline-none focus:border-brand-teal"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            formAction={signup}
            className="w-full bg-brand-teal hover:bg-brand-teal-h text-white font-semibold py-2.5 rounded-md transition-colors"
          >
            Sign Up
          </button>
          
          <button
            formAction={resendConfirmation}
            className="w-full bg-dark-s2 hover:bg-dark-s-hover border border-dark-border text-dark-pop font-medium py-2 rounded-md transition-colors text-sm"
          >
            Didn&apos;t get the email? Resend link
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-dark-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-teal hover:text-brand-teal-h transition-colors">
          Log in
        </Link>
      </div>
    </div>
  )
}
