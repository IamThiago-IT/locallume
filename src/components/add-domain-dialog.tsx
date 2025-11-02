"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDomains } from "@/hooks/use-domains"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"

export function AddDomainDialog() {
  const { addDomain, error: domainsError } = useDomains()
  const [open, setOpen] = useState(false)
  const [domain, setDomain] = useState("")
  const [target, setTarget] = useState("")
  const [ssl, setSsl] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAdd = async () => {
    if (!domain.trim() || !target.trim()) {
      setLocalError("Domain and target are required")
      return
    }

    if (!domain.includes(".")) {
      setLocalError("Domain must include a TLD (e.g., .local)")
      return
    }

    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      setLocalError("Target must be a valid URL (http:// or https://)")
      return
    }

    setIsAdding(true)
    setLocalError(null)
    setSuccess(false)

    try {
      const success = await addDomain(domain.trim(), target.trim(), ssl)
      if (success) {
        setSuccess(true)
        setTimeout(() => {
          setDomain("")
          setTarget("")
          setSsl(false)
          setOpen(false)
          setSuccess(false)
        }, 1500)
      } else {
        setLocalError("Failed to add domain. Please try again.")
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsAdding(false)
    }
  }

  const handleTargetChange = (value: string) => {
    setTarget(value)
    setLocalError(null) // Clear error when user types
    // Auto-suggest domain based on target
    if (value.includes("localhost:") && !domain) {
      const port = value.split(":")[2] || value.split(":")[1]
      if (port) {
        setDomain(`app-${port}.local`)
      }
    }
  }

  const handleDomainChange = (value: string) => {
    setDomain(value)
    setLocalError(null) // Clear error when user types
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setLocalError(null)
      setSuccess(false)
    }
  }

  const displayError = localError || domainsError

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Domain</DialogTitle>
          <DialogDescription>Create a custom domain mapping for your local development server</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {displayError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Domain added successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="myapp.local"
              value={domain}
              onChange={(e) => handleDomainChange(e.target.value)}
              disabled={isAdding}
            />
            <p className="text-xs text-muted-foreground">Use .local extension for local development</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target URL</Label>
            <Input
              id="target"
              placeholder="http://localhost:3000"
              value={target}
              onChange={(e) => handleTargetChange(e.target.value)}
              disabled={isAdding}
            />
            <p className="text-xs text-muted-foreground">The local server URL to proxy to</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ssl" checked={ssl} onCheckedChange={setSsl} disabled={isAdding} />
            <Label htmlFor="ssl">Enable SSL (HTTPS)</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isAdding}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!domain.trim() || !target.trim() || isAdding}>
            {isAdding ? "Adding..." : "Add Domain"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
