"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Store,
  Truck,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  DollarSign,
  Activity,
  Eye,
  AlertTriangle,
  Star,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

interface DashboardStats {
  overview: {
    total_users: number
    total_restaurants: number
    total_delivery_partners: number
    total_orders: number
  }
  today: {
    orders: number
    revenue: number
  }
  monthly: {
    orders: number
    revenue: number
    growth_percentage?: number
  }
  pending_approvals: {
    restaurants: number
    delivery_partners: number
  }
  recent_orders: Array<{
    _id: string
    order_number: string
    user_id: { first_name: string; last_name: string }
    restaurant_id: { name: string; logo_url?: string }
    total_amount: number
    status: string
    created_at: string
  }>
  order_status_distribution?: Array<{
    name: string
    value: number
    color: string
    count: number
  }>
  revenue_chart_data?: Array<{
    name: string
    revenue: number
    orders: number
    users: number
  }>
  hourly_orders_data?: Array<{
    hour: string
    orders: number
  }>
  top_restaurants?: Array<{
    name: string
    orders: number
    revenue: number
    rating: number
  }>
  urgent_issues?: number
}

const defaultOrderStatusData = [
  { name: "Delivered", value: 65, color: "#10b981", count: 1250 },
  { name: "Preparing", value: 20, color: "#f59e0b", count: 385 },
  { name: "Pending", value: 10, color: "#6b7280", count: 192 },
  { name: "Cancelled", value: 5, color: "#ef4444", count: 96 },
]

const defaultRevenueChartData = [
  { name: "Mon", revenue: 12500, orders: 45, users: 23 },
  { name: "Tue", revenue: 14200, orders: 52, users: 31 },
  { name: "Wed", revenue: 10800, orders: 38, users: 18 },
  { name: "Thu", revenue: 16900, orders: 61, users: 42 },
  { name: "Fri", revenue: 19500, orders: 73, users: 55 },
  { name: "Sat", revenue: 24200, orders: 89, users: 67 },
  { name: "Sun", revenue: 18100, orders: 67, users: 48 },
]

const defaultTopRestaurantsData = [
  { name: "Pizza Palace", orders: 245, revenue: 45600, rating: 4.8 },
  { name: "Burger Hub", orders: 198, revenue: 38200, rating: 4.6 },
  { name: "Spice Garden", orders: 167, revenue: 32100, rating: 4.7 },
  { name: "Pasta Corner", orders: 134, revenue: 28900, rating: 4.5 },
  { name: "Taco Bell", orders: 112, revenue: 22400, rating: 4.4 },
]

const defaultHourlyOrdersData = [
  { hour: "6AM", orders: 5 },
  { hour: "9AM", orders: 15 },
  { hour: "12PM", orders: 45 },
  { hour: "3PM", orders: 25 },
  { hour: "6PM", orders: 65 },
  { hour: "9PM", orders: 85 },
  { hour: "12AM", orders: 20 },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Auth token management
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token") || localStorage.getItem("token")
  }
  return null
}

const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()
      if (!token) {
        // Use mock data for demo
        setStats(getMockDashboardData())
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.")
        }
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API Response:", data) // Debug log

      // Handle the nested response structure
      let dashboardData: DashboardStats
      if (data.success && data.data) {
        dashboardData = data.data
      } else if (data.data) {
        dashboardData = data.data
      } else {
        dashboardData = data
      }

      // Ensure all required properties exist
      const completeData = {
        ...dashboardData,
        order_status_distribution: dashboardData.order_status_distribution || defaultOrderStatusData,
        revenue_chart_data: dashboardData.revenue_chart_data || defaultRevenueChartData,
        hourly_orders_data: dashboardData.hourly_orders_data || defaultHourlyOrdersData,
        top_restaurants: dashboardData.top_restaurants || defaultTopRestaurantsData,
        urgent_issues: dashboardData.urgent_issues || 3,
      }

      setStats(completeData)
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error)
      setError(error.message || "Failed to load dashboard data")
      // Use mock data as fallback
      setStats(getMockDashboardData())
    } finally {
      setLoading(false)
    }
  }

  const getMockDashboardData = (): DashboardStats => {
    return {
      overview: {
        total_users: 12547,
        total_restaurants: 856,
        total_delivery_partners: 445,
        total_orders: 34205,
      },
      today: {
        orders: 167,
        revenue: 185000,
      },
      monthly: {
        orders: 18900,
        revenue: 4850000,
        growth_percentage: 12,
      },
      pending_approvals: {
        restaurants: 18,
        delivery_partners: 32,
      },
      recent_orders: [
        {
          _id: "1",
          order_number: "ORD-001",
          user_id: { first_name: "John", last_name: "Doe" },
          restaurant_id: { name: "Pizza Palace", logo_url: "/placeholder.svg?height=40&width=40" },
          total_amount: 450,
          status: "delivered",
          created_at: new Date().toISOString(),
        },
        {
          _id: "2",
          order_number: "ORD-002",
          user_id: { first_name: "Jane", last_name: "Smith" },
          restaurant_id: { name: "Burger Hub", logo_url: "/placeholder.svg?height=40&width=40" },
          total_amount: 320,
          status: "preparing",
          created_at: new Date().toISOString(),
        },
        {
          _id: "3",
          order_number: "ORD-003",
          user_id: { first_name: "Mike", last_name: "Johnson" },
          restaurant_id: { name: "Spice Garden" },
          total_amount: 680,
          status: "confirmed",
          created_at: new Date().toISOString(),
        },
      ],
      order_status_distribution: defaultOrderStatusData,
      revenue_chart_data: defaultRevenueChartData,
      hourly_orders_data: defaultHourlyOrdersData,
      top_restaurants: defaultTopRestaurantsData,
      urgent_issues: 3,
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { variant: "default" as const, icon: CheckCircle, color: "text-green-400" },
      preparing: { variant: "secondary" as const, icon: Clock, color: "text-yellow-400" },
      cancelled: { variant: "destructive" as const, icon: XCircle, color: "text-red-400" },
      confirmed: { variant: "outline" as const, icon: CheckCircle, color: "text-blue-400" },
      pending: { variant: "secondary" as const, icon: Clock, color: "text-orange-400" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-4">
          <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
          <span className="text-white">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="space-y-8">
        <Card className="glass-effect border-red-500/50">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Dashboard</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button onClick={fetchDashboardStats} className="bg-gradient-to-r from-orange-500 to-red-500">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">No dashboard data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Admin! 👋</h1>
              <p className="text-orange-200 text-lg">Here's what's happening with your platform today.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-red-800 border-green-500/30">
                <Activity className="w-3 h-3 mr-1" />
                All Systems Operational
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">Today's Orders</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">{stats.today.orders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Today's Revenue</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">₹{stats.today.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white">
                <Store className="h-5 w-5" />
                <span className="font-medium">Pending Approvals</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">{stats.pending_approvals.restaurants}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Urgent Issues</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">{stats.urgent_issues}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.overview.total_users.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400 mt-1">
              <ArrowUpRight className="w-4 h-4 mr-1" />+{stats.monthly.growth_percentage || 12}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50 hover:border-green-500/30 transition-all duration-300 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Restaurants</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Store className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.overview.total_restaurants}</div>
            <div className="flex items-center text-sm text-orange-400 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {stats.pending_approvals.restaurants} pending approval
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Delivery Partners</CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Truck className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.overview.total_delivery_partners}</div>
            <div className="flex items-center text-sm text-orange-400 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {stats.pending_approvals.delivery_partners} applications pending
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Orders</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.overview.total_orders.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400 mt-1">
              <ArrowUpRight className="w-4 h-4 mr-1" />+{stats.monthly.growth_percentage || 8}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Revenue & Orders Trend
            </CardTitle>
            <CardDescription className="text-slate-400">Weekly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={stats.revenue_chart_data}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#ordersGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Order Status Distribution</CardTitle>
            <CardDescription className="text-slate-400">Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={stats.order_status_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.order_status_distribution?.map((entry, index) => (
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
            <div className="grid grid-cols-2 gap-2 mt-4">
              {stats.order_status_distribution?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-400">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Hourly Order Pattern</CardTitle>
            <CardDescription className="text-slate-400">Peak ordering hours analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.hourly_orders_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Restaurants</CardTitle>
            <CardDescription className="text-slate-400">Based on orders and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.top_restaurants?.map((restaurant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{restaurant.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {restaurant.rating}
                        <span>•</span>
                        {restaurant.orders} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">₹{restaurant.revenue.toLocaleString()}</div>
                    <div className="text-sm text-green-400">+{stats.monthly.growth_percentage || 12}% growth</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="glass-effect border-slate-700/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Recent Orders</CardTitle>
            <CardDescription className="text-slate-400">Latest orders from your platform</CardDescription>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/30">
                  <TableHead className="text-slate-300">Order ID</TableHead>
                  <TableHead className="text-slate-300">Customer</TableHead>
                  <TableHead className="text-slate-300">Restaurant</TableHead>
                  <TableHead className="text-slate-300">Amount</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recent_orders.length > 0 ? (
                  stats.recent_orders.map((order) => (
                    <TableRow key={order._id} className="border-slate-700 hover:bg-slate-800/30">
                      <TableCell className="font-medium text-white">{order.order_number}</TableCell>
                      <TableCell className="text-slate-300">{`${order.user_id.first_name} ${order.user_id.last_name}`}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {order.restaurant_id.logo_url ? (
                            <img
                              src={order.restaurant_id.logo_url || "/placeholder.svg"}
                              alt={order.restaurant_id.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <Store className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-slate-300">{order.restaurant_id.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">₹{order.total_amount}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-slate-400">
                      No recent orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
