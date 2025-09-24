"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  MoreHorizontal,
  Eye,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Banknote,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Payout {
  _id: string
  restaurant_id: {
    name: string
    email: string
    logo_url?: string
  }
  amount: number
  commission: number
  net_amount: number
  period_start: string
  period_end: string
  status: string
  payment_method: string
  transaction_id?: string
  processed_at?: string
  created_at: string
}

const payoutTrendData = [
  { week: "Week 1", amount: 125000, count: 45 },
  { week: "Week 2", amount: 142000, count: 52 },
  { week: "Week 3", amount: 138000, count: 48 },
  { week: "Week 4", amount: 165000, count: 61 },
]

const statusDistribution = [
  { status: "Completed", count: 234, amount: 1250000 },
  { status: "Pending", count: 45, amount: 280000 },
  { status: "Processing", count: 12, amount: 75000 },
  { status: "Failed", count: 3, amount: 18000 },
]

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [showPayoutDialog, setShowPayoutDialog] = useState(false)

  useEffect(() => {
    fetchPayouts()
  }, [statusFilter])

  const fetchPayouts = async () => {
    try {
      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter }),
      })

      const response = await fetch(`http://localhost:5000/api/admin/payouts?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPayouts(data.data.payouts)
      }
    } catch (error) {
      console.error("Error fetching payouts:", error)
      // Mock data for demo
      setPayouts([
        {
          _id: "1",
          restaurant_id: {
            name: "Pizza Palace",
            email: "contact@pizzapalace.com",
            logo_url: "/placeholder.svg?height=40&width=40",
          },
          amount: 15000,
          commission: 2250,
          net_amount: 12750,
          period_start: "2024-01-01",
          period_end: "2024-01-07",
          status: "completed",
          payment_method: "bank_transfer",
          transaction_id: "TXN789123456",
          processed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          _id: "2",
          restaurant_id: {
            name: "Spice Garden",
            email: "info@spicegarden.com",
            logo_url: "/placeholder.svg?height=40&width=40",
          },
          amount: 22000,
          commission: 3300,
          net_amount: 18700,
          period_start: "2024-01-01",
          period_end: "2024-01-07",
          status: "pending",
          payment_method: "upi",
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, icon: CheckCircle, color: "text-green-400" },
      pending: { variant: "secondary" as const, icon: Clock, color: "text-yellow-400" },
      processing: { variant: "outline" as const, icon: Send, color: "text-blue-400" },
      failed: { variant: "destructive" as const, icon: XCircle, color: "text-red-400" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const stats = [
    {
      title: "Total Payouts",
      value: "₹12.5L",
      change: "+15.2%",
      icon: Banknote,
      color: "text-green-400",
    },
    {
      title: "Pending Payouts",
      value: "₹2.8L",
      change: "+8.1%",
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      title: "This Month",
      value: "₹4.2L",
      change: "+22.5%",
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      title: "Success Rate",
      value: "98.7%",
      change: "+1.2%",
      icon: CheckCircle,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Banknote className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Payouts Management</h1>
              <p className="text-green-200 mt-1">Track and manage restaurant payouts and commissions</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-green-200">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Next Payout: Tomorrow
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Processing Time: 2-3 days
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="glass-effect border-slate-700/50 hover:border-green-500/30 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-opacity-20 ${stat.color.replace("text-", "bg-")}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div
                className={`flex items-center text-sm mt-1 ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Payout Trends</CardTitle>
            <CardDescription className="text-slate-400">Weekly payout amounts and transaction counts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={payoutTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Status Distribution</CardTitle>
            <CardDescription className="text-slate-400">Payout status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="status" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Restaurant Payouts</CardTitle>
          <CardDescription className="text-slate-400">Manage and track all restaurant payouts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Send className="w-4 h-4 mr-2" />
              Process Payouts
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/30">
                  <TableHead className="text-slate-300">Restaurant</TableHead>
                  <TableHead className="text-slate-300">Period</TableHead>
                  <TableHead className="text-slate-300">Gross Amount</TableHead>
                  <TableHead className="text-slate-300">Commission</TableHead>
                  <TableHead className="text-slate-300">Net Amount</TableHead>
                  <TableHead className="text-slate-300">Method</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-right text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : payouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                      No payouts found
                    </TableCell>
                  </TableRow>
                ) : (
                  payouts.map((payout) => (
                    <TableRow key={payout._id} className="border-slate-700 hover:bg-slate-800/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700">
                            <img
                              src={payout.restaurant_id.logo_url || "/placeholder.svg?height=40&width=40"}
                              alt={payout.restaurant_id.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">{payout.restaurant_id.name}</div>
                            <div className="text-sm text-slate-400">{payout.restaurant_id.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-300">
                          <div>{new Date(payout.period_start).toLocaleDateString()}</div>
                          <div className="text-slate-400">to {new Date(payout.period_end).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">₹{payout.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-red-400">₹{payout.commission.toLocaleString()}</TableCell>
                      <TableCell className="text-green-400 font-medium">
                        ₹{payout.net_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {payout.payment_method.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(payout.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
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
                                setSelectedPayout(payout)
                                setShowPayoutDialog(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                              <Download className="mr-2 h-4 w-4" />
                              Download Statement
                            </DropdownMenuItem>
                            {payout.status === "pending" && (
                              <>
                                <DropdownMenuSeparator className="bg-slate-600" />
                                <DropdownMenuItem className="text-green-400 hover:bg-green-500/20">
                                  <Send className="mr-2 h-4 w-4" />
                                  Process Payout
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payout Details Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Payout Details</DialogTitle>
            <DialogDescription className="text-slate-400">Complete payout information and breakdown</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Restaurant Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name:</span>
                        <span className="text-white">{selectedPayout.restaurant_id.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white">{selectedPayout.restaurant_id.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Payout Period</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Start Date:</span>
                        <span className="text-white">{new Date(selectedPayout.period_start).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">End Date:</span>
                        <span className="text-white">{new Date(selectedPayout.period_end).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-4">Amount Breakdown</h4>
                <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gross Amount:</span>
                    <span className="text-white font-medium">₹{selectedPayout.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform Commission:</span>
                    <span className="text-red-400">-₹{selectedPayout.commission.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">Net Payout:</span>
                      <span className="text-green-400 font-bold text-lg">
                        ₹{selectedPayout.net_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Method:</span>
                      <span className="text-white">{selectedPayout.payment_method.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      {getStatusBadge(selectedPayout.status)}
                    </div>
                    {selectedPayout.transaction_id && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction ID:</span>
                        <span className="text-white font-mono text-xs">{selectedPayout.transaction_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Timestamps</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Created:</span>
                      <span className="text-white">{new Date(selectedPayout.created_at).toLocaleString()}</span>
                    </div>
                    {selectedPayout.processed_at && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Processed:</span>
                        <span className="text-white">{new Date(selectedPayout.processed_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayoutDialog(false)} className="border-slate-600">
              Close
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Download className="w-4 h-4 mr-2" />
              Download Statement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
