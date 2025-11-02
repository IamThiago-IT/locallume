"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useService } from "@/hooks/use-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Play,
  Square,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

export function ServiceManagement() {
  const {
    status,
    logs,
    serviceDirectory,
    loading,
    error,
    installService,
    uninstallService,
    startService,
    stopService,
    refresh,
  } = useService()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleAction = async (action: string, actionFn: () => Promise<any>) => {
    setActionLoading(action)
    try {
      const result = await actionFn()
      if (result.scriptPath) {
        // Show instructions for running the script
        alert(
          `Script created at: ${result.scriptPath}\n\nPlease run this script as Administrator to ${action} the service.`,
        )
      }
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusIcon = () => {
    if (!status.installed) return <XCircle className="w-4 h-4 text-muted-foreground" />
    if (status.running) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status.status === "Pending") return <Clock className="w-4 h-4 text-yellow-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  const getStatusBadge = () => {
    if (!status.installed) return <Badge variant="secondary">Not Installed</Badge>
    if (status.running)
      return (
        <Badge variant="default" className="bg-green-500">
          Running
        </Badge>
      )
    if (status.status === "Pending") return <Badge variant="secondary">Pending</Badge>
    return <Badge variant="destructive">Stopped</Badge>
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Settings className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Windows Service Management
          </DialogTitle>
          <DialogDescription>
            Install LocalCan as a Windows service to run automatically in the background
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                {getStatusIcon()}
                Service Status
              </CardTitle>
              <CardDescription>Current status of the LocalCan Proxy Service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{status.displayName}</span>
                  {getStatusBadge()}
                </div>
                <p className="text-xs text-muted-foreground">{status.description}</p>

                {error && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={refresh} disabled={loading} variant="outline">
                    <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>

                  {!status.installed ? (
                    <Button
                      size="sm"
                      onClick={() => handleAction("install", installService)}
                      disabled={actionLoading === "install"}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {actionLoading === "install" ? "Installing..." : "Install Service"}
                    </Button>
                  ) : (
                    <>
                      {status.running ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction("stop", stopService)}
                          disabled={actionLoading === "stop"}
                        >
                          <Square className="w-4 h-4 mr-1" />
                          {actionLoading === "stop" ? "Stopping..." : "Stop Service"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAction("start", startService)}
                          disabled={actionLoading === "start"}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {actionLoading === "start" ? "Starting..." : "Start Service"}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction("uninstall", uninstallService)}
                        disabled={actionLoading === "uninstall"}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {actionLoading === "uninstall" ? "Uninstalling..." : "Uninstall"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Service Information</CardTitle>
              <CardDescription>Details about the Windows service installation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Name:</span>
                  <span className="font-mono">LocalCanProxy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Directory:</span>
                  <span className="font-mono text-xs">{serviceDirectory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Startup Type:</span>
                  <span>Automatic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Port:</span>
                  <span>80 (HTTP)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Logs */}
          {logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Logs</CardTitle>
                <CardDescription>Latest service events from Windows Event Log</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono bg-muted p-2 rounded">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Installation Instructions */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Administrator privileges required:</strong> Installing and managing Windows services requires
              administrator privileges. The system will create batch scripts that you need to run as administrator.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}
