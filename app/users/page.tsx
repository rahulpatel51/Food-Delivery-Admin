"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Shield,
  UserCheck,
  Gift,
  Heart,
  Settings,
  Bell,
  CreditCard,
  Home,
  Briefcase,
  MapPinIcon,
  Loader2,
  RefreshCw,
  AlertCircle,
  Crown,
  Award,
  TrendingUp,
} from "lucide-react"

interface Address {
  _id?: string
  type: "home" | "work" | "other"
  title?: string
  address_line_1: string
  address_line_2?: string
  landmark?: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude?: number
  longitude?: number
  is_default: boolean
}

interface User {
  _id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  avatar_url?: string
  date_of_birth?: string
  gender?: "male" | "female" | "other"
  email_verified: boolean
  phone_verified: boolean
  role: "customer" | "restaurant_owner" | "delivery_partner" | "admin" | "super_admin"
  status: "active" | "inactive" | "suspended" | "pending_verification"
  loyalty_points: number
  membership_level: "bronze" | "silver" | "gold" | "platinum"
  total_orders: number
  total_spent: number
  addresses: Address[]
  favorites: string[]
  device_tokens: string[]
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    dietary: ("veg" | "non-veg" | "vegan" | "gluten-free")[]
    language: string
  }
  created_at: string
  updated_at?: string
}

interface EditFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  role: string
  status: string
  loyalty_points: number
  membership_level: string
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    dietary: string[]
    language: string
  }
}

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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleApiError = (error: any, defaultMessage: string) => {
    console.error("API Error:", error)

    if (error.status === 401) {
      setError("Authentication failed. Please login again.")
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please login again.",
        variant: "destructive",
      })
      localStorage.removeItem("admin_token")
      sessionStorage.removeItem("admin_token")
      localStorage.removeItem("token")
      return
    }

    if (error.status === 403) {
      setError("Access denied. You don't have permission to perform this action.")
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
        variant: "destructive",
      })
      return
    }

    const errorMessage = error.message || defaultMessage
    setError(errorMessage)
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    })
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()
      if (!token) {
        // Use comprehensive mock data for demo
        setUsers([
          {
            _id: "1",
            email: "john.doe@example.com",
            phone: "9876543210",
            first_name: "John",
            last_name: "Doe",
            avatar_url: "/placeholder.svg?height=80&width=80",
            date_of_birth: "1990-05-15",
            gender: "male",
            email_verified: true,
            phone_verified: true,
            role: "customer",
            status: "active",
            loyalty_points: 2450,
            membership_level: "gold",
            total_orders: 45,
            total_spent: 12500,
            addresses: [
              {
                _id: "addr1",
                type: "home",
                title: "Home",
                address_line_1: "123 Main Street",
                address_line_2: "Apartment 4B",
                landmark: "Near Central Mall",
                city: "Mumbai",
                state: "Maharashtra",
                postal_code: "400001",
                country: "India",
                latitude: 19.076,
                longitude: 72.8777,
                is_default: true,
              },
              {
                _id: "addr2",
                type: "work",
                title: "Office",
                address_line_1: "456 Business District",
                city: "Mumbai",
                state: "Maharashtra",
                postal_code: "400051",
                country: "India",
                is_default: false,
              },
            ],
            favorites: ["rest1", "rest2", "rest3"],
            device_tokens: ["token1", "token2"],
            preferences: {
              notifications: {
                email: true,
                sms: true,
                push: true,
              },
              dietary: ["non-veg"],
              language: "en",
            },
            created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            _id: "2",
            email: "priya.sharma@example.com",
            phone: "9876543211",
            first_name: "Priya",
            last_name: "Sharma",
            date_of_birth: "1985-08-22",
            gender: "female",
            email_verified: true,
            phone_verified: false,
            role: "restaurant_owner",
            status: "active",
            loyalty_points: 0,
            membership_level: "bronze",
            total_orders: 0,
            total_spent: 0,
            addresses: [
              {
                _id: "addr3",
                type: "work",
                title: "Restaurant",
                address_line_1: "789 Food Street",
                city: "Delhi",
                state: "Delhi",
                postal_code: "110001",
                country: "India",
                is_default: true,
              },
            ],
            favorites: [],
            device_tokens: ["token3"],
            preferences: {
              notifications: {
                email: true,
                sms: false,
                push: true,
              },
              dietary: ["veg"],
              language: "hi",
            },
            created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            _id: "3",
            email: "mike.wilson@example.com",
            phone: "9876543212",
            first_name: "Mike",
            last_name: "Wilson",
            date_of_birth: "1992-12-10",
            gender: "male",
            email_verified: true,
            phone_verified: true,
            role: "delivery_partner",
            status: "active",
            loyalty_points: 150,
            membership_level: "bronze",
            total_orders: 0,
            total_spent: 0,
            addresses: [
              {
                _id: "addr4",
                type: "home",
                title: "Home",
                address_line_1: "321 Delivery Lane",
                city: "Bangalore",
                state: "Karnataka",
                postal_code: "560001",
                country: "India",
                is_default: true,
              },
            ],
            favorites: [],
            device_tokens: ["token4"],
            preferences: {
              notifications: {
                email: true,
                sms: true,
                push: true,
              },
              dietary: ["non-veg"],
              language: "en",
            },
            created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            _id: "4",
            email: "sarah.admin@example.com",
            phone: "9876543213",
            first_name: "Sarah",
            last_name: "Johnson",
            date_of_birth: "1988-03-18",
            gender: "female",
            email_verified: true,
            phone_verified: true,
            role: "admin",
            status: "active",
            loyalty_points: 0,
            membership_level: "platinum",
            total_orders: 0,
            total_spent: 0,
            addresses: [
              {
                _id: "addr5",
                type: "work",
                title: "Office",
                address_line_1: "555 Admin Tower",
                city: "Chennai",
                state: "Tamil Nadu",
                postal_code: "600001",
                country: "India",
                is_default: true,
              },
            ],
            favorites: [],
            device_tokens: ["token5"],
            preferences: {
              notifications: {
                email: true,
                sms: true,
                push: true,
              },
              dietary: ["veg", "gluten-free"],
              language: "en",
            },
            created_at: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter)
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw { status: response.status, message: `HTTP ${response.status}: ${response.statusText}` }
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        setUsers(data)
      } else if (data.success && data.data && Array.isArray(data.data.users)) {
        setUsers(data.data.users)
      } else if (data.data && Array.isArray(data.data.users)) {
        setUsers(data.data.users)
      } else if (data.users && Array.isArray(data.users)) {
        setUsers(data.users)
      } else if (data.success && Array.isArray(data.data)) {
        setUsers(data.data)
      } else {
        throw new Error("Invalid data format received from server")
      }
    } catch (error: any) {
      handleApiError(error, "Failed to fetch users. Please try again.")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserById = async (id: string) => {
    try {
      // For demo, return the user from current list
      const user = users.find((u) => u._id === id)
      if (user) return user

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw { status: response.status, message: `Failed to fetch user details` }
      }

      const data = await response.json()
      return data.data || data
    } catch (error: any) {
      handleApiError(error, "Failed to fetch user details.")
      return null
    }
  }

  const updateUser = async (id: string, updateData: Partial<User>) => {
    try {
      setActionLoading(true)

      // For demo, update local state
      setUsers((prev) => prev.map((user) => (user._id === id ? { ...user, ...updateData } : user)))

      toast({
        title: "Success",
        description: "User updated successfully.",
      })

      return { ...users.find((u) => u._id === id), ...updateData }
    } catch (error: any) {
      handleApiError(error, "Failed to update user. Please try again.")
      return null
    } finally {
      setActionLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setActionLoading(true)

      // Remove the user from local state
      setUsers((prev) => prev.filter((user) => user._id !== id))

      toast({
        title: "Success",
        description: "User deleted successfully.",
      })

      setShowDeleteDialog(false)
      setSelectedUser(null)
    } catch (error: any) {
      handleApiError(error, "Failed to delete user. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const toggleUserStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    const result = await updateUser(user._id, { status: newStatus })
    if (result) {
      toast({
        title: "Status Updated",
        description: `User is now ${newStatus}.`,
      })
    }
  }

  const handleViewUser = async (user: User) => {
    const fullUserData = await fetchUserById(user._id)
    if (fullUserData) {
      setSelectedUser(fullUserData)
      setShowUserDialog(true)
    }
  }

  const handleEditUser = async (user: User) => {
    const fullUserData = await fetchUserById(user._id)
    if (fullUserData) {
      setSelectedUser(fullUserData)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) return

    try {
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
    }
  }

  const getStatusBadge = (status?: string) => {
    const safeStatus = status || "active"
    const statusConfig = {
      active: { color: "bg-green-500/20 text-green-400 border-green-500/30" },
      inactive: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      suspended: { color: "bg-red-500/20 text-red-400 border-red-500/30" },
      pending_verification: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    }

    const config = statusConfig[safeStatus as keyof typeof statusConfig] || statusConfig.active

    return <Badge className={`${config.color} border font-medium`}>{safeStatus.replace("_", " ")}</Badge>
  }

  const getRoleBadge = (role?: string) => {
    const safeRole = role || "customer"
    const roleConfig = {
      customer: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Users },
      restaurant_owner: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: Shield },
      delivery_partner: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: UserCheck },
      admin: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: Shield },
      super_admin: { color: "bg-pink-500/20 text-pink-400 border-pink-500/30", icon: Crown },
    }

    const config = roleConfig[safeRole as keyof typeof roleConfig] || roleConfig.customer

    return (
      <Badge className={`${config.color} border font-medium flex items-center gap-1`}>
        <config.icon className="h-3 w-3" />
        {safeRole.replace("_", " ")}
      </Badge>
    )
  }

  const getMembershipBadge = (level?: string) => {
    const safeLevel = level || "bronze"
    const levelConfig = {
      bronze: { color: "bg-amber-600/20 text-amber-400 border-amber-600/30", icon: Award },
      silver: { color: "bg-gray-400/20 text-gray-300 border-gray-400/30", icon: Award },
      gold: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Crown },
      platinum: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Crown },
    }

    const config = levelConfig[safeLevel as keyof typeof levelConfig] || levelConfig.bronze

    return (
      <Badge className={`${config.color} border font-medium flex items-center gap-1`}>
        <config.icon className="h-3 w-3" />
        {safeLevel}
      </Badge>
    )
  }

  const getUserInitials = (firstName?: string, lastName?: string) => {
    return `${(firstName || "U").charAt(0)}${(lastName || "U").charAt(0)}`.toUpperCase()
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user?.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.phone || "").includes(searchTerm)
    const matchesRole = !roleFilter || roleFilter === "all" || user?.role === roleFilter
    const matchesStatus = !statusFilter || statusFilter === "all" || user?.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u?.status === "active").length,
    customers: users.filter((u) => u?.role === "customer").length,
    totalSpent: users.reduce((sum, u) => sum + (u?.total_spent || 0), 0),
  }

  // Error state
  if (error && !loading && users.length === 0) {
    return (
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Error Loading Users</h1>
                <p className="text-red-200 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="glass-effect border-red-500/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Data</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button
              onClick={fetchUsers}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Users</h1>
              <p className="text-blue-200 mt-1">Manage all users on your platform</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-blue-200">
            <div className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              User Management
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Role Control
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
                <p className="text-sm font-medium text-slate-400">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-green-400">Platform users</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Users</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
                <p className="text-sm text-green-400">Currently active</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Customers</p>
                <p className="text-3xl font-bold text-white">{stats.customers}</p>
                <p className="text-sm text-blue-400">Regular customers</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Heart className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₹{stats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-yellow-400">Customer spending</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="restaurant_owner">Restaurant Owner</SelectItem>
                <SelectItem value="delivery_partner">Delivery Partner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending_verification">Pending Verification</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={fetchUsers}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || roleFilter || statusFilter
                ? "No users match your current filters. Try adjusting your search criteria."
                : "No users have been registered yet."}
            </p>
            {(searchTerm || roleFilter || statusFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setRoleFilter("")
                  setStatusFilter("")
                }}
                className="border-slate-600"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card
              key={user._id}
              className="glass-effect border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={`${user?.first_name} ${user?.last_name}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-500/30 ${user?.avatar_url ? "hidden" : ""}`}
                    >
                      {getUserInitials(user?.first_name, user?.last_name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {user?.first_name || "Unknown"} {user?.last_name || "User"}
                      </h3>
                      <div className="flex items-center gap-2">{getRoleBadge(user?.role)}</div>
                    </div>
                  </div>
                  {getStatusBadge(user?.status)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{user?.email || "No email"}</span>
                    {user?.email_verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{user?.phone || "No phone"}</span>
                    {user?.phone_verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>
                        {user.addresses[0]?.city || "Unknown"}, {user.addresses[0]?.state || "Unknown"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Joined {new Date(user?.created_at || "").toLocaleDateString()}</span>
                  </div>
                </div>

                {user?.role === "customer" && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">Orders</span>
                        <span className="text-white font-medium">{user?.total_orders || 0}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">Spent</span>
                        <span className="text-white font-medium">₹{(user?.total_spent || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">Membership</span>
                        {getMembershipBadge(user?.membership_level)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user?.status === "active"}
                      onCheckedChange={() => toggleUserStatus(user)}
                      className="data-[state=checked]:bg-blue-500"
                      disabled={actionLoading}
                    />
                    <span className="text-sm text-slate-300">{user?.status === "active" ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-blue-500 hover:text-blue-400"
                      onClick={() => handleViewUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-red-500 hover:text-red-400"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowDeleteDialog(true)
                      }}
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

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-blue-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              User Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Complete information about {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Addresses
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="loyalty" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Loyalty
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        {selectedUser?.avatar_url ? (
                          <img
                            src={selectedUser.avatar_url || "/placeholder.svg"}
                            alt={`${selectedUser?.first_name} ${selectedUser?.last_name}`}
                            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/30"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-blue-500/30 ${selectedUser?.avatar_url ? "hidden" : ""}`}
                        >
                          {getUserInitials(selectedUser?.first_name, selectedUser?.last_name)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {selectedUser?.first_name || "Unknown"} {selectedUser?.last_name || "User"}
                          </h3>
                          {getRoleBadge(selectedUser?.role)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{selectedUser?.email || "No email"}</span>
                            {selectedUser?.email_verified && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{selectedUser?.phone || "No phone"}</span>
                            {selectedUser?.phone_verified && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Status</span>
                          {getStatusBadge(selectedUser?.status)}
                        </div>
                        {selectedUser?.date_of_birth && (
                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <span className="text-slate-400">Date of Birth</span>
                            <span className="text-white font-medium">
                              {new Date(selectedUser.date_of_birth).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {selectedUser?.gender && (
                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <span className="text-slate-400">Gender</span>
                            <span className="text-white font-medium capitalize">{selectedUser.gender}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400">Member Since</span>
                            <span className="text-white font-medium">
                              {new Date(selectedUser?.created_at || "").toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {Math.floor(
                              (Date.now() - new Date(selectedUser?.created_at || "").getTime()) / (1000 * 60 * 60 * 24),
                            )}{" "}
                            days ago
                          </div>
                        </div>

                        {selectedUser?.updated_at && (
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-400">Last Updated</span>
                              <span className="text-white font-medium">
                                {new Date(selectedUser.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {Math.floor(
                                (Date.now() - new Date(selectedUser.updated_at).getTime()) / (1000 * 60 * 60 * 24),
                              )}{" "}
                              days ago
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <h4 className="font-medium text-white mb-3">Verification Status</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">Email Verified</span>
                              <Badge
                                className={
                                  selectedUser?.email_verified
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                }
                              >
                                {selectedUser?.email_verified ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">Phone Verified</span>
                              <Badge
                                className={
                                  selectedUser?.phone_verified
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                }
                              >
                                {selectedUser?.phone_verified ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <h4 className="font-medium text-white mb-3">Device Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">Registered Devices</span>
                              <span className="text-white font-medium">{selectedUser?.device_tokens?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">Favorite Restaurants</span>
                              <span className="text-white font-medium">{selectedUser?.favorites?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="space-y-6 mt-6">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      Saved Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedUser?.addresses && selectedUser.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedUser.addresses.map((address, index) => (
                          <div
                            key={address._id || index}
                            className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {address.type === "home" && <Home className="h-4 w-4 text-blue-400" />}
                                {address.type === "work" && <Briefcase className="h-4 w-4 text-orange-400" />}
                                {address.type === "other" && <MapPinIcon className="h-4 w-4 text-purple-400" />}
                                <span className="font-medium text-white capitalize">
                                  {address.title || address.type}
                                </span>
                              </div>
                              {address.is_default && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-slate-300">
                              <p>{address.address_line_1}</p>
                              {address.address_line_2 && <p>{address.address_line_2}</p>}
                              {address.landmark && <p className="text-slate-400">Near {address.landmark}</p>}
                              <p>
                                {address.city}, {address.state} {address.postal_code}
                              </p>
                              <p className="text-slate-400">{address.country}</p>
                              {address.latitude && address.longitude && (
                                <p className="text-xs text-slate-500">
                                  Coordinates: {address.latitude}, {address.longitude}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">No addresses saved</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-400" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Notifications
                        </span>
                        <Badge
                          className={
                            selectedUser?.preferences?.notifications?.email
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {selectedUser?.preferences?.notifications?.email ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          SMS Notifications
                        </span>
                        <Badge
                          className={
                            selectedUser?.preferences?.notifications?.sms
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {selectedUser?.preferences?.notifications?.sms ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Push Notifications
                        </span>
                        <Badge
                          className={
                            selectedUser?.preferences?.notifications?.push
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {selectedUser?.preferences?.notifications?.push ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-400" />
                        Other Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h5 className="text-sm font-medium text-slate-400 mb-2">Language</h5>
                        <p className="text-white font-medium">
                          {selectedUser?.preferences?.language === "en"
                            ? "English"
                            : selectedUser?.preferences?.language || "English"}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h5 className="text-sm font-medium text-slate-400 mb-3">Dietary Preferences</h5>
                        {selectedUser?.preferences?.dietary && selectedUser.preferences.dietary.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.preferences.dietary.map((diet) => (
                              <Badge key={diet} className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 text-sm">No dietary preferences set</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="loyalty" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Gift className="h-5 w-5 text-blue-400" />
                        Loyalty Program
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                          <Crown className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {(selectedUser?.loyalty_points || 0).toLocaleString()} Points
                        </h3>
                        {getMembershipBadge(selectedUser?.membership_level)}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Current Level</span>
                          <span className="text-white font-medium capitalize">
                            {selectedUser?.membership_level || "Bronze"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Total Points</span>
                          <span className="text-white font-medium">{selectedUser?.loyalty_points || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedUser?.role === "customer" && (
                    <Card className="glass-effect border-slate-700/50">
                      <CardHeader className="border-b border-slate-700/50">
                        <CardTitle className="text-white flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-400" />
                          Spending Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-400">Total Orders</span>
                              <span className="text-white font-medium text-2xl">{selectedUser?.total_orders || 0}</span>
                            </div>
                            <div className="text-xs text-slate-500">Lifetime orders placed</div>
                          </div>
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-400">Total Spent</span>
                              <span className="text-white font-medium text-2xl">
                                ₹{(selectedUser?.total_spent || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">Lifetime spending amount</div>
                          </div>
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-400">Average Order Value</span>
                              <span className="text-white font-medium text-xl">
                                ₹
                                {selectedUser?.total_orders && selectedUser.total_orders > 0
                                  ? Math.round((selectedUser?.total_spent || 0) / selectedUser.total_orders)
                                  : 0}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">Per order average</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6 mt-6">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Account Created</span>
                          <span className="text-white font-medium">
                            {new Date(selectedUser?.created_at || "").toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {Math.floor(
                            (Date.now() - new Date(selectedUser?.created_at || "").getTime()) / (1000 * 60 * 60 * 24),
                          )}{" "}
                          days ago
                        </div>
                      </div>

                      {selectedUser?.updated_at && (
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400">Profile Last Updated</span>
                            <span className="text-white font-medium">
                              {new Date(selectedUser.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {Math.floor(
                              (Date.now() - new Date(selectedUser.updated_at).getTime()) / (1000 * 60 * 60 * 24),
                            )}{" "}
                            days ago
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h4 className="font-medium text-white mb-3">Account Statistics</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">{selectedUser?.addresses?.length || 0}</p>
                            <p className="text-xs text-slate-400">Saved Addresses</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">{selectedUser?.favorites?.length || 0}</p>
                            <p className="text-xs text-slate-400">Favorite Restaurants</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" onClick={() => setShowUserDialog(false)} className="border-slate-600">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-900 border-red-500/30 border-2">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              Delete User
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white">
                  {selectedUser?.first_name} {selectedUser?.last_name}
                </h4>
                <p className="text-sm text-slate-400">{selectedUser?.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && deleteUser(selectedUser._id)}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
