import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import ProblemCard from "@/components/ProblemCard"
import type { ProblemListItem } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Verify User Session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/login")
  }

  // Fetch only their complaints using the internal Next.js API url
  const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  let problems: ProblemListItem[] = []
  let errorMsg = null

  try {
    const res = await fetch(`${API}/api/problems/me`, {
      cache: "no-store",
      headers: {
        "Authorization": `Bearer ${session.access_token}`
      }
    })
    
    if (res.ok) {
        problems = await res.json()
    } else {
        const errorText = await res.text()
        errorMsg = `Could not fetch your complaints. Status: ${res.status}. Body: ${errorText}`
    }
  } catch (err) {
      errorMsg = "Backend server error."
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <h1 className="text-2xl font-bold text-dark-pop">My Dashboard</h1>
        <p className="text-sm text-dark-muted">Logged in as: {session.user.email}</p>
      </div>

      {errorMsg ? (
         <div className="p-4 bg-red-900/40 text-red-200 border border-red-500/50 rounded-md">
           {errorMsg}
         </div>
      ) : problems.length === 0 ? (
        <div className="py-20 text-center text-dark-muted">
           <p>You haven&apos;t posted any complaints yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      )}
    </div>
  )
}
