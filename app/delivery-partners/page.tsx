"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Search,
  Truck,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  User,
} from "lucide-react"

interface DeliveryPartner {
  _id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  is_available: boolean
  profile_image?: string
  vehicle_details: {
    type: string
    number: string
  }
  address: {
    city: string
    state: string
  }
  rating?: number
  total_deliveries?: number
  created_at: string
}

interface Application {
  _id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  city: string
  vehicle_type: string
  status: string
  created_at: string
}

export default function DeliveryPartnersPage() {
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showPartnerDialog, setShowPartnerDialog] = useState(false)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)

  useEffect(() => {
    fetchDeliveryPartners()
    fetchApplications()
  }, [])

  const fetchDeliveryPartners = async () => {
    try {
      // Mock data for demo
      setDeliveryPartners([
        {
          _id: "1",
          first_name: "Mike",
          last_name: "Wilson",
          email: "mike@example.com",
          phone: "+91 9876543210",
          status: "active",
          is_available: true,
          vehicle_details: {
            type: "motorcycle",
            number: "MH01AB1234",
          },
          address: {
            city: "Mumbai",
            state: "Maharashtra",
          },
          rating: 4.8,
          total_deliveries: 1250,
          created_at: new Date().toISOString(),
        },
        {
          _id: "2",
          first_name: "Sarah",
          last_name: "Davis",
          email: "sarah@example.com",
          phone: "+91 9876543211",
          status: "active",
          is_available: false,
          profile_image: "/placeholder.svg?height=80&width=80",
          vehicle_details: {
            type: "bicycle",
            number: "DL02CD5678",
          },
          address: {
            city: "Delhi",
            state: "Delhi",
          },
          rating: 4.6,
          total_deliveries: 890,
          created_at: new Date().toISOString(),
        },
        {
          _id: "3",
          first_name: "Alex",
          last_name: "Johnson",
          email: "alex@example.com",
          phone: "+91 9876543212",
          status: "inactive",
          is_available: false,
          vehicle_details: {
            type: "scooter",
            number: "KA03EF9012",
          },
          address: {
            city: "Bangalore",
            state: "Karnataka",
          },
          rating: 4.2,
          total_deliveries: 456,
          created_at: new Date().toISOString(),
        },
      ])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching delivery partners:", error)
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      // Mock data for demo
      setApplications([
        {
          _id: "1",
          first_name: "John",
          last_name: "Smith",
          email: "john.smith@example.com",
          phone: "+91 9876543213",
          city: "Chennai",
          vehicle_type: "motorcycle",
          status: "pending",
          created_at: new Date().toISOString(),
        },
        {
          _id: "2",
          first_name: "Priya",
          last_name: "Sharma",
          email: "priya@example.com",
          phone: "+91 9876543214",
          city: "Pune",
          vehicle_type: "bicycle",
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-500/20 text-green-400 border-green-500/30" },
      inactive: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      suspended: { color: "bg-red-500/20 text-red-400 border-red-500/30" },
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive

    return <Badge className={`${config.color} border font-medium`}>{status}</Badge>
  }

  const getAvailabilityBadge = (isAvailable: boolean) => {
    return (
      <Badge
        className={`${isAvailable ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"} border font-medium`}
      >
        {isAvailable ? "Available" : "Busy"}
      </Badge>
    )
  }

  const getVehicleBadge = (vehicleType: string) => {
    const colors = {
      motorcycle: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      bicycle: "bg-green-500/20 text-green-400 border-green-500/30",
      scooter: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      car: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    }

    return <Badge className={`${colors[vehicleType as keyof typeof colors]} border font-medium`}>{vehicleType}</Badge>
  }

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const filteredPartners = deliveryPartners.filter((partner) => {
    const matchesSearch =
      partner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === "all" || partner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Delivery Partners</h1>
              <p className="text-purple-200 mt-1">Manage delivery partners and review applications</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-purple-200">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Partner Management
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              Performance Tracking
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
                <p className="text-sm font-medium text-slate-400">Total Partners</p>
                <p className="text-3xl font-bold text-white">2,847</p>
                <p className="text-sm text-green-400">+18.2% from last month</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Truck className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Partners</p>
                <p className="text-3xl font-bold text-white">2,234</p>
                <p className="text-sm text-green-400">+12.5% from last month</p>
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
                <p className="text-sm font-medium text-slate-400">Available Now</p>
                <p className="text-3xl font-bold text-white">1,456</p>
                <p className="text-sm text-blue-400">Ready for delivery</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <User className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Pending Applications</p>
                <p className="text-3xl font-bold text-white">89</p>
                <p className="text-sm text-yellow-400">Needs review</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="partners" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            Active Partners
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Applications
            {applications.filter((app) => app.status === "pending").length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                {applications.filter((app) => app.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners">
          {/* Filters */}
          <Card className="glass-effect border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search partners..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Partners Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading delivery partners...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPartners.map((partner) => (
                <Card
                  key={partner._id}
                  className="glass-effect border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {partner.profile_image ? (
                          <img
                            src={partner.profile_image || "/placeholder.svg"}
                            alt={`${partner.first_name} ${partner.last_name}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg border-2 border-purple-500/30">
                            {getUserInitials(partner.first_name, partner.last_name)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {partner.first_name} {partner.last_name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {partner.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-white text-sm">{partner.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(partner.status)}
                        {getAvailabilityBadge(partner.is_available)}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{partner.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{partner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>
                          {partner.address.city}, {partner.address.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Truck className="h-4 w-4 text-slate-400" />
                        <span>
                          {partner.vehicle_details.type} - {partner.vehicle_details.number}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      {getVehicleBadge(partner.vehicle_details.type)}
                      {partner.total_deliveries && (
                        <div className="text-right">
                          <p className="text-sm text-slate-400">Deliveries</p>
                          <p className="text-white font-medium">{partner.total_deliveries}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={partner.is_available} className="data-[state=checked]:bg-purple-500" />
                        <span className="text-sm text-slate-300">{partner.is_available ? "Available" : "Busy"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:border-purple-500 hover:text-purple-400"
                          onClick={() => {
                            setSelectedPartner(partner)
                            setShowPartnerDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:border-green-500 hover:text-green-400"
                        >
                          <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="applications">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Delivery Partner Applications</CardTitle>
              <CardDescription className="text-slate-400">
                Review and approve new delivery partner applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((application) => (
                  <Card
                    key={application._id}
                    className="glass-effect border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg border-2 border-yellow-500/30">
                            {getUserInitials(application.first_name, application.last_name)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">
                              {application.first_name} {application.last_name}
                            </h3>
                            <p className="text-sm text-slate-400">New Application</p>
                          </div>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{application.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{application.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{application.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Truck className="h-4 w-4 text-slate-400" />
                          <span>{application.vehicle_type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {application.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            onClick={() => {
                              // Handle approval logic
                              console.log("Approve application:", application._id)
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedApplication(application)
                              setShowApplicationDialog(true)
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-slate-600 hover:border-purple-500 hover:text-purple-400"
                          onClick={() => {
                            setSelectedApplication(application)
                            setShowApplicationDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Partner Details Dialog */}
      <Dialog open={showPartnerDialog} onOpenChange={setShowPartnerDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-purple-500/30 border-2">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Truck className="h-6 w-6 text-purple-400" />
              </div>
              Delivery Partner Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Complete information about {selectedPartner?.first_name} {selectedPartner?.last_name}
            </DialogDescription>
          </DialogHeader>

          {selectedPartner && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      {selectedPartner.profile_image ? (
                        <img
                          src={selectedPartner.profile_image || "/placeholder.svg"}
                          alt={`${selectedPartner.first_name} ${selectedPartner.last_name}`}
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-purple-500/30">
                          {getUserInitials(selectedPartner.first_name, selectedPartner.last_name)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {selectedPartner.first_name} {selectedPartner.last_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {selectedPartner.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-white">{selectedPartner.rating}</span>
                            </div>
                          )}
                          {getStatusBadge(selectedPartner.status)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </span>
                        <span className="text-white font-medium">{selectedPartner.email}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </span>
                        <span className="text-white font-medium">{selectedPartner.phone}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Status</span>
                        {getStatusBadge(selectedPartner.status)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400">Availability</span>
                        {getAvailabilityBadge(selectedPartner.is_available)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </span>
                        <span className="text-white font-medium">
                          {selectedPartner.address.city}, {selectedPartner.address.state}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-slate-700/50">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Truck className="h-5 w-5 text-purple-400" />
                      Vehicle & Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-white mb-3">Vehicle Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Type</span>
                          {getVehicleBadge(selectedPartner.vehicle_details.type)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Number</span>
                          <span className="text-white font-medium">{selectedPartner.vehicle_details.number}</span>
                        </div>
                      </div>
                    </div>

                    {selectedPartner.total_deliveries && (
                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <h4 className="font-medium text-white mb-3">Performance Stats</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Total Deliveries</span>
                            <span className="text-white font-medium text-2xl">{selectedPartner.total_deliveries}</span>
                          </div>
                          {selectedPartner.rating && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Rating</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-white font-medium">{selectedPartner.rating}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-white mb-3">Account Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Joined</span>
                          <span className="text-white font-medium">
                            {new Date(selectedPartner.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {Math.floor(
                            (Date.now() - new Date(selectedPartner.created_at).getTime()) / (1000 * 60 * 60 * 24),
                          )}{" "}
                          days ago
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" onClick={() => setShowPartnerDialog(false)} className="border-slate-600">
              Close
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
              <Edit className="w-4 h-4 mr-2" />
              Edit Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="bg-slate-900 border-yellow-500/30 border-2">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-yellow-400" />
              Application Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">Review delivery partner application</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-yellow-500/30">
                  {getUserInitials(selectedApplication.first_name, selectedApplication.last_name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedApplication.first_name} {selectedApplication.last_name}
                  </h3>
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>
                  <span className="text-white font-medium">{selectedApplication.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </span>
                  <span className="text-white font-medium">{selectedApplication.phone}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    City
                  </span>
                  <span className="text-white font-medium">{selectedApplication.city}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Vehicle Type
                  </span>
                  {getVehicleBadge(selectedApplication.vehicle_type)}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Applied
                  </span>
                  <span className="text-white font-medium">
                    {new Date(selectedApplication.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicationDialog(false)} className="border-slate-600">
              Close
            </Button>
            {selectedApplication?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    // Handle rejection logic
                    setShowApplicationDialog(false)
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={() => {
                    // Handle approval logic
                    setShowApplicationDialog(false)
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
