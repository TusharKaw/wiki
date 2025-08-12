import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PageEditor from "@/components/wiki/page-editor"

export default async function NewPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">
            <a href="/" className="hover:text-primary transition-colors">
              Wiki Clone
            </a>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PageEditor />
      </main>
    </div>
  )
}
