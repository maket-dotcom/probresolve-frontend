import Link from "next/link"
import { login } from "./actions"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-dark-s0 border border-dark-border rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-dark-pop">Sign In</h1>

      {params?.error && (
        <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6 text-sm">
          {params.error}
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
            className="w-full bg-dark-s1 border border-dark-border rounded-md px-3 py-2 text-dark-pop focus:outline-none focus:border-brand-teal"
            placeholder="••••••••"
          />
        </div>

        <button
          formAction={login}
          className="w-full mt-4 bg-brand-teal hover:bg-brand-teal-h text-white font-semibold py-2.5 rounded-md transition-colors"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-dark-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-teal hover:text-brand-teal-h transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  )
}
