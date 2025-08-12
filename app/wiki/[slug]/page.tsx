import { getWikiPage } from "@/lib/wiki"
import PageViewer from "@/components/wiki/page-viewer"
import { notFound } from "next/navigation"

interface WikiPageProps {
  params: {
    slug: string
  }
}

export default async function WikiPageView({ params }: WikiPageProps) {
  const page = await getWikiPage(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              <a href="/" className="hover:text-primary transition-colors">
                Wiki Clone
              </a>
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PageViewer page={page} />
      </main>
    </div>
  )
}
