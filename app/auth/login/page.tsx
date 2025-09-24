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
import { Eye, EyeOff, Mail, Lock, ArrowRight, Utensils, Shield, TrendingUp, Users, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        router.push("/")
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please try again.")
      // For demo purposes, allow login with any credentials
      if (email && password) {
        localStorage.setItem("token", "demo-token")
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "1",
            email: email,
            role: "admin",
            first_name: "Admin",
            last_name: "User",
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
      title: "Real-time Analytics",
      description: "Track performance metrics instantly with advanced dashboards",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with multi-factor authentication",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Comprehensive user, restaurant, and partner management",
    },
    {
      icon: CheckCircle,
      title: "Order Tracking",
      description: "Real-time order monitoring and status updates",
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
        {/* Left Side - Branding & Features */}
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
              <h2 className="text-4xl font-bold text-white leading-tight">Manage Your Food Delivery Empire</h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Access powerful analytics, manage restaurants, track orders, and grow your business with our
                comprehensive admin platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 glass-effect rounded-xl hover:bg-slate-800/40 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="glass-effect border-slate-700/50 shadow-2xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-effect">
                <Utensils className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                Sign in to your admin account to continue managing your platform
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@feasto.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-300">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="space-y-6 pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-200 glow-effect"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-slate-400">Don't have an account? </span>
                  <Link
                    href="/auth/signup"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Demo Credentials */}
          <div className="mt-6 p-6 glass-effect rounded-xl border border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Demo Credentials
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email:</span>
                <code className="text-orange-400 bg-slate-800/50 px-2 py-1 rounded">admin@feasto.com</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Password:</span>
                <code className="text-orange-400 bg-slate-800/50 px-2 py-1 rounded">admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
