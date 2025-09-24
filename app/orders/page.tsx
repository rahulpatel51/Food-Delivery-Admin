"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  ShoppingCart,
  Clock,
  DollarSign,
  Truck,
  Eye,
  RefreshCw,
  Filter,
  MapPin,
  User,
  Store,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Order {
  _id: string
  order_number: string
  user_id: {
    first_name: string
    last_name: string
    email: string
    profile_image?: string
  }
  restaurant_id: {
    name: string
    logo_url?: string
  }
  delivery_partner_id?: {
    first_name: string
    last_name: string
    profile_image?: string
  }
  total_amount: number
  status: string
  payment_status: string
  delivery_address: {
    address_line_1: string
    city: string
    state: string
  }
  created_at: string
  estimated_delivery_time?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, paymentStatusFilter])

  const fetchOrders = async () => {
    try {
      // Mock data for demo
      setOrders([
        {
          _id: "1",
          order_number: "ORD-001",
          user_id: {
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
          },
          restaurant_id: {
            name: "Pizza Palace",
            logo_url: "/placeholder.svg?height=40&width=40",
          },
          delivery_partner_id: {
            first_name: "Mike",
            last_name: "Wilson",
          },
          total_amount: 450,
          status: "delivered",
          payment_status: "paid",
          delivery_address: {
            address_line_1: "123 Main Street",
            city: "Mumbai",
            state: "Maharashtra",
          },
          created_at: new Date().toISOString(),
          estimated_delivery_time: new Date(Date.now() + 1800000).toISOString(),
          items: [
            { name: "Margherita Pizza", quantity: 1, price: 350 },
            { name: "Garlic Bread", quantity: 1, price: 100 },
          ],
        },
        {
          _id: "2",
          order_number: "ORD-002",
          user_id: {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane@example.com",
            profile_image: "/placeholder.svg?height=40&width=40",
          },
          restaurant_id: {
            name: "Burger Hub",
          },
          total_amount: 320,
          status: "preparing",
          payment_status: "paid",
          delivery_address: {
            address_line_1: "456 Oak Avenue",
            city: "Delhi",
            state: "Delhi",
          },
          created_at: new Date().toISOString(),
          estimated_delivery_time: new Date(Date.now() + 2700000).toISOString(),
          items: [{ name: "Classic Burger", quantity: 2, price: 160 }],
        },
        {
          _id: "3",
          order_number: "ORD-003",
          user_id: {
            first_name: "Alex",
            last_name: "Johnson",
            email: "alex@example.com",
          },
          restaurant_id: {
            name: "Spice Garden",
            logo_url: "/placeholder.svg?height=40&width=40",
          },
          delivery_partner_id: {
            first_name: "Sarah",
            last_name: "Davis",
            profile_image: "/placeholder.svg?height=40&width=40",
          },
          total_amount: 680,
          status: "picked_up",
          payment_status: "paid",
          delivery_address: {
            address_line_1: "789 Pine Road",
            city: "Bangalore",
            state: "Karnataka",
          },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          estimated_delivery_time: new Date(Date.now() + 900000).toISOString(),
          items: [
            { name: "Chicken Biryani", quantity: 1, price: 280 },
            { name: "Paneer Tikka", quantity: 1, price: 220 },
            { name: "Naan", quantity: 2, price: 90 },
          ],
        },
      ])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
      confirmed: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: CheckCircle },
      preparing: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: AlertCircle },
      ready: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: CheckCircle },
      picked_up: { color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", icon: Truck },
      delivered: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
      cancelled: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border font-medium flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: "bg-green-500/20 text-green-400 border-green-500/30" },
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      failed: { color: "bg-red-500/20 text-red-400 border-red-500/30" },
      refunded: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return <Badge className={`${config.color} border font-medium`}>{status}</Badge>
  }

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant_id.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === "all" || order.status === statusFilter
    const matchesPayment =
      !paymentStatusFilter || paymentStatusFilter === "all" || order.payment_status === paymentStatusFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Orders</h1>
              <p className="text-green-200 mt-1">Manage and track all orders on your platform</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-green-200">
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Order Tracking
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Payment Management
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
                <p className="text-sm font-medium text-slate-400">Total Orders</p>
                <p className="text-3xl font-bold text-white">8,247</p>
                <p className="text-sm text-green-400">+15.3% from last month</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Orders</p>
                <p className="text-3xl font-bold text-white">234</p>
                <p className="text-sm text-blue-400">Currently processing</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Revenue Today</p>
                <p className="text-3xl font-bold text-white">₹1.2L</p>
                <p className="text-sm text-purple-400">Great performance!</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Avg Delivery Time</p>
                <p className="text-3xl font-bold text-white">28m</p>
                <p className="text-sm text-orange-400">Within target</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Truck className="h-6 w-6 text-orange-400" />
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading orders...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <Card
              key={order._id}
              className="glass-effect border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{order.order_number}</h3>
                    <p className="text-sm text-slate-400">
                      {new Date(order.created_at).toLocaleDateString()} at{" "}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.payment_status)}
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    {order.user_id.profile_image ? (
                      <img
                        src={order.user_id.profile_image || "/placeholder.svg"}
                        alt={`${order.user_id.first_name} ${order.user_id.last_name}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {getUserInitials(order.user_id.first_name, order.user_id.last_name)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-white font-medium text-sm">
                          {order.user_id.first_name} {order.user_id.last_name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{order.user_id.email}</p>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    {order.restaurant_id.logo_url ? (
                      <img
                        src={order.restaurant_id.logo_url || "/placeholder.svg"}
                        alt={order.restaurant_id.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                        {order.restaurant_id.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <Store className="h-4 w-4 text-slate-400" />
                        <span className="text-white font-medium text-sm">{order.restaurant_id.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Partner Info */}
                  {order.delivery_partner_id ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      {order.delivery_partner_id.profile_image ? (
                        <img
                          src={order.delivery_partner_id.profile_image || "/placeholder.svg"}
                          alt={`${order.delivery_partner_id.first_name} ${order.delivery_partner_id.last_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {getUserInitials(order.delivery_partner_id.first_name, order.delivery_partner_id.last_name)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4 text-slate-400" />
                          <span className="text-white font-medium text-sm">
                            {order.delivery_partner_id.first_name} {order.delivery_partner_id.last_name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Delivery Partner</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <span className="text-slate-400 text-sm">No delivery partner assigned</span>
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-white font-medium text-sm">Delivery Address</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {order.delivery_address.address_line_1}, {order.delivery_address.city},{" "}
                      {order.delivery_address.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">₹{order.total_amount}</p>
                    <p className="text-xs text-slate-400">{order.items.length} items</p>
                  </div>
                  {order.estimated_delivery_time && (
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Est. Delivery</p>
                      <p className="text-sm text-white font-medium">
                        {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 hover:border-green-500 hover:text-green-400"
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowOrderDialog(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 hover:border-blue-500 hover:text-blue-400"
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowStatusDialog(true)
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-green-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-400" />
              </div>
              Order Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Complete information about order {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-green-400" />
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Order ID</span>
                        <span className="text-white font-medium">{selectedOrder.order_number}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Status</span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Payment Status</span>
                        {getPaymentStatusBadge(selectedOrder.payment_status)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Total Amount</span>
                        <span className="text-white font-bold text-lg">₹{selectedOrder.total_amount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Order Date</span>
                        <span className="text-white font-medium">
                          {new Date(selectedOrder.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-green-400" />
                      Customer & Restaurant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer
                      </h4>
                      <div className="flex items-center gap-3">
                        {selectedOrder.user_id.profile_image ? (
                          <img
                            src={selectedOrder.user_id.profile_image || "/placeholder.svg"}
                            alt={`${selectedOrder.user_id.first_name} ${selectedOrder.user_id.last_name}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {getUserInitials(selectedOrder.user_id.first_name, selectedOrder.user_id.last_name)}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {selectedOrder.user_id.first_name} {selectedOrder.user_id.last_name}
                          </p>
                          <p className="text-slate-400 text-sm">{selectedOrder.user_id.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Restaurant
                      </h4>
                      <div className="flex items-center gap-3">
                        {selectedOrder.restaurant_id.logo_url ? (
                          <img
                            src={selectedOrder.restaurant_id.logo_url || "/placeholder.svg"}
                            alt={selectedOrder.restaurant_id.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                            {selectedOrder.restaurant_id.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{selectedOrder.restaurant_id.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Delivery Address
                      </h4>
                      <p className="text-slate-300">{selectedOrder.delivery_address.address_line_1}</p>
                      <p className="text-slate-300">
                        {selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-effect border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="text-white">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                      >
                        <div>
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="text-slate-400 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="text-white font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                      <span className="font-bold text-white text-lg">Total Amount</span>
                      <span className="text-2xl font-bold text-green-400">₹{selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" onClick={() => setShowOrderDialog(false)} className="border-slate-600">
              Close
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="bg-slate-900 border-green-500/30 border-2">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-400" />
              Update Order Status
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Change the status of order {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="status" className="text-slate-300">
              New Status
            </Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle status update logic here
                setShowStatusDialog(false)
                setNewStatus("")
              }}
              disabled={!newStatus}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
