"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Mail,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Edit,
  Save,
  Bell,
  Lock,
  Activity,
  Award,
  TrendingUp,
  User,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Crown,
  Gift,
} from "lucide-react"

interface UserProfile {
  _id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar_url?: string
  bio?: string
  location?: string
  role: string
  status: string
  email_verified: boolean
  phone_verified: boolean
  loyalty_points: number
  membership_level: string
  total_orders: number
  total_spent: number
  favorites: string[]
  device_tokens: string[]
  addresses: any[]
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    dietary: string[]
    language: string
  }
  created_at: string
  updated_at: string
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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const [profileData, setProfileData] = useState<UserProfile | null>(null)

  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()
      if (!token) {
        // Use mock data for demo
        const mockProfile: UserProfile = {
          _id: "admin_001",
          first_name: "Admin",
          last_name: "User",
          email: "admin@feasto.com",
          phone: "+91 9876543210",
          bio: "Experienced food delivery platform administrator with 5+ years in the industry.",
          location: "Mumbai, Maharashtra",
          role: "admin",
          status: "active",
          email_verified: true,
          phone_verified: true,
          loyalty_points: 2500,
          membership_level: "gold",
          total_orders: 0,
          total_spent: 0,
          favorites: [],
          device_tokens: [],
          addresses: [],
          preferences: {
            notifications: {
              email: true,
              sms: true,
              push: true,
            },
            dietary: [],
            language: "en",
          },
          created_at: "2020-01-15T00:00:00.000Z",
          updated_at: new Date().toISOString(),
        }
        setProfileData(mockProfile)
        setEditFormData({
          first_name: mockProfile.first_name || "",
          last_name: mockProfile.last_name || "",
          email: mockProfile.email || "",
          phone: mockProfile.phone || "",
          bio: mockProfile.bio || "",
          location: mockProfile.location || "",
        })
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.")
        }
        throw new Error(`Failed to fetch profile: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API Response:", data) // Debug log

      // Handle the nested response structure
      let profile: UserProfile
      if (data.success && data.data && data.data.user) {
        profile = data.data.user
      } else if (data.data && data.data.user) {
        profile = data.data.user
      } else if (data.user) {
        profile = data.user
      } else if (data.data) {
        profile = data.data
      } else {
        profile = data
      }

      console.log("Parsed Profile:", profile) // Debug log

      setProfileData(profile)
      setEditFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
      })
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      setError(error.message || "Failed to load profile")
      toast({
        title: "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)

      const token = getAuthToken()
      if (!token) {
        // For demo, just update local state
        if (profileData) {
          setProfileData({
            ...profileData,
            ...editFormData,
            updated_at: new Date().toISOString(),
          })
        }
        setIsEditing(false)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setSaving(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`)
      }

      const data = await response.json()
      const updatedProfile = data.data?.user || data.data || data

      setProfileData(updatedProfile)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (profileData) {
      setEditFormData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        location: profileData.location || "",
      })
    }
    setIsEditing(false)
  }

  // Get initials for avatar fallback - first letter of first name
  const getInitials = () => {
    if (profileData?.first_name && typeof profileData.first_name === "string" && profileData.first_name.length > 0) {
      return profileData.first_name.charAt(0).toUpperCase()
    }
    return "A"
  }

  // Safe role display function
  const getRoleDisplay = (role: string) => {
    if (!role || typeof role !== "string") return "Admin"
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Safe string handling for undefined values
  const safeString = (value: any) => {
    return value && typeof value === "string" ? value : ""
  }

  // Get membership badge
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

  // Calculate stats based on profile data
  const getStats = () => {
    if (!profileData) {
      return [
        { label: "Total Orders", value: "0", icon: Activity, color: "text-blue-400" },
        { label: "Total Spent", value: "₹0", icon: TrendingUp, color: "text-green-400" },
        { label: "Loyalty Points", value: "0", icon: Gift, color: "text-purple-400" },
        { label: "Member Since", value: "0 days", icon: Calendar, color: "text-orange-400" },
      ]
    }

    const memberSince = Math.floor((Date.now() - new Date(profileData.created_at).getTime()) / (1000 * 60 * 60 * 24))

    return [
      { label: "Total Orders", value: profileData.total_orders.toString(), icon: Activity, color: "text-blue-400" },
      {
        label: "Total Spent",
        value: `₹${profileData.total_spent.toLocaleString()}`,
        icon: TrendingUp,
        color: "text-green-400",
      },
      {
        label: "Loyalty Points",
        value: profileData.loyalty_points.toLocaleString(),
        icon: Gift,
        color: "text-purple-400",
      },
      { label: "Member Since", value: `${memberSince} days`, icon: Calendar, color: "text-orange-400" },
    ]
  }

  const stats = getStats()

  const recentActivities = [
    {
      action: "Profile updated",
      target: "Personal Information",
      time: "Just now",
      type: "profile",
    },
    {
      action: "Login successful",
      target: "Admin Dashboard",
      time: "2 hours ago",
      type: "auth",
    },
    {
      action: "Password changed",
      target: "Security Settings",
      time: "1 day ago",
      type: "security",
    },
    {
      action: "Account created",
      target: "Registration",
      time: profileData
        ? `${Math.floor((Date.now() - new Date(profileData.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`
        : "Unknown",
      type: "account",
    },
  ]

  const permissions = [
    { name: "User Management", granted: true },
    { name: "Restaurant Management", granted: true },
    { name: "Order Management", granted: true },
    { name: "Payment Processing", granted: true },
    { name: "Analytics Access", granted: true },
    { name: "System Settings", granted: profileData?.role === "super_admin" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error && !profileData) {
    return (
      <div className="space-y-8">
        <Card className="glass-effect border-red-500/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Profile</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button onClick={fetchProfile} className="bg-gradient-to-r from-indigo-500 to-purple-500">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">No profile data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white/20">
              <AvatarImage src={profileData.avatar_url || "/images/Profile.png"} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              disabled={isEditing}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              {profileData.first_name} {profileData.last_name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-indigo-200">{getRoleDisplay(profileData.role)} Administrator</p>
              {getMembershipBadge(profileData.membership_level)}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-indigo-200 flex-wrap">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {profileData.email}
                {profileData.email_verified && <CheckCircle className="h-3 w-3 text-green-400" />}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {profileData.phone}
                {profileData.phone_verified && <CheckCircle className="h-3 w-3 text-green-400" />}
              </div>
              {profileData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profileData.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {new Date(profileData.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isEditing ? (
                <Save className="h-4 w-4 mr-2" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-effect border-slate-700/50 hover:border-indigo-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-opacity-20 ${stat.color.replace("text-", "bg-")}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="personal" className="data-[state=active]:bg-indigo-500">
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-indigo-500">
            Activity
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-indigo-500">
            Permissions
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-indigo-500">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-slate-400">Update your personal details and bio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={isEditing ? editFormData.first_name : profileData.first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-800/50 border-slate-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={isEditing ? editFormData.last_name : profileData.last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-800/50 border-slate-600 text-white disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editFormData.email : profileData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-600 text-white disabled:opacity-60 pr-10"
                    />
                    {profileData.email_verified && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      value={isEditing ? editFormData.phone : profileData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-600 text-white disabled:opacity-60 pr-10"
                    />
                    {profileData.phone_verified && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-300">
                  Location
                </Label>
                <Input
                  id="location"
                  value={isEditing ? editFormData.location : profileData.location || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your location"
                  className="bg-slate-800/50 border-slate-600 text-white disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-300">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={isEditing ? editFormData.bio : profileData.bio || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className="bg-slate-800/50 border-slate-600 text-white disabled:opacity-60 min-h-[100px]"
                />
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Role:</span>
                    <span className="text-white ml-2">{getRoleDisplay(profileData.role)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <span className="text-white ml-2 capitalize">{profileData.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Account ID:</span>
                    <span className="text-white ml-2 font-mono">{profileData._id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Membership:</span>
                    <span className="text-white ml-2 capitalize">{profileData.membership_level}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Created:</span>
                    <span className="text-white ml-2">{new Date(profileData.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Updated:</span>
                    <span className="text-white ml-2">{new Date(profileData.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-400" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-slate-400">Your recent actions and system interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-sm text-slate-400">{activity.target}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-400" />
                Access Permissions
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your current system permissions and access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-slate-400" />
                      <span className="text-white">{permission.name}</span>
                    </div>
                    <Badge
                      variant={permission.granted ? "default" : "secondary"}
                      className={
                        permission.granted
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }
                    >
                      {permission.granted ? "Granted" : "Restricted"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-400" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-slate-400">Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Disabled
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-slate-400">Receive email notifications</p>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className={
                      profileData.preferences.notifications.email
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {profileData.preferences.notifications.email ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">SMS Notifications</p>
                      <p className="text-sm text-slate-400">Receive SMS notifications</p>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className={
                      profileData.preferences.notifications.sms
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {profileData.preferences.notifications.sms ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-sm text-slate-400">Receive push notifications</p>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className={
                      profileData.preferences.notifications.push
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {profileData.preferences.notifications.push ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Email Verification</p>
                      <p className="text-sm text-slate-400">Verify your email address</p>
                    </div>
                  </div>
                  <Badge
                    variant={profileData.email_verified ? "default" : "secondary"}
                    className={
                      profileData.email_verified
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {profileData.email_verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Phone Verification</p>
                      <p className="text-sm text-slate-400">Verify your phone number</p>
                    </div>
                  </div>
                  <Badge
                    variant={profileData.phone_verified ? "default" : "secondary"}
                    className={
                      profileData.phone_verified
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {profileData.phone_verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/20">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
