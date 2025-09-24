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
  RefreshCw,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Payment {
  _id: string
  order_id: string
  user_id: {
    first_name: string
    last_name: string
    email: string
  }
  restaurant_id: {
    name: string
  }
  amount: number
  payment_method: string
  payment_status: string
  transaction_id: string
  gateway_response: any
  created_at: string
  updated_at: string
}

const paymentTrendData = [
  { date: "Jan 1", amount: 45000, transactions: 120 },
  { date: "Jan 2", amount: 52000, transactions: 140 },
  { date: "Jan 3", amount: 48000, transactions: 130 },
  { date: "Jan 4", amount: 61000, transactions: 165 },
  { date: "Jan 5", amount: 73000, transactions: 190 },
  { date: "Jan 6", amount: 89000, transactions: 220 },
  { date: "Jan 7", amount: 67000, transactions: 180 },
]

const paymentMethodData = [
  { name: "UPI", value: 45, color: "#10b981" },
  { name: "Credit Card", value: 25, color: "#3b82f6" },
  { name: "Debit Card", value: 20, color: "#f59e0b" },
  { name: "Net Banking", value: 7, color: "#8b5cf6" },
  { name: "Wallet", value: 3, color: "#ef4444" },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [methodFilter, setMethodFilter] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [statusFilter, methodFilter])

  const fetchPayments = async () => {
    try {
      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter }),
        ...(methodFilter && { method: methodFilter }),
      })

      const response = await fetch(`http://localhost:5000/api/admin/payments?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.data.payments)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      // Mock data for demo
      setPayments([
        {
          _id: "1",
          order_id: "ORD-001",
          user_id: {
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
          },
          restaurant_id: {
            name: "Pizza Palace",
          },
          amount: 450,
          payment_method: "upi",
          payment_status: "completed",
          transaction_id: "TXN123456789",
          gateway_response: {
            gateway: "Razorpay",
            gateway_transaction_id: "pay_123456789",
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          _id: "2",
          order_id: "ORD-002",
          user_id: {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane@example.com",
          },
          restaurant_id: {
            name: "Burger Hub",
          },
          amount: 320,
          payment_method: "credit_card",
          payment_status: "failed",
          transaction_id: "TXN123456790",
          gateway_response: {
            gateway: "Stripe",
            error_message: "Insufficient funds",
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, icon: CheckCircle, color: "text-green-400" },
      pending: { variant: "secondary" as const, icon: RefreshCw, color: "text-yellow-400" },
      failed: { variant: "destructive" as const, icon: XCircle, color: "text-red-400" },
      refunded: { variant: "outline" as const, icon: RefreshCw, color: "text-blue-400" },
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

  const getMethodBadge = (method: string) => {
    const colors = {
      upi: "bg-green-500/20 text-green-400",
      credit_card: "bg-blue-500/20 text-blue-400",
      debit_card: "bg-yellow-500/20 text-yellow-400",
      net_banking: "bg-purple-500/20 text-purple-400",
      wallet: "bg-red-500/20 text-red-400",
    }

    return (
      <Badge className={colors[method as keyof typeof colors] || "bg-gray-500/20 text-gray-400"}>
        {method.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "₹4,89,000",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      title: "Successful Payments",
      value: "2,847",
      change: "+8.2%",
      icon: CheckCircle,
      color: "text-blue-400",
    },
    {
      title: "Failed Payments",
      value: "143",
      change: "-5.1%",
      icon: XCircle,
      color: "text-red-400",
    },
    {
      title: "Success Rate",
      value: "95.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Payments
          </h1>
          <p className="text-slate-400 mt-2">Monitor and manage all payment transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
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
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Payment Trends</CardTitle>
            <CardDescription className="text-slate-400">Daily payment volume and transaction count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
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
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Payment Methods</CardTitle>
            <CardDescription className="text-slate-400">Distribution by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {paymentMethodData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-400">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Payments</CardTitle>
          <CardDescription className="text-slate-400">All payment transactions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search payments..."
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
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="net_banking">Net Banking</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/30">
                  <TableHead className="text-slate-300">Transaction ID</TableHead>
                  <TableHead className="text-slate-300">Order</TableHead>
                  <TableHead className="text-slate-300">Customer</TableHead>
                  <TableHead className="text-slate-300">Restaurant</TableHead>
                  <TableHead className="text-slate-300">Amount</TableHead>
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
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment._id} className="border-slate-700 hover:bg-slate-800/30">
                      <TableCell className="font-medium text-white">{payment.transaction_id}</TableCell>
                      <TableCell className="text-slate-300">{payment.order_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">
                            {`${payment.user_id.first_name} ${payment.user_id.last_name}`}
                          </div>
                          <div className="text-sm text-slate-400">{payment.user_id.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{payment.restaurant_id.name}</TableCell>
                      <TableCell className="text-white font-medium">₹{payment.amount}</TableCell>
                      <TableCell>{getMethodBadge(payment.payment_method)}</TableCell>
                      <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(payment.created_at).toLocaleDateString()}
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
                                setSelectedPayment(payment)
                                setShowPaymentDialog(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                              <Download className="mr-2 h-4 w-4" />
                              Download Receipt
                            </DropdownMenuItem>
                            {payment.payment_status === "completed" && (
                              <>
                                <DropdownMenuSeparator className="bg-slate-600" />
                                <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Process Refund
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

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Payment Details</DialogTitle>
            <DialogDescription className="text-slate-400">Complete transaction information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Transaction Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction ID:</span>
                        <span className="text-white font-mono">{selectedPayment.transaction_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Order ID:</span>
                        <span className="text-white">{selectedPayment.order_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-white font-medium">₹{selectedPayment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Method:</span>
                        {getMethodBadge(selectedPayment.payment_method)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        {getStatusBadge(selectedPayment.payment_status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name:</span>
                        <span className="text-white">
                          {selectedPayment.user_id.first_name} {selectedPayment.user_id.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white">{selectedPayment.user_id.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Restaurant:</span>
                        <span className="text-white">{selectedPayment.restaurant_id.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPayment.gateway_response && (
                <div>
                  <h4 className="font-medium text-white mb-2">Gateway Response</h4>
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                      {JSON.stringify(selectedPayment.gateway_response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-white">{new Date(selectedPayment.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Updated:</span>
                  <span className="text-white">{new Date(selectedPayment.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="border-slate-600">
              Close
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
