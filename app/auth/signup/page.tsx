"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Utensils,
  CheckCircle,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        router.push("/")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("Network error. Please try again.")
      // For demo purposes
      if (formData.email && formData.password) {
        localStorage.setItem("token", "demo-token")
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "1",
            email: formData.email,
            role: formData.role,
            first_name: formData.firstName,
            last_name: formData.lastName,
            avatar: "/placeholder.svg?height=40&width=40",
          }),
        )
        router.push("/")
      }
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Complete Dashboard Analytics",
      description: "Advanced reporting and insights",
    },
    {
      icon: Users,
      title: "User Management System",
      description: "Comprehensive user control",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade protection",
    },
    {
      icon: CheckCircle,
      title: "Real-time Monitoring",
      description: "Live system tracking",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center glow-effect">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  FEASTO
                </h1>
                <p className="text-slate-400 text-lg">Admin Dashboard</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Join the Future of Food Delivery Management
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Get access to powerful tools and analytics to manage your food delivery business efficiently and scale
                your operations.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">What you'll get:</h3>
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 glass-effect rounded-xl hover:bg-slate-800/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 glass-effect rounded-xl border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-medium">Trusted by 1000+ businesses</span>
            </div>
            <p className="text-slate-300 text-sm">
              Join thousands of successful food delivery businesses already using FEASTO to manage their operations.
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="glass-effect border-slate-700/50 shadow-2xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-effect">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
              <CardDescription className="text-slate-400">
                Join FEASTO and start managing your food delivery business
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-300">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-300">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300">
                    Role
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white focus:border-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-300">
                    I agree to the{" "}
                    <Link href="/terms" className="text-orange-400 hover:text-orange-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </CardContent>

              <CardFooter className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2.5 transition-all duration-200 glow-effect"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-slate-400">Already have an account? </span>
                  <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
