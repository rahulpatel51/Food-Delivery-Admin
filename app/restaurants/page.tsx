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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Store,
  Star,
  MapPin,
  Mail,
  Edit,
  Trash2,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  AlertCircle,
  Save,
  X,
  CreditCard,
  FileText,
  Settings,
  Calendar,
  DollarSign,
  Utensils,
  Truck,
  Home,
  ShoppingBag,
} from "lucide-react"

interface Restaurant {
  _id: string
  name: string
  slug?: string
  description?: string
  email: string
  phone: string
  status: string
  cuisine_types: string[]
  rating: number
  total_reviews: number
  logo_url?: string
  logo_public_id?: string
  banner_url?: string
  banner_public_id?: string
  gallery_images: Array<{
    _id?: string
    url: string
    public_id?: string
    caption?: string
    uploaded_at?: string
  }>
  address: {
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country?: string
    coordinates?: [number, number]
  }
  price_range: {
    level: string
    min_per_person: number
    max_per_person: number
    for_two: string
  }
  delivery_info: {
    time_min: number
    time_max: number
    fee: number
    min_order: number
    radius?: number
    average_time?: number
  }
  features: {
    is_pure_veg: boolean
    is_featured: boolean
    is_promoted?: boolean
    has_delivery: boolean
    has_dining: boolean
    has_takeaway?: boolean
  }
  financials?: {
    commission_rate: number
    bank_details?: {
      account_holder?: string
      account_number?: string
      bank_name?: string
      ifsc_code?: string
      upi_id?: string
    }
  }
  legal?: {
    gstin?: string
    pan?: string
    fssai_license?: string
  }
  opening_hours?: Array<{
    day: string
    slots: Array<{
      open: string
      close: string
      type: string
    }>
  }>
  settings?: {
    auto_accept_orders: boolean
    preparation_time: number
    order_capacity: {
      per_hour: number
      per_day: number
    }
  }
  owner_id: {
    first_name: string
    last_name: string
    email: string
  }
  created_at: string
  updated_at?: string
  rejection_reason?: string
}

interface EditFormData {
  name: string
  description: string
  email: string
  phone: string
  cuisine_types: string[]
  address: {
    address_line_1: string
    address_line_2: string
    city: string
    state: string
    postal_code: string
  }
  price_range: {
    level: string
    min_per_person: number
    max_per_person: number
    for_two: string
  }
  delivery_info: {
    time_min: number
    time_max: number
    fee: number
    min_order: number
    radius: number
  }
  features: {
    is_pure_veg: boolean
    is_featured: boolean
    is_promoted: boolean
    has_delivery: boolean
    has_dining: boolean
    has_takeaway: boolean
  }
  financials: {
    commission_rate: number
    bank_details: {
      account_holder: string
      account_number: string
      bank_name: string
      ifsc_code: string
      upi_id: string
    }
  }
  legal: {
    gstin: string
    pan: string
    fssai_license: string
  }
  settings: {
    auto_accept_orders: boolean
    preparation_time: number
    order_capacity: {
      per_hour: number
      per_day: number
    }
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

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showRestaurantDialog, setShowRestaurantDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve")
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRestaurants()
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

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()
      if (!token) {
        // Use comprehensive mock data for demo
        setRestaurants([
          {
            _id: "1",
            name: "Pizza Palace",
            slug: "pizza-palace",
            description:
              "Authentic Italian pizzas with fresh ingredients and traditional recipes. Experience the taste of Italy in every bite.",
            email: "contact@pizzapalace.com",
            phone: "9876543210",
            status: "pending_approval",
            cuisine_types: ["Italian", "Pizza", "Fast Food"],
            rating: 4.5,
            total_reviews: 234,
            logo_url: "/placeholder.svg?height=80&width=80",
            banner_url: "/placeholder.svg?height=200&width=400",
            gallery_images: [
              { url: "/placeholder.svg?height=150&width=200", caption: "Interior view" },
              { url: "/placeholder.svg?height=150&width=200", caption: "Kitchen" },
              { url: "/placeholder.svg?height=150&width=200", caption: "Signature pizza" },
            ],
            address: {
              address_line_1: "123 Main Street, Downtown",
              address_line_2: "Near Central Mall",
              city: "Mumbai",
              state: "Maharashtra",
              postal_code: "400001",
              country: "India",
              coordinates: [72.8777, 19.076],
            },
            price_range: {
              level: "₹₹",
              min_per_person: 150,
              max_per_person: 300,
              for_two: "₹300-₹600",
            },
            delivery_info: {
              time_min: 25,
              time_max: 35,
              fee: 30,
              min_order: 150,
              radius: 5,
              average_time: 30,
            },
            features: {
              is_pure_veg: false,
              is_featured: true,
              is_promoted: false,
              has_delivery: true,
              has_dining: true,
              has_takeaway: true,
            },
            financials: {
              commission_rate: 15,
              bank_details: {
                account_holder: "Pizza Palace Pvt Ltd",
                account_number: "1234567890123456",
                bank_name: "HDFC Bank",
                ifsc_code: "HDFC0001234",
                upi_id: "pizzapalace@paytm",
              },
            },
            legal: {
              gstin: "27ABCDE1234F1Z5",
              pan: "ABCDE1234F",
              fssai_license: "12345678901234",
            },
            opening_hours: [
              {
                day: "monday",
                slots: [
                  { open: "10:00", close: "22:00", type: "dine-in" },
                  { open: "10:00", close: "23:00", type: "delivery" },
                ],
              },
              {
                day: "tuesday",
                slots: [
                  { open: "10:00", close: "22:00", type: "dine-in" },
                  { open: "10:00", close: "23:00", type: "delivery" },
                ],
              },
            ],
            settings: {
              auto_accept_orders: true,
              preparation_time: 20,
              order_capacity: {
                per_hour: 15,
                per_day: 120,
              },
            },
            owner_id: {
              first_name: "John",
              last_name: "Doe",
              email: "john@pizzapalace.com",
            },
            created_at: new Date().toISOString(),
          },
          {
            _id: "2",
            name: "Spice Garden",
            slug: "spice-garden",
            description:
              "Traditional North Indian cuisine with authentic spices and flavors. Family recipes passed down through generations.",
            email: "info@spicegarden.com",
            phone: "9876543211",
            status: "active",
            cuisine_types: ["North Indian", "Mughlai", "Biryani"],
            rating: 4.7,
            total_reviews: 456,
            logo_url: "/placeholder.svg?height=80&width=80",
            banner_url: "/placeholder.svg?height=200&width=400",
            gallery_images: [
              { url: "/placeholder.svg?height=150&width=200", caption: "Dining area" },
              { url: "/placeholder.svg?height=150&width=200", caption: "Special thali" },
            ],
            address: {
              address_line_1: "456 Food Street, Central",
              address_line_2: "Opposite Metro Station",
              city: "Delhi",
              state: "Delhi",
              postal_code: "110001",
              country: "India",
              coordinates: [77.209, 28.6139],
            },
            price_range: {
              level: "₹₹₹",
              min_per_person: 300,
              max_per_person: 600,
              for_two: "₹600-₹1200",
            },
            delivery_info: {
              time_min: 30,
              time_max: 45,
              fee: 25,
              min_order: 200,
              radius: 8,
              average_time: 37,
            },
            features: {
              is_pure_veg: true,
              is_featured: false,
              is_promoted: true,
              has_delivery: true,
              has_dining: true,
              has_takeaway: true,
            },
            financials: {
              commission_rate: 12,
              bank_details: {
                account_holder: "Spice Garden Restaurant",
                account_number: "9876543210987654",
                bank_name: "SBI",
                ifsc_code: "SBIN0001234",
                upi_id: "spicegarden@phonepe",
              },
            },
            legal: {
              gstin: "07FGHIJ5678K2L9",
              pan: "FGHIJ5678K",
              fssai_license: "98765432109876",
            },
            opening_hours: [
              {
                day: "monday",
                slots: [
                  { open: "11:00", close: "23:00", type: "dine-in" },
                  { open: "11:00", close: "23:30", type: "delivery" },
                ],
              },
            ],
            settings: {
              auto_accept_orders: false,
              preparation_time: 25,
              order_capacity: {
                per_hour: 12,
                per_day: 100,
              },
            },
            owner_id: {
              first_name: "Priya",
              last_name: "Sharma",
              email: "priya@spicegarden.com",
            },
            created_at: new Date().toISOString(),
          },
        ])
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`${API_BASE_URL}/api/admin/restaurants?${params}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw { status: response.status, message: `HTTP ${response.status}: ${response.statusText}` }
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        setRestaurants(data)
      } else if (data.data && Array.isArray(data.data.restaurants)) {
        setRestaurants(data.data.restaurants)
      } else if (data.restaurants && Array.isArray(data.restaurants)) {
        setRestaurants(data.restaurants)
      } else if (data.success && Array.isArray(data.data)) {
        setRestaurants(data.data)
      } else {
        throw new Error("Invalid data format received from server")
      }
    } catch (error: any) {
      handleApiError(error, "Failed to fetch restaurants. Please try again.")
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRestaurantById = async (id: string) => {
    try {
      // For demo, return the restaurant from current list
      const restaurant = restaurants.find((r) => r._id === id)
      if (restaurant) return restaurant

      const response = await fetch(`${API_BASE_URL}/api/admin/restaurants/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw { status: response.status, message: `Failed to fetch restaurant details` }
      }

      const data = await response.json()
      return data.data || data
    } catch (error: any) {
      handleApiError(error, "Failed to fetch restaurant details.")
      return null
    }
  }

  const updateRestaurant = async (id: string, updateData: Partial<Restaurant>) => {
    try {
      setActionLoading(true)

      // For demo, update local state
      setRestaurants((prev) =>
        prev.map((restaurant) => (restaurant._id === id ? { ...restaurant, ...updateData } : restaurant)),
      )

      toast({
        title: "Success",
        description: "Restaurant updated successfully.",
      })

      return { ...restaurants.find((r) => r._id === id), ...updateData }
    } catch (error: any) {
      handleApiError(error, "Failed to update restaurant. Please try again.")
      return null
    } finally {
      setActionLoading(false)
    }
  }

  const approveRestaurant = async (id: string) => {
    try {
      setActionLoading(true)

      // Update the restaurant status in local state
      setRestaurants((prev) =>
        prev.map((restaurant) => (restaurant._id === id ? { ...restaurant, status: "active" } : restaurant)),
      )

      toast({
        title: "Success",
        description: "Restaurant approved successfully.",
      })

      setShowApprovalDialog(false)
      setShowRestaurantDialog(false)
    } catch (error: any) {
      handleApiError(error, "Failed to approve restaurant. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const rejectRestaurant = async (id: string, reason: string) => {
    try {
      setActionLoading(true)

      // Update the restaurant status in local state
      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant._id === id ? { ...restaurant, status: "rejected", rejection_reason: reason } : restaurant,
        ),
      )

      toast({
        title: "Success",
        description: "Restaurant rejected successfully.",
      })

      setShowApprovalDialog(false)
      setShowRestaurantDialog(false)
      setRejectionReason("")
    } catch (error: any) {
      handleApiError(error, "Failed to reject restaurant. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const deleteRestaurant = async (id: string) => {
    try {
      setActionLoading(true)

      // Remove the restaurant from local state
      setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== id))

      toast({
        title: "Success",
        description: "Restaurant deleted successfully.",
      })

      setShowDeleteDialog(false)
      setSelectedRestaurant(null)
    } catch (error: any) {
      handleApiError(error, "Failed to delete restaurant. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const toggleRestaurantStatus = async (restaurant: Restaurant) => {
    const newStatus = restaurant.status === "active" ? "inactive" : "active"
    const result = await updateRestaurant(restaurant._id, { status: newStatus })
    if (result) {
      toast({
        title: "Status Updated",
        description: `Restaurant is now ${newStatus}.`,
      })
    }
  }

  const toggleFeatureStatus = async (restaurant: Restaurant, feature: keyof Restaurant["features"]) => {
    const newFeatures = {
      ...restaurant.features,
      [feature]: !restaurant.features[feature],
    }
    await updateRestaurant(restaurant._id, { features: newFeatures })
  }

  const handleViewRestaurant = async (restaurant: Restaurant) => {
    const fullRestaurantData = await fetchRestaurantById(restaurant._id)
    if (fullRestaurantData) {
      setSelectedRestaurant(fullRestaurantData)
      setShowRestaurantDialog(true)
    }
  }

  const handleEditRestaurant = async (restaurant: Restaurant) => {
    const fullRestaurantData = await fetchRestaurantById(restaurant._id)
    if (fullRestaurantData) {
      setSelectedRestaurant(fullRestaurantData)
      setEditFormData({
        name: fullRestaurantData.name || "",
        description: fullRestaurantData.description || "",
        email: fullRestaurantData.email || "",
        phone: fullRestaurantData.phone || "",
        cuisine_types: fullRestaurantData.cuisine_types || [],
        address: {
          address_line_1: fullRestaurantData.address?.address_line_1 || "",
          address_line_2: fullRestaurantData.address?.address_line_2 || "",
          city: fullRestaurantData.address?.city || "",
          state: fullRestaurantData.address?.state || "",
          postal_code: fullRestaurantData.address?.postal_code || "",
        },
        price_range: {
          level: fullRestaurantData.price_range?.level || "₹",
          min_per_person: fullRestaurantData.price_range?.min_per_person || 0,
          max_per_person: fullRestaurantData.price_range?.max_per_person || 0,
          for_two: fullRestaurantData.price_range?.for_two || "",
        },
        delivery_info: {
          time_min: fullRestaurantData.delivery_info?.time_min || 0,
          time_max: fullRestaurantData.delivery_info?.time_max || 0,
          fee: fullRestaurantData.delivery_info?.fee || 0,
          min_order: fullRestaurantData.delivery_info?.min_order || 0,
          radius: fullRestaurantData.delivery_info?.radius || 5,
        },
        features: {
          is_pure_veg: fullRestaurantData.features?.is_pure_veg || false,
          is_featured: fullRestaurantData.features?.is_featured || false,
          is_promoted: fullRestaurantData.features?.is_promoted || false,
          has_delivery: fullRestaurantData.features?.has_delivery || false,
          has_dining: fullRestaurantData.features?.has_dining || false,
          has_takeaway: fullRestaurantData.features?.has_takeaway || false,
        },
        financials: {
          commission_rate: fullRestaurantData.financials?.commission_rate || 15,
          bank_details: {
            account_holder: fullRestaurantData.financials?.bank_details?.account_holder || "",
            account_number: fullRestaurantData.financials?.bank_details?.account_number || "",
            bank_name: fullRestaurantData.financials?.bank_details?.bank_name || "",
            ifsc_code: fullRestaurantData.financials?.bank_details?.ifsc_code || "",
            upi_id: fullRestaurantData.financials?.bank_details?.upi_id || "",
          },
        },
        legal: {
          gstin: fullRestaurantData.legal?.gstin || "",
          pan: fullRestaurantData.legal?.pan || "",
          fssai_license: fullRestaurantData.legal?.fssai_license || "",
        },
        settings: {
          auto_accept_orders: fullRestaurantData.settings?.auto_accept_orders || false,
          preparation_time: fullRestaurantData.settings?.preparation_time || 20,
          order_capacity: {
            per_hour: fullRestaurantData.settings?.order_capacity?.per_hour || 10,
            per_day: fullRestaurantData.settings?.order_capacity?.per_day || 100,
          },
        },
      })
      setShowEditDialog(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedRestaurant || !editFormData) return

    try {
      setEditLoading(true)
      const result = await updateRestaurant(selectedRestaurant._id, editFormData)
      if (result) {
        setShowEditDialog(false)
        setEditFormData(null)
        setSelectedRestaurant(null)
        await fetchRestaurants()
      }
    } catch (error) {
      console.error("Error saving restaurant:", error)
    } finally {
      setEditLoading(false)
    }
  }

  const handleApprovalAction = () => {
    if (!selectedRestaurant) return

    if (approvalAction === "approve") {
      approveRestaurant(selectedRestaurant._id)
    } else {
      if (!rejectionReason.trim()) {
        toast({
          title: "Error",
          description: "Please provide a reason for rejection.",
          variant: "destructive",
        })
        return
      }
      rejectRestaurant(selectedRestaurant._id, rejectionReason)
    }
  }

  const getStatusBadge = (status?: string) => {
    const safeStatus = status || "pending_approval"
    const statusConfig = {
      active: { variant: "default" as const, color: "bg-green-500/20 text-green-400 border-green-500/30" },
      pending_approval: {
        variant: "secondary" as const,
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      },
      rejected: { variant: "destructive" as const, color: "bg-red-500/20 text-red-400 border-red-500/30" },
      inactive: { variant: "outline" as const, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      suspended: { variant: "destructive" as const, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    }

    const config = statusConfig[safeStatus as keyof typeof statusConfig] || statusConfig.pending_approval

    return <Badge className={`${config.color} border font-medium`}>{safeStatus.replace("_", " ")}</Badge>
  }

  const getPriceRangeBadge = (level?: string) => {
    const safeLevel = level || "₹"
    const colors = {
      "₹": "bg-green-500/20 text-green-400 border-green-500/30",
      "₹₹": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "₹₹₹": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "₹₹₹₹": "bg-red-500/20 text-red-400 border-red-500/30",
    }

    return (
      <Badge className={`${colors[safeLevel as keyof typeof colors] || colors["₹"]} border font-medium`}>
        {safeLevel}
      </Badge>
    )
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      (restaurant?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant?.owner_id?.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant?.owner_id?.last_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === "all" || restaurant?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: restaurants.length,
    active: restaurants.filter((r) => r?.status === "active").length,
    pending: restaurants.filter((r) => r?.status === "pending_approval").length,
    avgRating:
      restaurants.length > 0
        ? (restaurants.reduce((sum, r) => sum + (r?.rating || 0), 0) / restaurants.length).toFixed(1)
        : "0.0",
  }

  // Error state
  if (error && !loading && restaurants.length === 0) {
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
                <h1 className="text-4xl font-bold text-white">Error Loading Restaurants</h1>
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
              onClick={fetchRestaurants}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Restaurants</h1>
              <p className="text-orange-200 mt-1">Manage restaurant applications and listings</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-orange-200">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Restaurant Management
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              Quality Control
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
                <p className="text-sm font-medium text-slate-400">Total Restaurants</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-green-400">Live data</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Store className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
                <p className="text-sm text-green-400">Currently serving</p>
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
                <p className="text-sm font-medium text-slate-400">Pending Approval</p>
                <p className="text-3xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-yellow-400">Needs review</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Avg Rating</p>
                <p className="text-3xl font-bold text-white">{stats.avgRating}</p>
                <p className="text-sm text-blue-400">Quality score</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Star className="h-6 w-6 text-blue-400" />
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
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={fetchRestaurants}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading restaurants...</p>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-12 text-center">
            <Store className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Restaurants Found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter
                ? "No restaurants match your current filters. Try adjusting your search criteria."
                : "No restaurants have been registered yet."}
            </p>
            {(searchTerm || statusFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
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
          {filteredRestaurants.map((restaurant) => (
            <Card
              key={restaurant._id}
              className="glass-effect border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                {restaurant?.banner_url ? (
                  <img
                    src={restaurant.banner_url || "/placeholder.svg"}
                    alt={restaurant?.name || "Restaurant"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.nextElementSibling?.classList.remove("hidden")
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center ${restaurant?.banner_url ? "hidden" : ""}`}
                >
                  <Store className="h-16 w-16 text-orange-400" />
                </div>
                <div className="absolute top-4 left-4">{getStatusBadge(restaurant?.status)}</div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {restaurant?.features?.is_pure_veg && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">Veg</Badge>
                  )}
                  {restaurant?.features?.is_featured && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">Featured</Badge>
                  )}
                  {restaurant?.features?.is_promoted && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border">Promoted</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {restaurant?.logo_url ? (
                      <img
                        src={restaurant.logo_url || "/placeholder.svg"}
                        alt={restaurant?.name || "Restaurant"}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg ${restaurant?.logo_url ? "hidden" : ""}`}
                    >
                      {(restaurant?.name || "R").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{restaurant?.name || "Unknown Restaurant"}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{restaurant?.rating || 0}</span>
                        <span>({restaurant?.total_reviews || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  {getPriceRangeBadge(restaurant?.price_range?.level)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>
                      {restaurant?.address?.city || "Unknown"}, {restaurant?.address?.state || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{restaurant?.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>
                      {restaurant?.delivery_info?.time_min || 0}-{restaurant?.delivery_info?.time_max || 0} mins
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(restaurant?.cuisine_types || []).slice(0, 3).map((cuisine) => (
                    <Badge key={cuisine} variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {cuisine}
                    </Badge>
                  ))}
                  {(restaurant?.cuisine_types || []).length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      +{(restaurant?.cuisine_types || []).length - 3}
                    </Badge>
                  )}
                </div>

                {/* Feature Toggles */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={restaurant?.features?.is_featured || false}
                      onCheckedChange={() => toggleFeatureStatus(restaurant, "is_featured")}
                      className="data-[state=checked]:bg-yellow-500"
                      disabled={actionLoading}
                    />
                    <span className="text-xs text-slate-300">Featured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={restaurant?.features?.is_pure_veg || false}
                      onCheckedChange={() => toggleFeatureStatus(restaurant, "is_pure_veg")}
                      className="data-[state=checked]:bg-green-500"
                      disabled={actionLoading}
                    />
                    <span className="text-xs text-slate-300">Pure Veg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={restaurant?.features?.has_delivery || false}
                      onCheckedChange={() => toggleFeatureStatus(restaurant, "has_delivery")}
                      className="data-[state=checked]:bg-blue-500"
                      disabled={actionLoading}
                    />
                    <span className="text-xs text-slate-300">Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={restaurant?.features?.has_dining || false}
                      onCheckedChange={() => toggleFeatureStatus(restaurant, "has_dining")}
                      className="data-[state=checked]:bg-purple-500"
                      disabled={actionLoading}
                    />
                    <span className="text-xs text-slate-300">Dine-in</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={restaurant?.status === "active"}
                      onCheckedChange={() => toggleRestaurantStatus(restaurant)}
                      className="data-[state=checked]:bg-orange-500"
                      disabled={actionLoading}
                    />
                    <span className="text-sm text-slate-300">
                      {restaurant?.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-orange-500 hover:text-orange-400"
                      onClick={() => handleViewRestaurant(restaurant)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-blue-500 hover:text-blue-400"
                      onClick={() => handleEditRestaurant(restaurant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-red-500 hover:text-red-400"
                      onClick={() => {
                        setSelectedRestaurant(restaurant)
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

      {/* Restaurant Details Dialog */}
      <Dialog open={showRestaurantDialog} onOpenChange={setShowRestaurantDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-slate-900 border-orange-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Store className="h-6 w-6 text-orange-400" />
              </div>
              Restaurant Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Complete information about {selectedRestaurant?.name || "this restaurant"}
            </DialogDescription>
          </DialogHeader>

          {selectedRestaurant && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-700">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="delivery"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Delivery
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Financial
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Store className="h-5 w-5 text-orange-400" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        {selectedRestaurant?.logo_url ? (
                          <img
                            src={selectedRestaurant.logo_url || "/placeholder.svg"}
                            alt={selectedRestaurant?.name || "Restaurant"}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-orange-500/30"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-orange-500/30 ${selectedRestaurant?.logo_url ? "hidden" : ""}`}
                        >
                          {(selectedRestaurant?.name || "R").charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedRestaurant?.name || "Unknown"}</h3>
                          <p className="text-slate-400 text-sm">{selectedRestaurant?.slug || "No slug"}</p>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white font-medium">{selectedRestaurant?.rating || 0}</span>
                            <span className="text-slate-400">({selectedRestaurant?.total_reviews || 0} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {selectedRestaurant?.description && (
                        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <h5 className="text-sm font-medium text-slate-400 mb-2">Description</h5>
                          <p className="text-slate-300 text-sm">{selectedRestaurant.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </span>
                          <span className="text-white font-medium">{selectedRestaurant?.email || "No email"}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone
                          </span>
                          <span className="text-white font-medium">{selectedRestaurant?.phone || "No phone"}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Status</span>
                          {getStatusBadge(selectedRestaurant?.status)}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Price Range</span>
                          <div className="flex items-center gap-2">
                            {getPriceRangeBadge(selectedRestaurant?.price_range?.level)}
                            <span className="text-slate-400 text-sm">
                              {selectedRestaurant?.price_range?.for_two || "Unknown"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400">Price Per Person</span>
                          <span className="text-white font-medium">
                            ₹{selectedRestaurant?.price_range?.min_per_person || 0} - ₹
                            {selectedRestaurant?.price_range?.max_per_person || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-400" />
                        Location & Owner
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h4 className="font-medium text-white mb-3">Address</h4>
                        <div className="text-slate-300 space-y-1">
                          <p>{selectedRestaurant?.address?.address_line_1 || "No address"}</p>
                          {selectedRestaurant?.address?.address_line_2 && (
                            <p>{selectedRestaurant.address.address_line_2}</p>
                          )}
                          <p>
                            {selectedRestaurant?.address?.city || "Unknown"},{" "}
                            {selectedRestaurant?.address?.state || "Unknown"}
                          </p>
                          <p>PIN: {selectedRestaurant?.address?.postal_code || "Unknown"}</p>
                          <p>Country: {selectedRestaurant?.address?.country || "India"}</p>
                          {selectedRestaurant?.address?.coordinates && (
                            <p className="text-xs text-slate-400">
                              Coordinates: {selectedRestaurant.address.coordinates[1]},{" "}
                              {selectedRestaurant.address.coordinates[0]}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h4 className="font-medium text-white mb-3">Owner Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Name</span>
                            <span className="text-white font-medium">
                              {selectedRestaurant?.owner_id?.first_name || "Unknown"}{" "}
                              {selectedRestaurant?.owner_id?.last_name || ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Email</span>
                            <span className="text-white font-medium">
                              {selectedRestaurant?.owner_id?.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h4 className="font-medium text-white mb-3">Cuisine Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {(selectedRestaurant?.cuisine_types || []).map((cuisine) => (
                            <Badge
                              key={cuisine}
                              className="bg-orange-500/20 text-orange-400 border-orange-500/30 border"
                            >
                              {cuisine}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {selectedRestaurant?.rejection_reason && (
                        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                          <h4 className="font-medium text-red-400 mb-2">Rejection Reason</h4>
                          <p className="text-red-300 text-sm">{selectedRestaurant.rejection_reason}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6 mt-6">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white">Restaurant Images</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedRestaurant?.banner_url && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <h5 className="text-sm font-medium text-slate-400 mb-3">Banner Image</h5>
                          <img
                            src={selectedRestaurant.banner_url || "/placeholder.svg"}
                            alt="Restaurant banner"
                            className="w-full h-64 object-cover rounded-lg border-2 border-orange-500/30"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=256&width=800"
                            }}
                          />
                        </div>
                      )}

                      {(selectedRestaurant?.gallery_images || []).map((image, index) => (
                        <div key={image._id || index} className="space-y-2">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.caption || `Gallery image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-slate-700/50 hover:border-orange-500/50 transition-colors"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=192&width=256"
                            }}
                          />
                          {image.caption && <p className="text-sm text-slate-400">{image.caption}</p>}
                          {image.uploaded_at && (
                            <p className="text-xs text-slate-500">
                              Uploaded: {new Date(image.uploaded_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}

                      {(!selectedRestaurant?.gallery_images || selectedRestaurant.gallery_images.length === 0) && (
                        <div className="col-span-full text-center py-8">
                          <p className="text-slate-400">No gallery images available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-6 mt-6">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Truck className="h-5 w-5 text-orange-400" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Delivery Time</span>
                            <span className="text-white font-medium">
                              {selectedRestaurant?.delivery_info?.time_min || 0}-
                              {selectedRestaurant?.delivery_info?.time_max || 0} mins
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Average Time</span>
                            <span className="text-white font-medium">
                              {selectedRestaurant?.delivery_info?.average_time ||
                                Math.round(
                                  ((selectedRestaurant?.delivery_info?.time_min || 0) +
                                    (selectedRestaurant?.delivery_info?.time_max || 0)) /
                                    2,
                                )}{" "}
                              mins
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Delivery Fee</span>
                            <span className="text-white font-medium">
                              ₹{selectedRestaurant?.delivery_info?.fee || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Minimum Order</span>
                            <span className="text-white font-medium">
                              ₹{selectedRestaurant?.delivery_info?.min_order || 0}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Service Radius</span>
                            <span className="text-white font-medium">
                              {selectedRestaurant?.delivery_info?.radius || 5} km
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6 mt-6">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-orange-400" />
                      Restaurant Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Utensils className="h-4 w-4" />
                          Pure Vegetarian
                        </span>
                        <Badge
                          className={
                            selectedRestaurant?.features?.is_pure_veg
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {selectedRestaurant?.features?.is_pure_veg ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Featured Restaurant
                        </span>
                        <Badge
                          className={
                            selectedRestaurant?.features?.is_featured
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {selectedRestaurant?.features?.is_featured ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Delivery Available
                        </span>
                        <Badge
                          className={
                            selectedRestaurant?.features?.has_delivery
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {selectedRestaurant?.features?.has_delivery ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Dine-in Available
                        </span>
                        <Badge
                          className={
                            selectedRestaurant?.features?.has_dining
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {selectedRestaurant?.features?.has_dining ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          Takeaway Available
                        </span>
                        <Badge
                          className={
                            selectedRestaurant?.features?.has_takeaway
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {selectedRestaurant?.features?.has_takeaway ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Promoted
                        </span>
                        <Badge
                          className={
                            selectedRestaurant?.features?.is_promoted
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {selectedRestaurant?.features?.is_promoted ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-orange-400" />
                        Financial Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Commission Rate</span>
                          <span className="text-white font-medium">
                            {selectedRestaurant?.financials?.commission_rate || 15}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-orange-400" />
                        Bank Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Account Holder</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.financials?.bank_details?.account_holder || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Account Number</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.financials?.bank_details?.account_number
                            ? `****${selectedRestaurant.financials.bank_details.account_number.slice(-4)}`
                            : "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Bank Name</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.financials?.bank_details?.bank_name || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">IFSC Code</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.financials?.bank_details?.ifsc_code || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">UPI ID</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.financials?.bank_details?.upi_id || "Not provided"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-slate-700/50 lg:col-span-2">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-400" />
                        Legal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <h5 className="text-sm font-medium text-slate-400 mb-2">GSTIN</h5>
                          <p className="text-white font-medium">{selectedRestaurant?.legal?.gstin || "Not provided"}</p>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <h5 className="text-sm font-medium text-slate-400 mb-2">PAN</h5>
                          <p className="text-white font-medium">{selectedRestaurant?.legal?.pan || "Not provided"}</p>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <h5 className="text-sm font-medium text-slate-400 mb-2">FSSAI License</h5>
                          <p className="text-white font-medium">
                            {selectedRestaurant?.legal?.fssai_license || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="h-5 w-5 text-orange-400" />
                        Restaurant Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300">Auto Accept Orders</span>
                        <Badge
                          className={
                            selectedRestaurant?.settings?.auto_accept_orders
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {selectedRestaurant?.settings?.auto_accept_orders ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300">Preparation Time</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.settings?.preparation_time || 20} minutes
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-slate-700/50">
                    <CardHeader className="border-b border-slate-700/50">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-400" />
                        Order Capacity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300">Per Hour</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.settings?.order_capacity?.per_hour || 10} orders
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300">Per Day</span>
                        <span className="text-white font-medium">
                          {selectedRestaurant?.settings?.order_capacity?.per_day || 100} orders
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedRestaurant?.opening_hours && selectedRestaurant.opening_hours.length > 0 && (
                    <Card className="glass-effect border-slate-700/50 lg:col-span-2">
                      <CardHeader className="border-b border-slate-700/50">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-orange-400" />
                          Opening Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedRestaurant.opening_hours.map((daySchedule, index) => (
                            <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                              <h5 className="text-sm font-medium text-slate-400 mb-2 capitalize">{daySchedule.day}</h5>
                              <div className="space-y-2">
                                {daySchedule.slots.map((slot, slotIndex) => (
                                  <div key={slotIndex} className="flex items-center justify-between">
                                    <span className="text-slate-300 text-sm capitalize">{slot.type}</span>
                                    <span className="text-white font-medium text-sm">
                                      {slot.open} - {slot.close}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" onClick={() => setShowRestaurantDialog(false)} className="border-slate-600">
              Close
            </Button>
            {selectedRestaurant?.status === "pending_approval" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setApprovalAction("reject")
                    setShowApprovalDialog(true)
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={() => {
                    setApprovalAction("approve")
                    setShowApprovalDialog(true)
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            <Button
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={() => handleEditRestaurant(selectedRestaurant!)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Restaurant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Restaurant Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-orange-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Edit className="h-6 w-6 text-orange-400" />
              </div>
              Edit Restaurant
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Update restaurant information for {selectedRestaurant?.name || "this restaurant"}
            </DialogDescription>
          </DialogHeader>

          {editFormData && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
                <TabsTrigger value="basic" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="delivery"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Delivery
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Financial
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit_name" className="text-slate-300">
                        Restaurant Name
                      </Label>
                      <Input
                        id="edit_name"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_description" className="text-slate-300">
                        Description
                      </Label>
                      <Textarea
                        id="edit_description"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_email" className="text-slate-300">
                        Email
                      </Label>
                      <Input
                        id="edit_email"
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_phone" className="text-slate-300">
                        Phone
                      </Label>
                      <Input
                        id="edit_phone"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_cuisine" className="text-slate-300">
                        Cuisine Types (comma separated)
                      </Label>
                      <Input
                        id="edit_cuisine"
                        value={editFormData.cuisine_types.join(", ")}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            cuisine_types: e.target.value.split(",").map((item) => item.trim()),
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit_address" className="text-slate-300">
                        Address Line 1
                      </Label>
                      <Input
                        id="edit_address"
                        value={editFormData.address.address_line_1}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            address: { ...editFormData.address, address_line_1: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_address2" className="text-slate-300">
                        Address Line 2
                      </Label>
                      <Input
                        id="edit_address2"
                        value={editFormData.address.address_line_2}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            address: { ...editFormData.address, address_line_2: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit_city" className="text-slate-300">
                          City
                        </Label>
                        <Input
                          id="edit_city"
                          value={editFormData.address.city}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              address: { ...editFormData.address, city: e.target.value },
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit_state" className="text-slate-300">
                          State
                        </Label>
                        <Input
                          id="edit_state"
                          value={editFormData.address.state}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              address: { ...editFormData.address, state: e.target.value },
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit_postal" className="text-slate-300">
                        Postal Code
                      </Label>
                      <Input
                        id="edit_postal"
                        value={editFormData.address.postal_code}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            address: { ...editFormData.address, postal_code: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Price Range</h4>
                      <div>
                        <Label htmlFor="edit_price_level" className="text-slate-300">
                          Price Level
                        </Label>
                        <Select
                          value={editFormData.price_range.level}
                          onValueChange={(value) =>
                            setEditFormData({
                              ...editFormData,
                              price_range: { ...editFormData.price_range, level: value },
                            })
                          }
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="₹">₹ - Budget</SelectItem>
                            <SelectItem value="₹₹">₹₹ - Moderate</SelectItem>
                            <SelectItem value="₹₹₹">₹₹₹ - Expensive</SelectItem>
                            <SelectItem value="₹₹₹₹">₹₹₹₹ - Very Expensive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit_min_price" className="text-slate-300">
                            Min Per Person (₹)
                          </Label>
                          <Input
                            id="edit_min_price"
                            type="number"
                            value={editFormData.price_range.min_per_person}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                price_range: {
                                  ...editFormData.price_range,
                                  min_per_person: Number.parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit_max_price" className="text-slate-300">
                            Max Per Person (₹)
                          </Label>
                          <Input
                            id="edit_max_price"
                            type="number"
                            value={editFormData.price_range.max_per_person}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                price_range: {
                                  ...editFormData.price_range,
                                  max_per_person: Number.parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="edit_for_two" className="text-slate-300">
                          Price for Two
                        </Label>
                        <Input
                          id="edit_for_two"
                          value={editFormData.price_range.for_two}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              price_range: { ...editFormData.price_range, for_two: e.target.value },
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editFormData.features.is_pure_veg}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            features: { ...editFormData.features, is_pure_veg: checked },
                          })
                        }
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label className="text-slate-300">Pure Veg</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editFormData.features.is_featured}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            features: { ...editFormData.features, is_featured: checked },
                          })
                        }
                        className="data-[state=checked]:bg-yellow-500"
                      />
                      <Label className="text-slate-300">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editFormData.features.is_promoted}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            features: { ...editFormData.features, is_promoted: checked },
                          })
                        }
                        className="data-[state=checked]:bg-purple-500"
                      />
                      <Label className="text-slate-300">Promoted</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editFormData.features.has_delivery}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            features: { ...editFormData.features, has_delivery: checked },
                          })
                        }
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label className="text-slate-300">Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editFormData.features.has_dining}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            features: { ...editFormData.features, has_dining: checked },
                          })
                        }
                        className="data-[state=checked]:bg-purple-500"
                      />
                      <Label className="text-slate-300">Dine-in</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editFormData.features.has_takeaway}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            features: { ...editFormData.features, has_takeaway: checked },
                          })
                        }
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label className="text-slate-300">Takeaway</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Delivery Info</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit_time_min" className="text-slate-300">
                          Min Time (mins)
                        </Label>
                        <Input
                          id="edit_time_min"
                          type="number"
                          value={editFormData.delivery_info.time_min}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              delivery_info: {
                                ...editFormData.delivery_info,
                                time_min: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit_time_max" className="text-slate-300">
                          Max Time (mins)
                        </Label>
                        <Input
                          id="edit_time_max"
                          type="number"
                          value={editFormData.delivery_info.time_max}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              delivery_info: {
                                ...editFormData.delivery_info,
                                time_max: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit_fee" className="text-slate-300">
                          Delivery Fee (₹)
                        </Label>
                        <Input
                          id="edit_fee"
                          type="number"
                          value={editFormData.delivery_info.fee}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              delivery_info: {
                                ...editFormData.delivery_info,
                                fee: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit_min_order" className="text-slate-300">
                          Min Order (₹)
                        </Label>
                        <Input
                          id="edit_min_order"
                          type="number"
                          value={editFormData.delivery_info.min_order}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              delivery_info: {
                                ...editFormData.delivery_info,
                                min_order: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit_radius" className="text-slate-300">
                        Service Radius (km)
                      </Label>
                      <Input
                        id="edit_radius"
                        type="number"
                        value={editFormData.delivery_info.radius}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            delivery_info: {
                              ...editFormData.delivery_info,
                              radius: Number.parseInt(e.target.value) || 5,
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Commission</h4>
                    <div>
                      <Label htmlFor="edit_commission" className="text-slate-300">
                        Commission Rate (%)
                      </Label>
                      <Input
                        id="edit_commission"
                        type="number"
                        value={editFormData.financials.commission_rate}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            financials: {
                              ...editFormData.financials,
                              commission_rate: Number.parseInt(e.target.value) || 15,
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>

                    <h4 className="text-lg font-semibold text-white">Legal Information</h4>
                    <div>
                      <Label htmlFor="edit_gstin" className="text-slate-300">
                        GSTIN
                      </Label>
                      <Input
                        id="edit_gstin"
                        value={editFormData.legal.gstin}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            legal: { ...editFormData.legal, gstin: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_pan" className="text-slate-300">
                        PAN
                      </Label>
                      <Input
                        id="edit_pan"
                        value={editFormData.legal.pan}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            legal: { ...editFormData.legal, pan: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_fssai" className="text-slate-300">
                        FSSAI License
                      </Label>
                      <Input
                        id="edit_fssai"
                        value={editFormData.legal.fssai_license}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            legal: { ...editFormData.legal, fssai_license: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Bank Details</h4>
                    <div>
                      <Label htmlFor="edit_account_holder" className="text-slate-300">
                        Account Holder
                      </Label>
                      <Input
                        id="edit_account_holder"
                        value={editFormData.financials.bank_details.account_holder}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            financials: {
                              ...editFormData.financials,
                              bank_details: {
                                ...editFormData.financials.bank_details,
                                account_holder: e.target.value,
                              },
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_account_number" className="text-slate-300">
                        Account Number
                      </Label>
                      <Input
                        id="edit_account_number"
                        value={editFormData.financials.bank_details.account_number}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            financials: {
                              ...editFormData.financials,
                              bank_details: {
                                ...editFormData.financials.bank_details,
                                account_number: e.target.value,
                              },
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_bank_name" className="text-slate-300">
                        Bank Name
                      </Label>
                      <Input
                        id="edit_bank_name"
                        value={editFormData.financials.bank_details.bank_name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            financials: {
                              ...editFormData.financials,
                              bank_details: {
                                ...editFormData.financials.bank_details,
                                bank_name: e.target.value,
                              },
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_ifsc" className="text-slate-300">
                        IFSC Code
                      </Label>
                      <Input
                        id="edit_ifsc"
                        value={editFormData.financials.bank_details.ifsc_code}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            financials: {
                              ...editFormData.financials,
                              bank_details: {
                                ...editFormData.financials.bank_details,
                                ifsc_code: e.target.value,
                              },
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_upi" className="text-slate-300">
                        UPI ID
                      </Label>
                      <Input
                        id="edit_upi"
                        value={editFormData.financials.bank_details.upi_id}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            financials: {
                              ...editFormData.financials,
                              bank_details: {
                                ...editFormData.financials.bank_details,
                                upi_id: e.target.value,
                              },
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Restaurant Settings</h4>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editFormData.settings.auto_accept_orders}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            settings: { ...editFormData.settings, auto_accept_orders: checked },
                          })
                        }
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label className="text-slate-300">Auto Accept Orders</Label>
                    </div>
                    <div>
                      <Label htmlFor="edit_prep_time" className="text-slate-300">
                        Preparation Time (minutes)
                      </Label>
                      <Input
                        id="edit_prep_time"
                        type="number"
                        value={editFormData.settings.preparation_time}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            settings: {
                              ...editFormData.settings,
                              preparation_time: Number.parseInt(e.target.value) || 20,
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Order Capacity</h4>
                    <div>
                      <Label htmlFor="edit_capacity_hour" className="text-slate-300">
                        Orders Per Hour
                      </Label>
                      <Input
                        id="edit_capacity_hour"
                        type="number"
                        value={editFormData.settings.order_capacity.per_hour}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            settings: {
                              ...editFormData.settings,
                              order_capacity: {
                                ...editFormData.settings.order_capacity,
                                per_hour: Number.parseInt(e.target.value) || 10,
                              },
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_capacity_day" className="text-slate-300">
                        Orders Per Day
                      </Label>
                      <Input
                        id="edit_capacity_day"
                        type="number"
                        value={editFormData.settings.order_capacity.per_day}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            settings: {
                              ...editFormData.settings,
                              order_capacity: {
                                ...editFormData.settings.order_capacity,
                                per_day: Number.parseInt(e.target.value) || 100,
                              },
                            },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false)
                setEditFormData(null)
              }}
              className="border-slate-600"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={editLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {editLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="bg-slate-900 border-orange-500/30 border-2">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {approvalAction === "approve" ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              {approvalAction === "approve" ? "Approve Restaurant" : "Reject Restaurant"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {approvalAction === "approve"
                ? "Are you sure you want to approve this restaurant? They will be notified via email."
                : "Please provide a reason for rejecting this restaurant application."}
            </DialogDescription>
          </DialogHeader>
          {selectedRestaurant && (
            <div className="py-4">
              <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white">{selectedRestaurant?.name || "Unknown"}</h4>
                <p className="text-sm text-slate-400">
                  Owner: {selectedRestaurant?.owner_id?.first_name || "Unknown"}{" "}
                  {selectedRestaurant?.owner_id?.last_name || ""}
                </p>
              </div>
              {approvalAction === "reject" && (
                <div className="space-y-2">
                  <Label htmlFor="rejection_reason" className="text-slate-300">
                    Rejection Reason
                  </Label>
                  <Textarea
                    id="rejection_reason"
                    placeholder="Please provide a detailed reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              variant={approvalAction === "approve" ? "default" : "destructive"}
              onClick={handleApprovalAction}
              disabled={actionLoading || (approvalAction === "reject" && !rejectionReason.trim())}
              className={
                approvalAction === "approve"
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : ""
              }
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : approvalAction === "approve" ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              {approvalAction === "approve" ? "Approve" : "Reject"}
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
              Delete Restaurant
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this restaurant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRestaurant && (
            <div className="py-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white">{selectedRestaurant?.name || "Unknown"}</h4>
                <p className="text-sm text-slate-400">
                  Owner: {selectedRestaurant?.owner_id?.first_name || "Unknown"}{" "}
                  {selectedRestaurant?.owner_id?.last_name || ""}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRestaurant && deleteRestaurant(selectedRestaurant._id)}
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
