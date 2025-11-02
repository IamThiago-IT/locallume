"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Database, Globe, Eye, Settings, Download, ExternalLink } from "lucide-react"
import { useProcesses } from "@/hooks/use-processes"
import { useProxy } from "@/hooks/use-proxy"
import { useDomains } from "@/hooks/use-domains"
import { useCertificates } from "@/hooks/use-certificates"
import { AddDomainDialog } from "@/components/add-domain-dialog"
import { ServiceManagement } from "@/components/service-management"
import { useState } from "react"

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const { processes } = useProcesses()
  const { domains: customDomains } = useDomains()
  const { status: proxyStatus, startProxy, stopProxy } = useProxy()
  const { certificates } = useCertificates()
  const [inspectTraffic, setInspectTraffic] = useState(false)

  const frameworkCounts = processes.reduce(
    (acc, process) => {
      const key = process.framework.toLowerCase().replace(/[^a-z0-9]/g, "")
      acc[key] = (acc[key] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalDomains = processes.length + customDomains.length
  const activeDomains =
    processes.filter((p) => p.status === "running").length + customDomains.filter((d) => d.enabled).length

  const categories = [
    { id: "all", label: "All", icon: Globe, count: totalDomains },
    { id: "active", label: "Active", icon: Database, count: activeDomains },
    ...Object.entries(frameworkCounts).map(([key, count]) => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: Database,
      count,
    })),
  ]

  const tools = [
    {
      id: "inspect",
      label: "Inspect traffic",
      icon: Eye,
      active: inspectTraffic,
      onClick: () => setInspectTraffic(!inspectTraffic),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => console.log("Opening settings..."),
    },
    {
      id: "logs",
      label: "View logs",
      icon: ExternalLink,
      onClick: () => console.log("Opening logs..."),
    },
  ]

  const handleProxyToggle = async (type: "http" | "https", enabled: boolean) => {
    if (type === "http") {
      if (enabled && !proxyStatus.isRunning) {
        await startProxy(80)
      } else if (!enabled && proxyStatus.isRunning) {
        await stopProxy()
      }
    }
  }

  const certificateStatus = certificates.length > 0 ? "installed" : "not-installed"
  const hasRootCA = certificates.some((cert) => cert.domain === "LocalCan Root CA")

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border p-4 flex flex-col">
      {/* Domains Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-sidebar-foreground">Domains</h2>
          <Badge variant={activeDomains > 0 ? "default" : "secondary"} className="text-xs">
            {activeDomains} active
          </Badge>
        </div>
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-between h-8 px-2",
                  selectedCategory === category.id && "bg-sidebar-accent",
                )}
                onClick={() => onCategoryChange(category.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${category.count > 0 ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="text-sm">{category.label}</span>
                </div>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {category.count}
                </Badge>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-sidebar-foreground mb-3">Tools</h2>
        <div className="space-y-1">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Button
                key={tool.id}
                variant={tool.active ? "secondary" : "ghost"}
                className={cn("w-full justify-start h-8 px-2", tool.active && "bg-sidebar-accent")}
                onClick={tool.onClick}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm">{tool.label}</span>
                {tool.id === "inspect" && tool.active && (
                  <Badge variant="default" className="ml-auto text-xs">
                    ON
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Reverse Proxy Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-sidebar-foreground">Reverse proxy</h2>
          <Badge variant={proxyStatus.isRunning ? "default" : "secondary"} className="text-xs">
            {proxyStatus.isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-sidebar-foreground">http</span>
              {proxyStatus.isRunning && (
                <Badge variant="outline" className="text-xs px-1">
                  :{proxyStatus.port}
                </Badge>
              )}
            </div>
            <Switch checked={proxyStatus.isRunning} onCheckedChange={(checked) => handleProxyToggle("http", checked)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-sidebar-foreground">https</span>
              <Badge variant="outline" className="text-xs px-1">
                :443
              </Badge>
            </div>
            <Switch defaultChecked={false} disabled />
          </div>
        </div>
      </div>

      {/* Root Certificate Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-sidebar-foreground">Root certificate</h2>
          <Badge variant={hasRootCA ? "default" : "destructive"} className="text-xs">
            {hasRootCA ? "Installed" : "Missing"}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sidebar-foreground">RootCA.pem</span>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Download className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-sidebar-foreground">Service</span>
            <ServiceManagement />
          </div>
        </div>
      </div>

      {/* Add Domain Button */}
      <div className="mt-auto">
        <AddDomainDialog />
      </div>
    </div>
  )
}
