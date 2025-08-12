"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdvancedSearch() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    query: "",
    author: "",
    dateFrom: "",
    dateTo: "",
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (formData.query.trim()) params.set("q", formData.query.trim())
    if (formData.author.trim()) params.set("author", formData.author.trim())
    if (formData.dateFrom) params.set("from", formData.dateFrom)
    if (formData.dateTo) params.set("to", formData.dateTo)

    router.push(`/search?${params.toString()}`)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Search Wiki</CardTitle>
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            Advanced
            {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for pages..."
              value={formData.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {isExpanded && (
            <div className="grid gap-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="author" className="text-sm font-medium">
                    Author
                  </label>
                  <Input
                    id="author"
                    type="text"
                    placeholder="Filter by author name"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="From"
                      value={formData.dateFrom}
                      onChange={(e) => handleInputChange("dateFrom", e.target.value)}
                    />
                    <Input
                      type="date"
                      placeholder="To"
                      value={formData.dateTo}
                      onChange={(e) => handleInputChange("dateTo", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
