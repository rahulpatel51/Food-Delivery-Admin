"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Bell,
  Send,
  Users,
  Store,
  Truck,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  _id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  recipient_type: "all" | "customers" | "restaurants" | "delivery_partners"
  recipients_count: number
  sent_count: number
  delivery_method: "push" | "email" | "sms" | "in_app"
  status: "draft" | "scheduled" | "sent" | "failed"
  scheduled_at?: string
  sent_at?: string
  created_at: string
  created_by: {
    name: string
    email: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
    recipient_type: "all" as const,
    delivery_method: "push" as const,
    scheduled_at: "",
  })

  useEffect(() => {
    fetchNotifications()
  }, [filterType, filterStatus])

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams({
        ...(filterType && { type: filterType }),
        ...(filterStatus && { status: filterStatus }),
      })

      const response = await fetch(`http://localhost:5000/api/admin/notifications?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Mock data for demo
      setNotifications([
        {
          _id: "1",
          title: "New Restaurant Approval Required",
          message:
            "Pizza Palace has submitted their application for review. Please check the restaurant management section.",
          type: "info",
          recipient_type: "all",
          recipients_count: 5,
          sent_count: 5,
          delivery_method: "in_app",
          status: "sent",
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          created_by: {
            name: "System",
            email: "system@feasto.com",
          },
        },
        {
          _id: "2",
          title: "Weekly Performance Report",
          message: "Your weekly performance report is ready. Check out the analytics dashboard for detailed insights.",
          type: "success",
          recipient_type: "restaurants",
          recipients_count: 85,
          sent_count: 82,
          delivery_method: "email",
          status: "sent",
          sent_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
          created_by: {
            name: "Admin User",
            email: "admin@feasto.com",
          },
        },
        {
          _id: "3",
          title: "System Maintenance Alert",
          message:
            "Scheduled maintenance will occur tonight from 2 AM to 4 AM. Services may be temporarily unavailable.",
          type: "warning",
          recipient_type: "all",
          recipients_count: 1500,
          sent_count: 0,
          delivery_method: "push",
          status: "scheduled",
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
          created_at: new Date().toISOString(),
          created_by: {
            name: "Admin User",
            email: "admin@feasto.com",
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNotification = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/notifications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNotification),
      })

      if (response.ok) {
        fetchNotifications()
        setShowCreateDialog(false)
        setNewNotification({
          title: "",
          message: "",
          type: "info",
          recipient_type: "all",
          delivery_method: "push",
          scheduled_at: "",
        })
      }
    } catch (error) {
      console.error("Error creating notification:", error)
    }
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      info: { variant: "outline" as const, icon: Info, color: "text-blue-400" },
      success: { variant: "default" as const, icon: CheckCircle, color: "text-green-400" },
      warning: { variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-400" },
      error: { variant: "destructive" as const, icon: AlertCircle, color: "text-red-400" },
    }

    const config = variants[type as keyof typeof variants] || variants.info
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {type}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      scheduled: "outline",
      sent: "default",
      failed: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const getRecipientIcon = (type: string) => {
    const icons = {
      all: Users,
      customers: Users,
      restaurants: Store,
      delivery_partners: Truck,
    }

    const Icon = icons[type as keyof typeof icons] || Users
    return <Icon className="h-4 w-4" />
  }

  const getDeliveryIcon = (method: string) => {
    const icons = {
      push: Bell,
      email: Mail,
      sms: Smartphone,
      in_app: MessageSquare,
    }

    const Icon = icons[method as keyof typeof icons] || Bell
    return <Icon className="h-4 w-4" />
  }

  const stats = [
    {
      title: "Total Notifications",
      value: "1,247",
      change: "+12%",
      icon: Bell,
      color: "text-blue-400",
    },
    {
      title: "Sent Today",
      value: "89",
      change: "+23%",
      icon: Send,
      color: "text-green-400",
    },
    {
      title: "Delivery Rate",
      value: "96.8%",
      change: "+2.1%",
      icon: CheckCircle,
      color: "text-purple-400",
    },
    {
      title: "Active Recipients",
      value: "2,847",
      change: "+8%",
      icon: Users,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-slate-400 mt-2">
            Manage and send notifications to users, restaurants, and delivery partners
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="glass-effect border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-opacity-20 ${stat.color.replace("text-", "bg-")}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center text-sm text-green-400 mt-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                {stat.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications Management */}
      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">All Notifications</CardTitle>
              <CardDescription className="text-slate-400">Manage sent and scheduled notifications</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No notifications found</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-purple-500/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">{getTypeBadge(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{notification.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          {getRecipientIcon(notification.recipient_type)}
                          <span>{notification.recipient_type.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getDeliveryIcon(notification.delivery_method)}
                          <span>{notification.delivery_method}</span>
                        </div>
                        <span>
                          {notification.sent_count}/{notification.recipients_count} delivered
                        </span>
                        <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(notification.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-600">
                        <DropdownMenuLabel className="text-slate-300">Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="text-slate-300 hover:bg-slate-700"
                          onClick={() => {
                            setSelectedNotification(notification)
                            setShowDetailsDialog(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {notification.status === "draft" && (
                          <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                            <Send className="mr-2 h-4 w-4" />
                            Send Now
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Notification Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Notification</DialogTitle>
            <DialogDescription className="text-slate-400">
              Send notifications to users, restaurants, or delivery partners
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Notification title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-300">
                  Type
                </Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value: any) => setNewNotification({ ...newNotification, type: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-300">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Notification message"
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipients" className="text-slate-300">
                  Recipients
                </Label>
                <Select
                  value={newNotification.recipient_type}
                  onValueChange={(value: any) => setNewNotification({ ...newNotification, recipient_type: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                    <SelectItem value="delivery_partners">Delivery Partners</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery" className="text-slate-300">
                  Delivery Method
                </Label>
                <Select
                  value={newNotification.delivery_method}
                  onValueChange={(value: any) => setNewNotification({ ...newNotification, delivery_method: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="in_app">In-App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled" className="text-slate-300">
                Schedule (Optional)
              </Label>
              <Input
                id="scheduled"
                type="datetime-local"
                value={newNotification.scheduled_at}
                onChange={(e) => setNewNotification({ ...newNotification, scheduled_at: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              onClick={handleCreateNotification}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="w-4 h-4 mr-2" />
              {newNotification.scheduled_at ? "Schedule" : "Send Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Notification Details</DialogTitle>
            <DialogDescription className="text-slate-400">Complete notification information</DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Title:</span>
                      <span className="text-white">{selectedNotification.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      {getTypeBadge(selectedNotification.type)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      {getStatusBadge(selectedNotification.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Message</h4>
                  <p className="text-slate-300 bg-slate-800/30 p-3 rounded-lg">{selectedNotification.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Recipients:</span>
                        <span className="text-white">{selectedNotification.recipient_type.replace("_", " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Method:</span>
                        <span className="text-white">{selectedNotification.delivery_method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Recipients:</span>
                        <span className="text-white">{selectedNotification.recipients_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Successfully Sent:</span>
                        <span className="text-green-400">{selectedNotification.sent_count}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-2">Timestamps</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Created:</span>
                        <span className="text-white">{new Date(selectedNotification.created_at).toLocaleString()}</span>
                      </div>
                      {selectedNotification.scheduled_at && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Scheduled:</span>
                          <span className="text-white">
                            {new Date(selectedNotification.scheduled_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedNotification.sent_at && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sent:</span>
                          <span className="text-white">{new Date(selectedNotification.sent_at).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Created By</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-white">{selectedNotification.created_by.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedNotification.created_by.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="border-slate-600">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
