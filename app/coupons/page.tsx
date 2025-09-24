"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Percent,
  Calendar,
  Users,
  ShoppingCart,
  Target,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  TrendingUp,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Coupon {
  _id: string
  code: string
  title: string
  description: string
  type: "percentage" | "fixed_amount" | "free_delivery"
  value: number
  min_order_amount: number
  max_discount_amount?: number
  usage_limit: number
  used_count: number
  user_limit_per_coupon: number
  applicable_to: "all" | "new_users" | "existing_users" | "restaurants" | "categories"
  applicable_items?: string[]
  start_date: string
  end_date: string
  is_active: boolean
  created_by: string
  created_at: string
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    title: "",
    description: "",
    type: "percentage" as const,
    value: 0,
    min_order_amount: 0,
    max_discount_amount: 0,
    usage_limit: 100,
    user_limit_per_coupon: 1,
    applicable_to: "all" as const,
    start_date: "",
    end_date: "",
    is_active: true,
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      // Mock data for demo
      setCoupons([
        {
          _id: "1",
          code: "SAVE30",
          title: "30% Off Everything",
          description: "Get 30% discount on all orders above ₹500",
          type: "percentage",
          value: 30,
          min_order_amount: 500,
          max_discount_amount: 200,
          usage_limit: 1000,
          used_count: 750,
          user_limit_per_coupon: 1,
          applicable_to: "all",
          start_date: "2024-01-01",
          end_date: "2024-01-31",
          is_active: true,
          created_by: "Admin",
          created_at: new Date().toISOString(),
        },
        {
          _id: "2",
          code: "NEWUSER50",
          title: "New User Special",
          description: "₹50 off for first-time users",
          type: "fixed_amount",
          value: 50,
          min_order_amount: 200,
          usage_limit: 500,
          used_count: 320,
          user_limit_per_coupon: 1,
          applicable_to: "new_users",
          start_date: "2024-01-01",
          end_date: "2024-12-31",
          is_active: true,
          created_by: "Admin",
          created_at: new Date().toISOString(),
        },
        {
          _id: "3",
          code: "FREEDEL",
          title: "Free Delivery",
          description: "Free delivery on all orders",
          type: "free_delivery",
          value: 0,
          min_order_amount: 300,
          usage_limit: 2000,
          used_count: 1200,
          user_limit_per_coupon: 3,
          applicable_to: "all",
          start_date: "2024-01-01",
          end_date: "2024-06-30",
          is_active: false,
          created_by: "Admin",
          created_at: new Date().toISOString(),
        },
      ])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching coupons:", error)
      setLoading(false)
    }
  }

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewCoupon({ ...newCoupon, code: result })
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      percentage: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Percent },
      fixed_amount: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: ShoppingCart },
      free_delivery: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: Gift },
    }

    const config = typeConfig[type as keyof typeof typeConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border font-medium flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {type.replace("_", " ")}
      </Badge>
    )
  }

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    const endDate = new Date(coupon.end_date)
    const isExpired = endDate < now
    const isUsedUp = coupon.used_count >= coupon.usage_limit

    if (!coupon.is_active) {
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border font-medium flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Inactive
        </Badge>
      )
    }

    if (isExpired) {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border font-medium flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>
      )
    }

    if (isUsedUp) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border font-medium flex items-center gap-1">
          <Target className="h-3 w-3" />
          Used Up
        </Badge>
      )
    }

    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border font-medium flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    )
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100)
  }

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || typeFilter === "all" || coupon.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900 via-rose-900 to-red-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Coupons & Discounts</h1>
              <p className="text-pink-200 mt-1">Create and manage promotional coupons to boost sales</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-pink-200">
            <div className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              Discount Management
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Usage Tracking
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
                <p className="text-sm font-medium text-slate-400">Total Coupons</p>
                <p className="text-3xl font-bold text-white">156</p>
                <p className="text-sm text-green-400">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <Gift className="h-6 w-6 text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Coupons</p>
                <p className="text-3xl font-bold text-white">89</p>
                <p className="text-sm text-green-400">+8.2% from last month</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Usage</p>
                <p className="text-3xl font-bold text-white">12.4K</p>
                <p className="text-sm text-blue-400">+25.3% from last month</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Savings Generated</p>
                <p className="text-3xl font-bold text-white">₹2.8L</p>
                <p className="text-sm text-orange-400">+18.7% from last month</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Percent className="h-6 w-6 text-orange-400" />
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
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                <SelectItem value="free_delivery">Free Delivery</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading coupons...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCoupons.map((coupon) => (
            <Card
              key={coupon._id}
              className="glass-effect border-slate-700/50 hover:border-pink-500/50 transition-all duration-300 group overflow-hidden"
            >
              <div className="relative p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/20 rounded-xl">
                      <Gift className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">{coupon.code}</h3>
                      <p className="text-slate-400">{coupon.title}</p>
                    </div>
                  </div>
                  {getStatusBadge(coupon)}
                </div>

                <div className="flex items-center justify-between mb-4">
                  {getTypeBadge(coupon.type)}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : coupon.type === "fixed_amount"
                          ? `₹${coupon.value}`
                          : "Free"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {coupon.type === "percentage" ? "OFF" : coupon.type === "fixed_amount" ? "OFF" : "DELIVERY"}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4 mb-4">
                  <p className="text-sm text-slate-300">{coupon.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <span className="text-slate-400 block">Min Order</span>
                      <span className="text-white font-medium">₹{coupon.min_order_amount}</span>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <span className="text-slate-400 block">Usage Limit</span>
                      <span className="text-white font-medium">{coupon.usage_limit}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Usage Progress</span>
                      <span className="text-white">
                        {coupon.used_count}/{coupon.usage_limit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getUsagePercentage(coupon.used_count, coupon.usage_limit)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                      {getUsagePercentage(coupon.used_count, coupon.usage_limit)}% used
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expires: {new Date(coupon.end_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {coupon.applicable_to.replace("_", " ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={coupon.is_active} className="data-[state=checked]:bg-pink-500" />
                    <span className="text-sm text-slate-300">{coupon.is_active ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-pink-500 hover:text-pink-400"
                      onClick={() => {
                        setSelectedCoupon(coupon)
                        setShowEditDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-blue-500 hover:text-blue-400"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Coupon Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-pink-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Gift className="h-6 w-6 text-pink-400" />
              </div>
              Create New Coupon
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Design a new promotional coupon with custom rules and restrictions
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
              <TabsTrigger value="basic" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="rules" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                Rules & Limits
              </TabsTrigger>
              <TabsTrigger value="targeting" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                Targeting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-slate-300">
                    Coupon Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      placeholder="e.g., SAVE30"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCouponCode}
                      className="border-slate-600 whitespace-nowrap"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., 30% Off Everything"
                    value={newCoupon.title}
                    onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the coupon offer"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-300">
                    Discount Type
                  </Label>
                  <Select
                    value={newCoupon.type}
                    onValueChange={(value: any) => setNewCoupon({ ...newCoupon, type: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                      <SelectItem value="free_delivery">Free Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-slate-300">
                    {newCoupon.type === "percentage"
                      ? "Percentage (%)"
                      : newCoupon.type === "fixed_amount"
                        ? "Amount (₹)"
                        : "Value"}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder={newCoupon.type === "percentage" ? "30" : "50"}
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: Number.parseInt(e.target.value) || 0 })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    disabled={newCoupon.type === "free_delivery"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="text-slate-300">
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newCoupon.start_date}
                    onChange={(e) => setNewCoupon({ ...newCoupon, start_date: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date" className="text-slate-300">
                    End Date
                  </Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newCoupon.end_date}
                    onChange={(e) => setNewCoupon({ ...newCoupon, end_date: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_amount" className="text-slate-300">
                    Minimum Order Amount (₹)
                  </Label>
                  <Input
                    id="min_order_amount"
                    type="number"
                    placeholder="500"
                    value={newCoupon.min_order_amount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, min_order_amount: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_discount_amount" className="text-slate-300">
                    Maximum Discount Amount (₹)
                  </Label>
                  <Input
                    id="max_discount_amount"
                    type="number"
                    placeholder="200"
                    value={newCoupon.max_discount_amount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, max_discount_amount: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                    disabled={newCoupon.type !== "percentage"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit" className="text-slate-300">
                    Total Usage Limit
                  </Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    placeholder="1000"
                    value={newCoupon.usage_limit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: Number.parseInt(e.target.value) || 0 })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_limit_per_coupon" className="text-slate-300">
                    Usage Limit Per User
                  </Label>
                  <Input
                    id="user_limit_per_coupon"
                    type="number"
                    placeholder="1"
                    value={newCoupon.user_limit_per_coupon}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, user_limit_per_coupon: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="applicable_to" className="text-slate-300">
                  Target Audience
                </Label>
                <Select
                  value={newCoupon.applicable_to}
                  onValueChange={(value: any) => setNewCoupon({ ...newCoupon, applicable_to: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="new_users">New Users Only</SelectItem>
                    <SelectItem value="existing_users">Existing Users</SelectItem>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                    <SelectItem value="categories">Specific Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newCoupon.is_active}
                  onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, is_active: checked })}
                />
                <Label className="text-slate-300">
                  {newCoupon.is_active
                    ? "Active (Coupon will be available immediately)"
                    : "Inactive (Coupon will be saved as draft)"}
                </Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-pink-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-pink-400" />
              Edit Coupon
            </DialogTitle>
            <DialogDescription className="text-slate-400">Update coupon information and settings</DialogDescription>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-6 mt-6">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h4 className="font-medium text-white mb-4">Performance Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block">Total Uses</span>
                    <span className="text-white font-medium text-lg">{selectedCoupon.used_count}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Usage Rate</span>
                    <span className="text-white font-medium text-lg">
                      {getUsagePercentage(selectedCoupon.used_count, selectedCoupon.usage_limit)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Remaining</span>
                    <span className="text-white font-medium text-lg">
                      {selectedCoupon.usage_limit - selectedCoupon.used_count}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Coupon Code</Label>
                  <Input
                    value={selectedCoupon.code}
                    onChange={(e) => setSelectedCoupon({ ...selectedCoupon, code: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Title</Label>
                  <Input
                    value={selectedCoupon.title}
                    onChange={(e) => setSelectedCoupon({ ...selectedCoupon, title: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={selectedCoupon.description}
                  onChange={(e) => setSelectedCoupon({ ...selectedCoupon, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedCoupon.is_active}
                  onCheckedChange={(checked) => setSelectedCoupon({ ...selectedCoupon, is_active: checked })}
                />
                <Label className="text-slate-300">{selectedCoupon.is_active ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          )}
          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              <Edit className="w-4 h-4 mr-2" />
              Update Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
