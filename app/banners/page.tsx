"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Eye,
  MoreHorizontal,
  ImageIcon,
  Calendar,
  Target,
  Monitor,
  Smartphone,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Banner {
  _id: string
  title: string
  description: string
  image_url: string
  mobile_image_url?: string
  link_url?: string
  button_text?: string
  position: "hero" | "sidebar" | "footer" | "popup"
  target_audience: "all" | "customers" | "restaurants" | "delivery_partners"
  is_active: boolean
  start_date: string
  end_date?: string
  click_count: number
  impression_count: number
  created_at: string
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [positionFilter, setPositionFilter] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    image_url: "",
    mobile_image_url: "",
    link_url: "",
    button_text: "",
    position: "hero" as const,
    target_audience: "all" as const,
    is_active: true,
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/banners", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBanners(data.data.banners)
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      // Mock data for demo
      setBanners([
        {
          _id: "1",
          title: "Summer Food Festival",
          description: "Get 30% off on all orders above ₹500",
          image_url: "/placeholder.svg?height=300&width=800",
          mobile_image_url: "/placeholder.svg?height=200&width=400",
          link_url: "/offers/summer-festival",
          button_text: "Order Now",
          position: "hero",
          target_audience: "customers",
          is_active: true,
          start_date: "2024-01-01",
          end_date: "2024-01-31",
          click_count: 1250,
          impression_count: 15600,
          created_at: new Date().toISOString(),
        },
        {
          _id: "2",
          title: "Partner with Us",
          description: "Join our platform and grow your restaurant business",
          image_url: "/placeholder.svg?height=300&width=800",
          link_url: "/partner/register",
          button_text: "Join Now",
          position: "sidebar",
          target_audience: "restaurants",
          is_active: true,
          start_date: "2024-01-01",
          click_count: 890,
          impression_count: 12400,
          created_at: new Date().toISOString(),
        },
        {
          _id: "3",
          title: "Delivery Partner Recruitment",
          description: "Earn flexible income as a delivery partner",
          image_url: "/placeholder.svg?height=300&width=800",
          link_url: "/delivery/signup",
          button_text: "Apply Now",
          position: "footer",
          target_audience: "delivery_partners",
          is_active: false,
          start_date: "2024-01-01",
          end_date: "2024-01-15",
          click_count: 456,
          impression_count: 8900,
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBanner = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/banners", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBanner),
      })

      if (response.ok) {
        fetchBanners()
        setShowCreateDialog(false)
        setNewBanner({
          title: "",
          description: "",
          image_url: "",
          mobile_image_url: "",
          link_url: "",
          button_text: "",
          position: "hero",
          target_audience: "all",
          is_active: true,
          start_date: "",
          end_date: "",
        })
      }
    } catch (error) {
      console.error("Error creating banner:", error)
    }
  }

  const getPositionBadge = (position: string) => {
    const colors = {
      hero: "bg-blue-500/20 text-blue-400",
      sidebar: "bg-green-500/20 text-green-400",
      footer: "bg-purple-500/20 text-purple-400",
      popup: "bg-orange-500/20 text-orange-400",
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[position as keyof typeof colors]}`}>
        {position}
      </span>
    )
  }

  const getAudienceBadge = (audience: string) => {
    const colors = {
      all: "bg-gray-500/20 text-gray-400",
      customers: "bg-blue-500/20 text-blue-400",
      restaurants: "bg-green-500/20 text-green-400",
      delivery_partners: "bg-purple-500/20 text-purple-400",
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[audience as keyof typeof colors]}`}>
        {audience.replace("_", " ")}
      </span>
    )
  }

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = !positionFilter || banner.position === positionFilter
    return matchesSearch && matchesPosition
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900 via-rose-900 to-red-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Banner Management</h1>
              <p className="text-pink-200 mt-1">Create and manage promotional banners across the platform</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-pink-200">
            <div className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4" />
              {banners.length} Total Banners
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {banners.filter((b) => b.is_active).length} Active
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-80 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="hero">Hero</SelectItem>
              <SelectItem value="sidebar">Sidebar</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
              <SelectItem value="popup">Popup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Banner
        </Button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading banners...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanners.map((banner) => (
            <Card
              key={banner._id}
              className="glass-effect border-slate-700/50 hover:border-pink-500/30 transition-all duration-300 group overflow-hidden"
            >
              <div className="relative">
                <img
                  src={banner.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-600">
                      <DropdownMenuLabel className="text-slate-300">Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="text-slate-300 hover:bg-slate-700"
                        onClick={() => {
                          setSelectedBanner(banner)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-600" />
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                  {getPositionBadge(banner.position)}
                  {!banner.is_active && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">Inactive</span>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 flex gap-2">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-white text-xs">
                    <Monitor className="h-3 w-3" />
                    Desktop
                  </div>
                  {banner.mobile_image_url && (
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-white text-xs">
                      <Smartphone className="h-3 w-3" />
                      Mobile
                    </div>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">{banner.title}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{banner.description}</p>
                <div className="flex items-center justify-between mb-3">
                  {getAudienceBadge(banner.target_audience)}
                  {banner.button_text && (
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                      "{banner.button_text}"
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                  <div>
                    <span className="block">Clicks</span>
                    <span className="text-white font-medium">{banner.click_count.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block">Impressions</span>
                    <span className="text-white font-medium">{banner.impression_count.toLocaleString()}</span>
                  </div>
                </div>
                {banner.end_date && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      Ends: {new Date(banner.end_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Banner Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Banner</DialogTitle>
            <DialogDescription className="text-slate-400">
              Design and configure a new promotional banner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Banner Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Food Festival"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button_text" className="text-slate-300">
                  Button Text (Optional)
                </Label>
                <Input
                  id="button_text"
                  placeholder="e.g., Order Now"
                  value={newBanner.button_text}
                  onChange={(e) => setNewBanner({ ...newBanner, button_text: e.target.value })}
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
                placeholder="Brief description of the banner"
                value={newBanner.description}
                onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-slate-300">
                  Desktop Image URL
                </Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/banner.jpg"
                  value={newBanner.image_url}
                  onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_image_url" className="text-slate-300">
                  Mobile Image URL (Optional)
                </Label>
                <Input
                  id="mobile_image_url"
                  placeholder="https://example.com/mobile-banner.jpg"
                  value={newBanner.mobile_image_url}
                  onChange={(e) => setNewBanner({ ...newBanner, mobile_image_url: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_url" className="text-slate-300">
                Link URL (Optional)
              </Label>
              <Input
                id="link_url"
                placeholder="/offers/summer-festival"
                value={newBanner.link_url}
                onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-slate-300">
                  Position
                </Label>
                <Select
                  value={newBanner.position}
                  onValueChange={(value: any) => setNewBanner({ ...newBanner, position: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_audience" className="text-slate-300">
                  Target Audience
                </Label>
                <Select
                  value={newBanner.target_audience}
                  onValueChange={(value: any) => setNewBanner({ ...newBanner, target_audience: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                    <SelectItem value="delivery_partners">Delivery Partners</SelectItem>
                  </SelectContent>
                </Select>
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
                  value={newBanner.start_date}
                  onChange={(e) => setNewBanner({ ...newBanner, start_date: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-slate-300">
                  End Date (Optional)
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={newBanner.end_date}
                  onChange={(e) => setNewBanner({ ...newBanner, end_date: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newBanner.is_active}
                onCheckedChange={(checked) => setNewBanner({ ...newBanner, is_active: checked })}
              />
              <Label className="text-slate-300">{newBanner.is_active ? "Active" : "Inactive"}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              onClick={handleCreateBanner}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Banner Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Banner</DialogTitle>
            <DialogDescription className="text-slate-400">Update banner information and settings</DialogDescription>
          </DialogHeader>
          {selectedBanner && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_title" className="text-slate-300">
                    Banner Title
                  </Label>
                  <Input
                    id="edit_title"
                    value={selectedBanner.title}
                    onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_button_text" className="text-slate-300">
                    Button Text
                  </Label>
                  <Input
                    id="edit_button_text"
                    value={selectedBanner.button_text || ""}
                    onChange={(e) => setSelectedBanner({ ...selectedBanner, button_text: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="edit_description"
                  value={selectedBanner.description}
                  onChange={(e) => setSelectedBanner({ ...selectedBanner, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4">
                <h4 className="font-medium text-white mb-4">Performance Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block">Total Clicks</span>
                    <span className="text-white font-medium text-lg">
                      {selectedBanner.click_count.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Impressions</span>
                    <span className="text-white font-medium text-lg">
                      {selectedBanner.impression_count.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CTR</span>
                    <span className="text-white font-medium text-lg">
                      {((selectedBanner.click_count / selectedBanner.impression_count) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedBanner.is_active}
                  onCheckedChange={(checked) => setSelectedBanner({ ...selectedBanner, is_active: checked })}
                />
                <Label className="text-slate-300">{selectedBanner.is_active ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              <Edit className="w-4 h-4 mr-2" />
              Update Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
