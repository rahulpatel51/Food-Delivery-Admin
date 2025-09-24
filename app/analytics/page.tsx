"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Clock, MapPin, Star, Download } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000, orders: 320, customers: 180 },
  { month: "Feb", revenue: 52000, orders: 380, customers: 220 },
  { month: "Mar", revenue: 48000, orders: 350, customers: 200 },
  { month: "Apr", revenue: 61000, orders: 420, customers: 280 },
  { month: "May", revenue: 73000, orders: 510, customers: 340 },
  { month: "Jun", revenue: 89000, orders: 620, customers: 420 },
]

const cuisineData = [
  { name: "North Indian", value: 35, color: "#f97316" },
  { name: "Chinese", value: 25, color: "#10b981" },
  { name: "Italian", value: 20, color: "#3b82f6" },
  { name: "South Indian", value: 15, color: "#8b5cf6" },
  { name: "Others", value: 5, color: "#6b7280" },
]

const hourlyData = [
  { hour: "6AM", orders: 5 },
  { hour: "9AM", orders: 15 },
  { hour: "12PM", orders: 45 },
  { hour: "3PM", orders: 25 },
  { hour: "6PM", orders: 65 },
  { hour: "9PM", orders: 85 },
  { hour: "12AM", orders: 20 },
]

const topRestaurants = [
  { name: "Pizza Palace", orders: 245, revenue: 45600, rating: 4.8, growth: 12 },
  { name: "Burger Hub", orders: 198, revenue: 38200, rating: 4.6, growth: 8 },
  { name: "Spice Garden", orders: 167, revenue: 32100, rating: 4.7, growth: -3 },
  { name: "Pasta Corner", orders: 134, revenue: 28900, rating: 4.5, growth: 15 },
  { name: "Taco Bell", orders: 112, revenue: 22400, rating: 4.4, growth: 5 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [loading, setLoading] = useState(false)

  const stats = [
    {
      title: "Total Revenue",
      value: "₹4,89,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      title: "Total Orders",
      value: "2,847",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-400",
    },
    {
      title: "Active Customers",
      value: "1,642",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-400",
    },
    {
      title: "Avg. Order Value",
      value: "₹342",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="glass-effect border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
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
                className={`flex items-center text-sm mt-1 ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {stat.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Revenue & Orders Trend</CardTitle>
            <CardDescription className="text-slate-400">Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
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
                  stroke="#3b82f6"
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
            <CardTitle className="text-white">Cuisine Popularity</CardTitle>
            <CardDescription className="text-slate-400">Order distribution by cuisine type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={cuisineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cuisineData.map((entry, index) => (
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
              {cuisineData.map((item, index) => (
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

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Hourly Order Pattern</CardTitle>
            <CardDescription className="text-slate-400">Peak ordering hours analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
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
                <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
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
              {topRestaurants.map((restaurant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{restaurant.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {restaurant.rating}
                        <span>•</span>
                        {restaurant.orders} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">₹{restaurant.revenue.toLocaleString()}</div>
                    <div
                      className={`text-sm flex items-center ${
                        restaurant.growth > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {restaurant.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(restaurant.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-400" />
              Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Avg. Delivery Time</span>
                <span className="text-white font-medium">28 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">On-time Delivery</span>
                <span className="text-green-400 font-medium">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Customer Satisfaction</span>
                <span className="text-yellow-400 font-medium">4.6/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-green-400" />
              Geographic Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Top City</span>
                <span className="text-white font-medium">Mumbai</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Coverage Areas</span>
                <span className="text-blue-400 font-medium">24 zones</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Expansion Rate</span>
                <span className="text-green-400 font-medium">+18%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-purple-400" />
              Customer Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">New Customers</span>
                <span className="text-white font-medium">342 this month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Retention Rate</span>
                <span className="text-green-400 font-medium">78.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Repeat Orders</span>
                <span className="text-blue-400 font-medium">65.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
