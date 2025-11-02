"use client"

import { useProcesses } from "@/hooks/use-processes"
import { useCertificates } from "@/hooks/use-certificates"
import { useDomains } from "@/hooks/use-domains"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CertificateDialog } from "@/components/certificate-dialog"
import { AddDomainDialog } from "@/components/add-domain-dialog"
import { Database, ExternalLink, MoreHorizontal, RefreshCw, AlertCircle, Shield, Trash2, Edit } from "lucide-react"

interface DomainsListProps {
  category: string
}

export function DomainsList({ category }: DomainsListProps) {
  const { processes, loading: processesLoading, error: processesError, refresh: refreshProcesses } = useProcesses()
  const { certificates, generateCertificate } = useCertificates()
  const { domains: customDomains, toggleDomain, deleteDomain, hasHostsPermissions } = useDomains()

  // Combine auto-detected and custom domains
  const detectedDomains = processes.map((process) => {
    const domain = `${process.name.toLowerCase()}.local`
    const hasCertificate = certificates.some((cert) => cert.domain === domain && cert.isValid)

    return {
      id: process.name.toLowerCase(),
      name: process.framework,
      icon: Database,
      type: "auto-detected" as const,
      domains: [
        {
          protocol: hasCertificate ? ("https" as const) : ("http" as const),
          domain,
          externalUrl: null,
          localUrl: `http://localhost:${process.port}`,
          published: false,
          certificate: hasCertificate,
          pid: process.pid,
          status: process.status,
        },
      ],
    }
  })

  const customDomainEntries = customDomains.map((customDomain) => ({
    id: customDomain.id,
    name: customDomain.domain,
    icon: Database,
    type: "custom" as const,
    domains: [
      {
        protocol: customDomain.ssl ? ("https" as const) : ("http" as const),
        domain: customDomain.domain,
        externalUrl: null,
        localUrl: customDomain.target,
        published: customDomain.enabled,
        certificate: customDomain.ssl,
        customDomainId: customDomain.id,
      },
    ],
  }))

  const allDomains = [...detectedDomains, ...customDomainEntries]
  const filteredDomains = category === "all" ? allDomains : allDomains.filter((domain) => domain.id === category)

  const handleGenerateCertificate = async (domain: string) => {
    await generateCertificate(domain)
  }

  const handleToggleCustomDomain = async (domainId: string) => {
    await toggleDomain(domainId)
  }

  const handleDeleteCustomDomain = async (domainId: string) => {
    await deleteDomain(domainId)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Domains</h1>
        <div className="flex items-center gap-2">
          {processesError && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Detection failed</span>
            </div>
          )}
          {!hasHostsPermissions && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Admin required for hosts file</span>
            </div>
          )}
          <AddDomainDialog />
          <Button
            variant="outline"
            size="sm"
            onClick={refreshProcesses}
            disabled={processesLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${processesLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {processesLoading && processes.length === 0 && customDomains.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading domains...</span>
          </div>
        </div>
      ) : filteredDomains.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No domains found</h3>
            <p className="text-muted-foreground mb-4">
              Start a development server or add a custom domain to get started.
            </p>
            <div className="flex gap-2 justify-center">
              <AddDomainDialog />
              <Button onClick={refreshProcesses} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan Again
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDomains.map((project) => {
            const Icon = project.icon
            return (
              <Card key={project.id} className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <h2 className="text-lg font-medium">{project.name}</h2>
                      <Badge variant={project.type === "auto-detected" ? "secondary" : "outline"} className="text-xs">
                        {project.type === "auto-detected" ? "Auto-detected" : "Custom"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <CertificateDialog />
                      {project.type === "custom" && (
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {project.domains.map((domain, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{domain.protocol}</span>
                            <span className="font-medium">{domain.domain}</span>
                            {domain.certificate && <Shield className="w-4 h-4 text-green-500" />}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ExternalLink className="w-3 h-3" />
                            <span>{domain.localUrl}</span>
                          </div>

                          {domain.pid && (
                            <Badge variant="outline" className="text-xs">
                              PID: {domain.pid}
                            </Badge>
                          )}

                          {domain.status && (
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  domain.status === "running" ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                              <span className="text-xs text-muted-foreground capitalize">{domain.status}</span>
                            </div>
                          )}

                          {!domain.certificate && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateCertificate(domain.domain)}
                              className="text-xs"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Add SSL
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {domain.published ? "Published" : "Not published"}
                            </span>
                            <Switch
                              checked={domain.published}
                              onCheckedChange={
                                domain.customDomainId
                                  ? () => handleToggleCustomDomain(domain.customDomainId!)
                                  : undefined
                              }
                              disabled={!domain.customDomainId}
                            />
                          </div>
                          {project.type === "custom" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCustomDomain(project.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
