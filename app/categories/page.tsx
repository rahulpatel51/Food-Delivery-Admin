"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, Edit, Trash2, MoreHorizontal, Tag, Grid, List } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  _id: string
  name: string
  description: string
  image_url: string
  icon: string
  is_active: boolean
  sort_order: number
  restaurant_count: number
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image_url: "",
    icon: "",
    is_active: true,
    sort_order: 0,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Mock data for demo
      setCategories([
        {
          _id: "1",
          name: "Pizza",
          description: "Delicious pizzas with various toppings",
          image_url: "/placeholder.svg?height=200&width=300",
          icon: "🍕",
          is_active: true,
          sort_order: 1,
          restaurant_count: 45,
          created_at: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Burgers",
          description: "Juicy burgers and sandwiches",
          image_url: "/placeholder.svg?height=200&width=300",
          icon: "🍔",
          is_active: true,
          sort_order: 2,
          restaurant_count: 32,
          created_at: new Date().toISOString(),
        },
        {
          _id: "3",
          name: "Indian",
          description: "Authentic Indian cuisine",
          image_url: "/placeholder.svg?height=200&width=300",
          icon: "🍛",
          is_active: true,
          sort_order: 3,
          restaurant_count: 67,
          created_at: new Date().toISOString(),
        },
        {
          _id: "4",
          name: "Chinese",
          description: "Traditional and modern Chinese dishes",
          image_url: "/placeholder.svg?height=200&width=300",
          icon: "🥢",
          is_active: false,
          sort_order: 4,
          restaurant_count: 28,
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        fetchCategories()
        setShowCreateDialog(false)
        setNewCategory({
          name: "",
          description: "",
          image_url: "",
          icon: "",
          is_active: true,
          sort_order: 0,
        })
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 p-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Categories Management</h1>
              <p className="text-violet-200 mt-1">Organize and manage food categories for better discovery</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-violet-200">
            <div className="flex items-center gap-1">
              <Grid className="h-4 w-4" />
              {categories.length} Total Categories
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {categories.filter((c) => c.is_active).length} Active
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
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-80 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-violet-500" : ""}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-violet-500" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading categories...</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <Card
              key={category._id}
              className="glass-effect border-slate-700/50 hover:border-violet-500/30 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={category.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={category.name}
                  className="w-full h-48 object-cover rounded-t-lg"
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
                          setSelectedCategory(category)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-600" />
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute top-2 left-2">
                  <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-lg">
                    {category.icon}
                  </div>
                </div>
                {!category.is_active && (
                  <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                    <span className="text-white font-medium">Inactive</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{category.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{category.restaurant_count} restaurants</span>
                  <span>Order: {category.sort_order}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-effect border-slate-700/50">
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredCategories.map((category, index) => (
                <div
                  key={category._id}
                  className={`flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors ${
                    index !== filteredCategories.length - 1 ? "border-b border-slate-700/50" : ""
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                    <img
                      src={category.image_url || "/placeholder.svg?height=64&width=64"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{category.icon}</span>
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      {!category.is_active && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{category.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{category.restaurant_count} restaurants</span>
                      <span>Sort order: {category.sort_order}</span>
                      <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-600">
                      <DropdownMenuLabel className="text-slate-300">Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="text-slate-300 hover:bg-slate-700"
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-600" />
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Category Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Category</DialogTitle>
            <DialogDescription className="text-slate-400">
              Add a new food category to organize restaurants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Category Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Pizza, Burgers"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-slate-300">
                  Icon (Emoji)
                </Label>
                <Input
                  id="icon"
                  placeholder="🍕"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
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
                placeholder="Brief description of the category"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url" className="text-slate-300">
                Image URL
              </Label>
              <Input
                id="image_url"
                placeholder="https://example.com/image.jpg"
                value={newCategory.image_url}
                onChange={(e) => setNewCategory({ ...newCategory, image_url: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-slate-300">
                  Sort Order
                </Label>
                <Input
                  id="sort_order"
                  type="number"
                  placeholder="1"
                  value={newCategory.sort_order}
                  onChange={(e) => setNewCategory({ ...newCategory, sort_order: Number.parseInt(e.target.value) || 0 })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={newCategory.is_active}
                    onCheckedChange={(checked) => setNewCategory({ ...newCategory, is_active: checked })}
                  />
                  <span className="text-slate-300">{newCategory.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Category</DialogTitle>
            <DialogDescription className="text-slate-400">Update category information and settings</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_name" className="text-slate-300">
                    Category Name
                  </Label>
                  <Input
                    id="edit_name"
                    value={selectedCategory.name}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_icon" className="text-slate-300">
                    Icon (Emoji)
                  </Label>
                  <Input
                    id="edit_icon"
                    value={selectedCategory.icon}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, icon: e.target.value })}
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
                  value={selectedCategory.description}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_image_url" className="text-slate-300">
                  Image URL
                </Label>
                <Input
                  id="edit_image_url"
                  value={selectedCategory.image_url}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, image_url: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_sort_order" className="text-slate-300">
                    Sort Order
                  </Label>
                  <Input
                    id="edit_sort_order"
                    type="number"
                    value={selectedCategory.sort_order}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, sort_order: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      checked={selectedCategory.is_active}
                      onCheckedChange={(checked) => setSelectedCategory({ ...selectedCategory, is_active: checked })}
                    />
                    <span className="text-slate-300">{selectedCategory.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Restaurants:</span>
                    <span className="text-white ml-2">{selectedCategory.restaurant_count}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Created:</span>
                    <span className="text-white ml-2">
                      {new Date(selectedCategory.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
              <Edit className="w-4 h-4 mr-2" />
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
