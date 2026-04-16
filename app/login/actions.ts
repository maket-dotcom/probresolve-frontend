"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message))
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get("origin") || "http://localhost:3000"

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message))
  }

  redirect("/signup?message=Check your email to verify your account")
}


export async function resendConfirmation(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get("origin") || "http://localhost:3000"

  const email = formData.get("email") as string

  if (!email) {
    redirect("/signup?error=Please enter your email to resend the link")
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message))
  }

  redirect("/signup?message=A new verification link has been sent to your email")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
