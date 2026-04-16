import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  
  // The user clicked a magic link or verification link
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful verification
      return NextResponse.redirect(`${origin}/dashboard`)
    }
    
    console.error("Supabase exchangeCodeForSession error:", error);
    return NextResponse.redirect(`${origin}/login?error=` + encodeURIComponent(`Verification failed: ${error.message}`))
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid verification link (no code found)`)
}
