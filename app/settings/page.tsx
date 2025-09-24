"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  SettingsIcon,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Smartphone,
  Database,
  Server,
  Key,
  Monitor,
  Save,
  RefreshCw,
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: "FEASTO",
      siteDescription: "Premium Food Delivery Platform",
      timezone: "Asia/Kolkata",
      language: "en",
      currency: "INR",
      dateFormat: "DD/MM/YYYY",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      orderAlerts: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: "",
    },
    payment: {
      razorpayEnabled: true,
      stripeEnabled: true,
      paytmEnabled: false,
      commissionRate: 15,
      minimumPayout: 1000,
      payoutSchedule: "weekly",
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
      backupFrequency: "daily",
      logLevel: "info",
    },
  })

  const handleSave = () => {
    // Save settings logic
    console.log("Settings saved:", settings)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">System Settings</h1>
              <p className="text-emerald-200 mt-1">Configure your platform preferences and system behavior</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-emerald-200">
            <div className="flex items-center gap-1">
              <Server className="h-4 w-4" />
              System Status: Online
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Last Backup: 2 hours ago
            </div>
            <div className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              Uptime: 99.9%
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-500">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-500">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-emerald-500">
            Security
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-emerald-500">
            Payment
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-emerald-500">
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="h-5 w-5 text-emerald-400" />
                General Settings
              </CardTitle>
              <CardDescription className="text-slate-400">Basic platform configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-slate-300">
                    Site Name
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, siteName: e.target.value },
                      })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-slate-300">
                    Timezone
                  </Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, timezone: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-slate-300">
                  Site Description
                </Label>
                <Input
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, siteDescription: e.target.value },
                    })
                  }
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-slate-300">
                    Language
                  </Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, language: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-300">
                    Currency
                  </Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, currency: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat" className="text-slate-300">
                    Date Format
                  </Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, dateFormat: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5 text-emerald-400" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-slate-400">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-sm text-slate-400">Browser push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, pushNotifications: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">SMS Notifications</p>
                      <p className="text-sm text-slate-400">Text message alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, smsNotifications: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Order Alerts</p>
                      <p className="text-sm text-slate-400">New order notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.orderAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, orderAlerts: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">System Alerts</p>
                      <p className="text-sm text-slate-400">Security and system notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, systemAlerts: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-emerald-400" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-slate-300">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: Number.parseInt(e.target.value) },
                      })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry" className="text-slate-300">
                    Password Expiry (days)
                  </Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, passwordExpiry: Number.parseInt(e.target.value) },
                      })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginAttempts" className="text-slate-300">
                  Max Login Attempts
                </Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={settings.security.loginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, loginAttempts: Number.parseInt(e.target.value) },
                    })
                  }
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-400">Require 2FA for admin access</p>
                  </div>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                Payment Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure payment gateways and commission rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      R
                    </div>
                    <div>
                      <p className="text-white font-medium">Razorpay</p>
                      <p className="text-sm text-slate-400">Indian payment gateway</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.payment.razorpayEnabled ? "default" : "secondary"}>
                      {settings.payment.razorpayEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={settings.payment.razorpayEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          payment: { ...settings.payment, razorpayEnabled: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      S
                    </div>
                    <div>
                      <p className="text-white font-medium">Stripe</p>
                      <p className="text-sm text-slate-400">Global payment processor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.payment.stripeEnabled ? "default" : "secondary"}>
                      {settings.payment.stripeEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={settings.payment.stripeEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          payment: { ...settings.payment, stripeEnabled: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commissionRate" className="text-slate-300">
                    Commission Rate (%)
                  </Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={settings.payment.commissionRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, commissionRate: Number.parseInt(e.target.value) },
                      })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPayout" className="text-slate-300">
                    Minimum Payout (₹)
                  </Label>
                  <Input
                    id="minimumPayout"
                    type="number"
                    value={settings.payment.minimumPayout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, minimumPayout: Number.parseInt(e.target.value) },
                      })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutSchedule" className="text-slate-300">
                    Payout Schedule
                  </Label>
                  <Select
                    value={settings.payment.payoutSchedule}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, payoutSchedule: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Server className="h-5 w-5 text-emerald-400" />
                System Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure system behavior and maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Maintenance Mode</p>
                      <p className="text-sm text-slate-400">Put the system in maintenance mode</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, maintenanceMode: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Cache Enabled</p>
                      <p className="text-sm text-slate-400">Enable system caching for better performance</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.system.cacheEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, cacheEnabled: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency" className="text-slate-300">
                    Backup Frequency
                  </Label>
                  <Select
                    value={settings.system.backupFrequency}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, backupFrequency: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logLevel" className="text-slate-300">
                    Log Level
                  </Label>
                  <Select
                    value={settings.system.logLevel}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, logLevel: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
