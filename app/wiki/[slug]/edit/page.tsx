import { getWikiPage } from "@/lib/wiki"
import PageEditor from "@/components/wiki/page-editor"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

interface EditPageProps {
  params: {
    slug: string
  }
}

export default async function EditPage({ params }: EditPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const page = await getWikiPage(params.slug)

  if (!page) {
    notFound()
  }

  // Check if user can edit this page
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  const canEdit = page.author_id === user.id || (profile && ["admin", "moderator"].includes(profile.role))

  if (!canEdit) {
    redirect(`/wiki/${params.slug}`)
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
        <PageEditor page={page} isEditing={true} />
      </main>
    </div>
  )
}
