"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DomainsList } from "@/components/domains-list"
import { ThemeProvider } from "@/components/theme-provider"

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex h-screen bg-background">
        <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <main className="flex-1 overflow-auto">
          <DomainsList category={selectedCategory} />
        </main>
      </div>
    </ThemeProvider>
  )
}
