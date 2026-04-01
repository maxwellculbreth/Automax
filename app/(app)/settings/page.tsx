"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCompany, useUsers } from "@/hooks/use-data"
import { updateCompany } from "@/lib/data-service"
import {
  Building,
  Users,
  Plug,
  Bell,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  Loader2,
  Moon,
  Sun,
  Palette,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const integrations = [
  {
    id: "google",
    name: "Google Business",
    description: "Sync reviews and business info",
    connected: true,
    icon: "G",
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Send SMS and make calls",
    connected: true,
    icon: "T",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and invoices",
    connected: false,
    icon: "S",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Accounting and invoicing",
    connected: false,
    icon: "Q",
  },
]

export default function SettingsPage() {
  const { company, isLoading: companyLoading, mutate: mutateCompany } = useCompany()
  const { users, isLoading: usersLoading } = useUsers()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("business")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    industry: "pressure_washing",
    timezone: "america_chicago",
  })

  // Load company data into form when it arrives
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        location: company.location || "",
        phone: company.phone || "",
        email: company.email || "",
        address: company.address || "",
        website: company.website || "",
        industry: company.industry || "pressure_washing",
        timezone: company.timezone || "america_chicago",
      })
    }
  }, [company])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  const handleSaveChanges = async () => {
    if (!company?.id) {
      setSaveStatus("error")
      return
    }
    
    setIsSaving(true)
    setSaveStatus("idle")
    
    try {
      const result = await updateCompany(company.id, {
        name: formData.name || "My Business",
        location: formData.location || "",
        phone: formData.phone || "",
        email: formData.email || "",
        address: formData.address || "",
        website: formData.website || "",
        industry: formData.industry || "pressure_washing",
        timezone: formData.timezone || "america_chicago",
      })
      
      if (result) {
        setSaveStatus("success")
        mutateCompany()
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        setSaveStatus("error")
      }
    } catch (error) {
      console.error("Error saving company:", error)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  const teamMembers = users.length > 0 ? users : [
    { id: "1", name: "Mike Thompson", email: "mike@crystalclearpw.com", role: "owner" },
    { id: "2", name: "Sarah Johnson", email: "sarah@crystalclearpw.com", role: "admin" },
    { id: "3", name: "Jake Martinez", email: "jake@crystalclearpw.com", role: "crew" },
  ]

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Manage your account and preferences
        </p>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 sm:mb-6 h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="business" className="text-[12px] sm:text-[13px] h-7 gap-1 sm:gap-1.5 px-2 sm:px-3">
              <Building className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="text-[12px] sm:text-[13px] h-7 gap-1 sm:gap-1.5 px-2 sm:px-3">
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-[12px] sm:text-[13px] h-7 gap-1 sm:gap-1.5 px-2 sm:px-3">
              <Plug className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-[12px] sm:text-[13px] h-7 gap-1 sm:gap-1.5 px-2 sm:px-3">
              <Bell className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-[12px] sm:text-[13px] h-7 gap-1 sm:gap-1.5 px-2 sm:px-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Voice</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-[12px] sm:text-[13px] h-7 gap-1 sm:gap-1.5 px-2 sm:px-3">
              <Palette className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Business Profile */}
          <TabsContent value="business">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 sm:px-5 py-3 sm:py-4">
                <h2 className="text-[14px] font-semibold text-foreground">Business Profile</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Used in automations and AI-generated messages
                </p>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                {companyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="businessName" className="text-[13px]">Business Name</Label>
                        <Input 
                          id="businessName" 
                          value={formData.name} 
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="h-9 text-[13px]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-[13px]">Location</Label>
                        <Input 
                          id="location" 
                          value={formData.location} 
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="City, State"
                          className="h-9 text-[13px]" 
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="industry" className="text-[13px]">Industry</Label>
                        <Select value={formData.industry} onValueChange={(v) => handleInputChange("industry", v)}>
                          <SelectTrigger className="h-9 text-[13px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pressure_washing" className="text-[13px]">Pressure Washing</SelectItem>
                            <SelectItem value="landscaping" className="text-[13px]">Landscaping</SelectItem>
                            <SelectItem value="cleaning" className="text-[13px]">Cleaning</SelectItem>
                            <SelectItem value="painting" className="text-[13px]">Painting</SelectItem>
                            <SelectItem value="other" className="text-[13px]">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-[13px]">Timezone</Label>
                        <Select value={formData.timezone} onValueChange={(v) => handleInputChange("timezone", v)}>
                          <SelectTrigger className="h-9 text-[13px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america_new_york" className="text-[13px]">Eastern</SelectItem>
                            <SelectItem value="america_chicago" className="text-[13px]">Central</SelectItem>
                            <SelectItem value="america_denver" className="text-[13px]">Mountain</SelectItem>
                            <SelectItem value="america_los_angeles" className="text-[13px]">Pacific</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center gap-3">
                      <Button 
                        type="button"
                        size="sm" 
                        className="h-8 text-[13px]"
                        onClick={handleSaveChanges}
                        disabled={isSaving || companyLoading}
                      >
                        {isSaving && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
{saveStatus === "success" && (
                                        <span className="text-[12px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                          <CheckCircle className="h-3.5 w-3.5" />
                                          Saved successfully
                                        </span>
                                      )}
                                      {saveStatus === "error" && (
                                        <span className="text-[12px] text-red-500 dark:text-red-400">
                                          Failed to save. Please try again.
                                        </span>
                                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Team Members */}
          <TabsContent value="team">
            <div className="rounded-lg border border-border bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 border-b border-border px-4 sm:px-5 py-3 sm:py-4">
                <div>
                  <h2 className="text-[14px] font-semibold text-foreground">Team Members</h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    Manage account access
                  </p>
                </div>
                <Button size="sm" className="h-8 text-[13px] w-full sm:w-auto">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Member
                </Button>
              </div>
              <div className="divide-y divide-border">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between px-4 sm:px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center">
                        <span className="text-[11px] font-semibold text-background">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{member.name}</p>
                        <p className="text-[12px] text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
                        member.role === "owner" 
                          ? "bg-foreground text-background" 
                          : "bg-secondary text-foreground"
                      )}>
                        {member.role === "owner" ? "Owner" : member.role === "admin" ? "Admin" : "Crew Lead"}
                      </span>
                      {member.role !== "owner" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-[14px] font-semibold text-foreground">Integrations</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Connect your tools and services
                </p>
              </div>
              <div className="divide-y divide-border">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center text-[13px] font-semibold text-foreground">
                        {integration.icon}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{integration.name}</p>
                        <p className="text-[12px] text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </span>
                        <Button variant="outline" size="sm" className="h-7 text-[12px]">
                          Manage
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="h-7 text-[12px]">
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-[14px] font-semibold text-foreground">Notifications</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Choose when to be notified
                </p>
              </div>
              <div className="p-5 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Email</h3>
                  {[
                    { id: "new_lead", label: "New lead received", defaultChecked: true },
                    { id: "lead_reply", label: "Lead replies to message", defaultChecked: true },
                    { id: "job_booked", label: "Job booked", defaultChecked: true },
                    { id: "weekly_report", label: "Weekly performance report", defaultChecked: true },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1">
                      <Label htmlFor={item.id} className="text-[13px] font-normal">{item.label}</Label>
                      <Switch id={item.id} defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Push</h3>
                  {[
                    { id: "push_new_lead", label: "New lead received", defaultChecked: true },
                    { id: "push_urgent", label: "Urgent follow-ups", defaultChecked: true },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1">
                      <Label htmlFor={item.id} className="text-[13px] font-normal">{item.label}</Label>
                      <Switch id={item.id} defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Button size="sm" className="h-8 text-[13px]">Save Preferences</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI Voice & Tone */}
          <TabsContent value="ai">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-[14px] font-semibold text-foreground">AI Voice & Tone</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Customize AI-generated messages
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-[13px]">Communication Style</Label>
                  <Select defaultValue="friendly_professional">
                    <SelectTrigger className="h-9 text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly_professional" className="text-[13px]">Friendly & Professional</SelectItem>
                      <SelectItem value="casual" className="text-[13px]">Casual & Relaxed</SelectItem>
                      <SelectItem value="formal" className="text-[13px]">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signature" className="text-[13px]">Message Signature</Label>
                  <Input
                    id="signature"
                    defaultValue="Thanks, Mike - Crystal Clear Pressure Washing"
                    className="h-9 text-[13px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom_instructions" className="text-[13px]">Custom Instructions</Label>
                  <Textarea
                    id="custom_instructions"
                    className="min-h-[80px] text-[13px] resize-none"
                    defaultValue="Mention same-day availability when possible. Keep messages short and direct. Emphasize our satisfaction guarantee."
                  />
                </div>
                <div className="pt-2">
                  <Button size="sm" className="h-8 text-[13px]">Save AI Settings</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-[14px] font-semibold text-foreground">Appearance</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Customize the look and feel
                </p>
              </div>
              <div className="p-5 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Theme</h3>
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                        {theme === "dark" ? (
                          <Moon className="h-4 w-4 text-foreground" />
                        ) : (
                          <Sun className="h-4 w-4 text-foreground" />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="dark-mode" className="text-[13px] font-medium cursor-pointer">
                          Dark Mode
                        </Label>
                        <p className="text-[12px] text-muted-foreground">
                          Switch to a darker color scheme
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-[12px] text-muted-foreground">
                    Your preference is saved automatically.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
