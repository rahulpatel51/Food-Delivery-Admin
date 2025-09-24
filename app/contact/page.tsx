"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  MessageSquare,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Reply,
  Archive,
  User,
  Filter,
  Send,
  Eye,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContactSubmission {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: "general" | "support" | "complaint" | "suggestion" | "partnership" | "technical"
  priority: "low" | "medium" | "high" | "urgent"
  status: "new" | "in_progress" | "resolved" | "closed"
  assigned_to?: string
  user_type: "customer" | "restaurant" | "delivery_partner" | "guest"
  created_at: string
  updated_at: string
  response?: string
  response_time?: number
}

export default function ContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")

  useEffect(() => {
    fetchSubmissions()
  }, [statusFilter, categoryFilter, priorityFilter])

  const fetchSubmissions = async () => {
    try {
      // Mock data for demo
      setSubmissions([
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+91 9876543210",
          subject: "Issue with my recent order",
          message:
            "I ordered food from Pizza Palace yesterday (Order #12345) but received the wrong items. I ordered a Margherita pizza but received a Pepperoni pizza instead. Can you please help me resolve this issue?",
          category: "complaint",
          priority: "high",
          status: "new",
          user_type: "customer",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Restaurant Owner",
          email: "owner@pizzapalace.com",
          phone: "+91 9876543211",
          subject: "Need help with menu updates",
          message:
            "I'm trying to update my restaurant menu but facing some technical issues. The changes are not reflecting on the app. I've been trying for the past 2 days. Please assist as soon as possible.",
          category: "technical",
          priority: "medium",
          status: "in_progress",
          assigned_to: "Tech Support Team",
          user_type: "restaurant",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          _id: "3",
          name: "Mike Wilson",
          email: "mike@example.com",
          subject: "Partnership Inquiry",
          message:
            "I represent a chain of restaurants in Mumbai and we're interested in partnering with your platform. We have 5 locations across the city and would like to discuss the onboarding process and commission rates. Please contact me at your earliest convenience.",
          category: "partnership",
          priority: "medium",
          status: "new",
          user_type: "guest",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          _id: "4",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+91 9876543212",
          subject: "App suggestion",
          message:
            "I love using your app but I think it would be great if you could add a feature to save favorite orders for quick reordering. This would make the ordering process much faster for regular customers like me.",
          category: "suggestion",
          priority: "low",
          status: "resolved",
          assigned_to: "Product Team",
          user_type: "customer",
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          response:
            "Thank you for your suggestion! We've added this to our product roadmap and hope to implement it in the next few months.",
          response_time: 48,
        },
      ])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching contact submissions:", error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: AlertCircle },
      in_progress: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
      resolved: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
      closed: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border font-medium flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: "bg-green-500/20 text-green-400 border-green-500/30" },
      medium: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      high: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
      urgent: { color: "bg-red-500/20 text-red-400 border-red-500/30" },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig]

    return <Badge className={`${config.color} border font-medium`}>{priority}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      general: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      support: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      complaint: { color: "bg-red-500/20 text-red-400 border-red-500/30" },
      suggestion: { color: "bg-green-500/20 text-green-400 border-green-500/30" },
      partnership: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
      technical: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    }

    const config = categoryConfig[category as keyof typeof categoryConfig]

    return <Badge className={`${config.color} border font-medium`}>{category}</Badge>
  }

  const getUserTypeBadge = (userType: string) => {
    const userTypeConfig = {
      customer: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      restaurant: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
      delivery_partner: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
      guest: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    }

    const config = userTypeConfig[userType as keyof typeof userTypeConfig]

    return <Badge className={`${config.color} border font-medium`}>{userType.replace("_", " ")}</Badge>
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} days ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} months ago`
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === "all" || submission.status === statusFilter
    const matchesCategory = !categoryFilter || categoryFilter === "all" || submission.category === categoryFilter
    const matchesPriority = !priorityFilter || priorityFilter === "all" || submission.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-teal-900 to-emerald-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Contact & Support</h1>
              <p className="text-cyan-200 mt-1">Manage customer inquiries and support tickets</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-cyan-200">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Customer Communications
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Issue Resolution
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Inquiries</p>
                <p className="text-3xl font-bold text-white">1,247</p>
                <p className="text-sm text-green-400">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <MessageSquare className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">New Messages</p>
                <p className="text-3xl font-bold text-white">89</p>
                <p className="text-sm text-blue-400">Needs attention</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <AlertCircle className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Avg Response Time</p>
                <p className="text-3xl font-bold text-white">4.2h</p>
                <p className="text-sm text-green-400">-15% from last month</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Resolution Rate</p>
                <p className="text-3xl font-bold text-white">94%</p>
                <p className="text-sm text-green-400">+2% from last month</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-effect border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contact Submissions */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            All Messages
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            New
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-500 text-white">
              {submissions.filter((sub) => sub.status === "new").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            Resolved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading contact submissions...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSubmissions.map((submission) => (
                <Card
                  key={submission._id}
                  className="glass-effect border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{submission.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-400">
                            From: {submission.name} ({submission.email})
                          </p>
                          {getUserTypeBadge(submission.user_type)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(submission.status)}
                        {getPriorityBadge(submission.priority)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-300 line-clamp-3">{submission.message}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(submission.category)}
                        <span className="text-xs text-slate-400">{getTimeAgo(submission.created_at)}</span>
                      </div>
                      {submission.assigned_to && (
                        <div className="text-xs text-slate-400">Assigned to: {submission.assigned_to}</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 hover:border-cyan-500 hover:text-cyan-400"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowSubmissionDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {submission.status !== "resolved" && submission.status !== "closed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:border-green-500 hover:text-green-400"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setShowReplyDialog(true)
                          }}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-gray-500 hover:text-gray-400"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new">
          <div className="space-y-6">
            {submissions
              .filter((sub) => sub.status === "new")
              .map((submission) => (
                <Card
                  key={submission._id}
                  className="glass-effect border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{submission.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-400">
                            From: {submission.name} ({submission.email})
                          </p>
                          {getUserTypeBadge(submission.user_type)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(submission.status)}
                        {getPriorityBadge(submission.priority)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-300 line-clamp-3">{submission.message}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(submission.category)}
                        <span className="text-xs text-slate-400">{getTimeAgo(submission.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 hover:border-cyan-500 hover:text-cyan-400"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowSubmissionDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-green-500 hover:text-green-400"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowReplyDialog(true)
                        }}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-gray-500 hover:text-gray-400"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress">
          <div className="space-y-6">
            {submissions
              .filter((sub) => sub.status === "in_progress")
              .map((submission) => (
                <Card
                  key={submission._id}
                  className="glass-effect border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{submission.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-400">
                            From: {submission.name} ({submission.email})
                          </p>
                          {getUserTypeBadge(submission.user_type)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(submission.status)}
                        {getPriorityBadge(submission.priority)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-300 line-clamp-3">{submission.message}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(submission.category)}
                        <span className="text-xs text-slate-400">{getTimeAgo(submission.created_at)}</span>
                      </div>
                      {submission.assigned_to && (
                        <div className="text-xs text-slate-400">Assigned to: {submission.assigned_to}</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 hover:border-cyan-500 hover:text-cyan-400"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowSubmissionDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-green-500 hover:text-green-400"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowReplyDialog(true)
                        }}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-gray-500 hover:text-gray-400"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="resolved">
          <div className="space-y-6">
            {submissions
              .filter((sub) => sub.status === "resolved")
              .map((submission) => (
                <Card
                  key={submission._id}
                  className="glass-effect border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{submission.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-400">
                            From: {submission.name} ({submission.email})
                          </p>
                          {getUserTypeBadge(submission.user_type)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(submission.status)}
                        {getPriorityBadge(submission.priority)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-300 line-clamp-3">{submission.message}</p>
                    </div>

                    {submission.response && (
                      <div className="mb-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <p className="text-sm text-slate-400">Response:</p>
                        <p className="text-slate-300">{submission.response}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(submission.category)}
                        <span className="text-xs text-slate-400">{getTimeAgo(submission.created_at)}</span>
                      </div>
                      {submission.response_time && (
                        <div className="text-xs text-slate-400">Response time: {submission.response_time} hours</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 hover:border-cyan-500 hover:text-cyan-400"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowSubmissionDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-gray-500 hover:text-gray-400"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Submission Details Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-cyan-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <MessageSquare className="h-6 w-6 text-cyan-400" />
              </div>
              Contact Submission
            </DialogTitle>
            <DialogDescription className="text-slate-400">Complete details of the inquiry</DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-cyan-400" />
                      Sender Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Name</span>
                        <span className="text-white font-medium">{selectedSubmission.name}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Email</span>
                        <span className="text-white font-medium">{selectedSubmission.email}</span>
                      </div>
                      {selectedSubmission.phone && (
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Phone</span>
                          <span className="text-white font-medium">{selectedSubmission.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">User Type</span>
                        {getUserTypeBadge(selectedSubmission.user_type)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-cyan-400" />
                      Inquiry Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Status</span>
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Priority</span>
                        {getPriorityBadge(selectedSubmission.priority)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Category</span>
                        {getCategoryBadge(selectedSubmission.category)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Submitted</span>
                        <span className="text-white font-medium">
                          {new Date(selectedSubmission.created_at).toLocaleString()}
                        </span>
                      </div>
                      {selectedSubmission.assigned_to && (
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Assigned To</span>
                          <span className="text-white font-medium">{selectedSubmission.assigned_to}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-effect border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="text-white">Message</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <h4 className="font-medium text-white mb-3">{selectedSubmission.subject}</h4>
                    <p className="text-slate-300 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </CardContent>
              </Card>

              {selectedSubmission.response && (
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white">Response</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <p className="text-slate-300 whitespace-pre-wrap">{selectedSubmission.response}</p>
                      {selectedSubmission.response_time && (
                        <p className="text-sm text-slate-400 mt-4">
                          Response time: {selectedSubmission.response_time} hours
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" onClick={() => setShowSubmissionDialog(false)} className="border-slate-600">
              Close
            </Button>
            {selectedSubmission &&
              selectedSubmission.status !== "resolved" &&
              selectedSubmission.status !== "closed" && (
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                  onClick={() => {
                    setShowSubmissionDialog(false)
                    setShowReplyDialog(true)
                  }}
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 border-2">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Reply className="h-5 w-5 text-cyan-400" />
              Reply to Inquiry
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Send a response to {selectedSubmission?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-2">Original Message</h4>
                <p className="text-sm text-slate-400">{selectedSubmission.subject}</p>
                <p className="text-sm text-slate-300 line-clamp-3 mt-2">{selectedSubmission.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reply" className="text-slate-300">
                  Your Response
                </Label>
                <Textarea
                  id="reply"
                  placeholder="Type your response here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Update Status</Label>
                <Select defaultValue={selectedSubmission.status}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
              onClick={() => {
                // Handle reply logic here
                setShowReplyDialog(false)
                setReplyMessage("")
              }}
              disabled={!replyMessage.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
