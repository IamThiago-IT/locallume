"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCertificates } from "@/hooks/use-certificates"
import { Shield, Plus, Trash2, Download, AlertTriangle } from "lucide-react"

export function CertificateDialog() {
  const { certificates, caCertificate, loading, generateCertificate, deleteCertificate, installCACertificate } =
    useCertificates()
  const [newDomain, setNewDomain] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!newDomain.trim()) return

    setIsGenerating(true)
    const success = await generateCertificate(newDomain.trim())
    if (success) {
      setNewDomain("")
    }
    setIsGenerating(false)
  }

  const handleDelete = async (domain: string) => {
    await deleteCertificate(domain)
  }

  const handleInstallCA = async () => {
    await installCACertificate()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            SSL Certificate Management
          </DialogTitle>
          <DialogDescription>Manage SSL certificates for your local domains</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* CA Certificate Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Root Certificate Authority</CardTitle>
              <CardDescription>Install the root CA to trust all generated certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">RootCA.pem</span>
                  <Badge variant={caCertificate === "Available" ? "secondary" : "destructive"}>
                    {caCertificate === "Available" ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleInstallCA}>
                    <Download className="w-4 h-4 mr-1" />
                    Install
                  </Button>
                </div>
              </div>
              {caCertificate === "Available" && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">To trust certificates in your browser:</p>
                      <p>1. Install the CA certificate in Windows Certificate Store</p>
                      <p>2. Place it in "Trusted Root Certification Authorities"</p>
                      <p>3. Restart your browser</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate New Certificate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Generate New Certificate</CardTitle>
              <CardDescription>Create SSL certificates for your local domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="domain" className="sr-only">
                    Domain
                  </Label>
                  <Input
                    id="domain"
                    placeholder="example.local"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                </div>
                <Button onClick={handleGenerate} disabled={!newDomain.trim() || isGenerating}>
                  <Plus className="w-4 h-4 mr-1" />
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Existing Certificates</CardTitle>
              <CardDescription>Manage your generated SSL certificates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading certificates...</div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No certificates generated yet</div>
              ) : (
                <div className="space-y-2">
                  {certificates.map((cert) => (
                    <div key={cert.domain} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="font-medium text-sm">{cert.domain}</div>
                          <div className="text-xs text-muted-foreground">
                            Expires: {new Date(cert.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant={cert.isValid ? "secondary" : "destructive"}>
                          {cert.isValid ? "Valid" : "Expired"}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(cert.domain)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
