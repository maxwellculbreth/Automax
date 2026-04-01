"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Plus,
  Sparkles,
  Upload,
  Play,
  Copy,
  RefreshCw,
  Download,
  Layers,
  Image as ImageIcon,
  Video,
  FileText,
  MessageSquare,
  MousePointerClick,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Zap,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Award,
  Lightbulb,
  Clock,
  DollarSign,
  Eye,
  Facebook,
  Instagram,
  Star,
  Palette,
  Building,
  Phone,
  Globe,
  Quote,
} from "lucide-react"

// Marketing KPI data
const marketingKPIs = [
  { label: "Ads Generated", value: "24", trend: "+8 this month", trendUp: true },
  { label: "Leads Attributed", value: "156", trend: "+23% vs last month", trendUp: true },
  { label: "Top Campaign", value: "Spring Promo", trend: "47 leads", trendUp: null },
  { label: "Content Ready", value: "12", trend: "3 scheduled", trendUp: null },
]

// Service types
const serviceTypes = [
  "House Wash",
  "Driveway Cleaning",
  "Roof Wash",
  "Window Cleaning",
  "Pressure Washing",
  "Landscaping",
  "Junk Removal",
  "Other",
]

// Campaign goals
const campaignGoals = [
  "Get Leads",
  "Promote Offer",
  "Retarget Old Leads",
  "Build Local Awareness",
  "Get Reviews / UGC",
]

// Platforms
const platforms = ["Facebook", "Instagram", "TikTok", "Multi-Platform"]

// Tones
const tones = ["Professional", "Direct Response", "Luxury / Premium", "Friendly Local", "Urgent / Promo"]

// Generated hooks
const generatedHooks = [
  "This driveway transformation took less than an hour.",
  "Most homeowners don't realize how dirty this gets.",
  "Before you replace it, watch this.",
  "One wash can completely change your curb appeal.",
  "Your neighbors will ask what you did.",
  "We removed 10 years of grime in 30 minutes.",
]

// Generated captions
const generatedCaptions = [
  "Another satisfied customer in Austin! This driveway went from grimy to gleaming in under an hour. Ready to transform your home's curb appeal? Link in bio.",
  "Weekend warrior project complete! Watch the full transformation on our page. DM us for a free quote.",
  "Before vs After that speaks for itself. Spring cleaning season is here - book now before we're fully booked!",
]

// CTA variations
const ctaVariations = [
  "Book Your Free Quote",
  "Message Us Today",
  "Get On The Schedule",
  "Claim Spring Special",
  "See Our Work",
  "Transform Your Home",
]

// Campaign presets
const campaignPresets = [
  {
    name: "Spring Cleaning Promo",
    description: "Seasonal offer targeting homeowners preparing for spring",
    channels: ["Facebook", "Instagram"],
    useCase: "Best for March-May campaigns",
  },
  {
    name: "Neighborhood Offer",
    description: "Hyper-local targeting for specific neighborhoods",
    channels: ["Facebook"],
    useCase: "Great for new service areas",
  },
  {
    name: "Retarget Old Estimates",
    description: "Re-engage leads who received quotes but didn't book",
    channels: ["Facebook", "Instagram"],
    useCase: "Recover lost opportunities",
  },
  {
    name: "Before/After Showcase",
    description: "Visual transformation content to build trust",
    channels: ["Instagram", "TikTok"],
    useCase: "Brand awareness and social proof",
  },
  {
    name: "Seasonal Exterior Refresh",
    description: "Holiday or seasonal home improvement messaging",
    channels: ["Facebook", "Instagram"],
    useCase: "Thanksgiving, July 4th, etc.",
  },
  {
    name: "Review & Referral Push",
    description: "Encourage reviews and referrals from past customers",
    channels: ["Facebook"],
    useCase: "Build social proof",
  },
]

// Content ideas
const contentIdeas = [
  { title: "Before/After Showcase", type: "Photo", time: "5 min" },
  { title: "Satisfying Surface Cleaner Clip", type: "Video", time: "10 min" },
  { title: "3 Signs Your House Needs Washing", type: "Carousel", time: "15 min" },
  { title: "Customer Testimonial Post", type: "Photo", time: "5 min" },
  { title: "Limited-Time Offer Video", type: "Video", time: "10 min" },
  { title: "Local Neighborhood Transformation", type: "Video", time: "15 min" },
]

// Marketing templates
const marketingTemplates = [
  { name: "Facebook Lead Ad", description: "Optimized for lead generation with instant forms", recommended: "All services" },
  { name: "Instagram Reel Ad", description: "Short-form video for maximum engagement", recommended: "Visual services" },
  { name: "Seasonal Offer Ad", description: "Time-limited promotions and discounts", recommended: "Spring/Fall" },
  { name: "Review Request Campaign", description: "Automated review collection from customers", recommended: "Post-service" },
  { name: "Reactivation Campaign", description: "Re-engage dormant leads and past customers", recommended: "Quarterly" },
  { name: "Referral Campaign", description: "Incentivize word-of-mouth referrals", recommended: "All year" },
  { name: "Neighborhood Targeting", description: "Hyper-local ads for specific areas", recommended: "New areas" },
]

// AI recommendations
const aiRecommendations = [
  { icon: TrendingUp, text: "Your before/after content performs best — create 3 more variants.", priority: "high" },
  { icon: Target, text: "Driveway cleaning ads are trending higher than house wash campaigns.", priority: "medium" },
  { icon: Zap, text: "Use a stronger opening hook in the first 2 seconds.", priority: "high" },
  { icon: Users, text: "Try targeting homeowners in a 10-mile radius with your spring promo.", priority: "medium" },
  { icon: Star, text: "Your testimonial-based ad may improve trust and conversion.", priority: "low" },
]

// Performance data
const performanceData = {
  leadsFromAds: 156,
  bestCreative: "Driveway Before/After",
  bestHook: "One wash can completely change...",
  costPerLead: 12.50,
  estimatedRevenue: 18750,
  topPlatform: "Facebook",
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("creative")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowResults(true)
    }, 2000)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(id)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-semibold text-foreground">Marketing</h1>
              <span className="flex items-center rounded bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                Pro Feature
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground mt-1">
              Generate ads, content, and campaigns that bring in more leads.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 text-[13px]">
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              Generate Campaign
            </Button>
            <Button size="sm" className="h-9 text-[13px]">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create New Ad
            </Button>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 sm:p-6 lg:p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketingKPIs.map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-1.5 text-[22px] sm:text-2xl font-semibold tabular-nums tracking-tight leading-none text-foreground">
                {kpi.value}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {kpi.trendUp !== null && (
                  <TrendingUp className={cn("h-3 w-3 flex-shrink-0", kpi.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")} />
                )}
                <span className={cn(
                  "text-[11px] leading-none",
                  kpi.trendUp === true && "text-emerald-600 dark:text-emerald-400",
                  kpi.trendUp === false && "text-amber-600 dark:text-amber-400",
                  kpi.trendUp === null && "text-muted-foreground"
                )}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Ad Creative Generator */}
        <div className="mt-5 sm:mt-6 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <Sparkles className="h-4 w-4 text-background" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-foreground">AI Ad Creative Generator</h2>
                <p className="text-[12px] text-muted-foreground">Upload footage and let AI create lead-generating ads</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-5">
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Left column - Uploads */}
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-foreground mb-1.5 block">Upload Footage</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                    <Video className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="mt-2 text-[13px] font-medium text-foreground">Drop video clips here</p>
                    <p className="text-[12px] text-muted-foreground mt-1">MP4, MOV up to 500MB</p>
                    <Button variant="outline" size="sm" className="mt-3 h-8 text-[12px]">
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Browse Files
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-medium text-foreground mb-1.5 block">Upload Photos</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="mt-2 text-[13px] font-medium text-foreground">Drop before/after photos</p>
                    <p className="text-[12px] text-muted-foreground mt-1">JPG, PNG up to 10MB each</p>
                    <Button variant="outline" size="sm" className="mt-3 h-8 text-[12px]">
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right column - Settings */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-medium text-foreground mb-1.5 block">Service Type</label>
                    <Select defaultValue="pressure-washing">
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase().replace(/ /g, "-")} className="text-[13px]">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-[12px] font-medium text-foreground mb-1.5 block">Campaign Goal</label>
                    <Select defaultValue="get-leads">
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignGoals.map((goal) => (
                          <SelectItem key={goal} value={goal.toLowerCase().replace(/ /g, "-")} className="text-[13px]">
                            {goal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-medium text-foreground mb-1.5 block">Platform</label>
                    <Select defaultValue="facebook">
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform} value={platform.toLowerCase().replace(/ /g, "-")} className="text-[13px]">
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-[12px] font-medium text-foreground mb-1.5 block">Tone</label>
                    <Select defaultValue="direct-response">
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((tone) => (
                          <SelectItem key={tone} value={tone.toLowerCase().replace(/ /g, "-")} className="text-[13px]">
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-foreground mb-1.5 block">Target Area</label>
                  <Input placeholder="e.g., Austin, TX - 15 mile radius" className="h-9 text-[13px]" />
                </div>

                <div>
                  <label className="text-[12px] font-medium text-foreground mb-1.5 block">Offer / Promo (optional)</label>
                  <Input placeholder="e.g., 20% off first service, Free quote" className="h-9 text-[13px]" />
                </div>

                <div>
                  <label className="text-[12px] font-medium text-foreground mb-1.5 block">Additional Notes</label>
                  <Textarea 
                    placeholder="Any specific messaging, USPs, or details to include..." 
                    className="min-h-[80px] text-[13px] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full sm:w-auto h-10 text-[13px] px-6"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Generating Creative Package...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Creative Package
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Generated Results */}
        {showResults && (
          <div className="mt-5 sm:mt-6 rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3.5 sm:px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <h2 className="text-[14px] font-semibold text-foreground">Generated Creative Package</h2>
                </div>
                <span className="text-[12px] text-muted-foreground">Generated just now</span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-border px-4 sm:px-5">
                <TabsList className="h-auto p-0 bg-transparent gap-4">
                  <TabsTrigger value="creative" className="px-0 py-3 text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none">
                    <Video className="h-3.5 w-3.5 mr-1.5" />
                    Video Creative
                  </TabsTrigger>
                  <TabsTrigger value="copy" className="px-0 py-3 text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none">
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Ad Copy
                  </TabsTrigger>
                  <TabsTrigger value="hooks" className="px-0 py-3 text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none">
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Hooks
                  </TabsTrigger>
                  <TabsTrigger value="captions" className="px-0 py-3 text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none hidden sm:flex">
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Captions
                  </TabsTrigger>
                  <TabsTrigger value="ctas" className="px-0 py-3 text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none hidden sm:flex">
                    <MousePointerClick className="h-3.5 w-3.5 mr-1.5" />
                    CTAs
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 sm:p-5">
                <TabsContent value="creative" className="mt-0">
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="aspect-video bg-foreground/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                      <div className="relative text-center">
                        <Play className="h-12 w-12 text-foreground/40 mx-auto" />
                        <p className="mt-2 text-[13px] font-medium text-foreground/60">Driveway_Transformation_v1.mp4</p>
                      </div>
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="rounded bg-foreground/80 px-2 py-0.5 text-[10px] font-medium text-background">0:15</span>
                        <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white flex items-center gap-1">
                          <Facebook className="h-3 w-3" />
                          Facebook
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-[12px]">
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[12px]">
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[12px]">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[12px]">
                        <Layers className="h-3.5 w-3.5 mr-1.5" />
                        Duplicate Variation
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="copy" className="mt-0 space-y-4">
                  {[
                    { label: "Primary Text", content: "Transform your home's curb appeal in just one hour! Our professional pressure washing service removes years of dirt, grime, and mildew. Limited spring slots available." },
                    { label: "Headline", content: "Pressure Washing That Gets Results" },
                    { label: "Description", content: "Serving Austin homeowners for 5+ years. Free quotes, same-week service." },
                    { label: "Call to Action", content: "Get Free Quote" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{item.label}</span>
                        <div className="flex items-center gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-[11px]"
                            onClick={() => copyToClipboard(item.content, item.label)}
                          >
                            {copiedItem === item.label ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-[13px] text-foreground">{item.content}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="hooks" className="mt-0">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {generatedHooks.map((hook, i) => (
                      <div key={i} className="rounded-lg border border-border p-4 flex items-start justify-between gap-3">
                        <p className="text-[13px] text-foreground flex-1">&ldquo;{hook}&rdquo;</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 flex-shrink-0"
                          onClick={() => copyToClipboard(hook, `hook-${i}`)}
                        >
                          {copiedItem === `hook-${i}` ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="captions" className="mt-0 space-y-3">
                  {generatedCaptions.map((caption, i) => (
                    <div key={i} className="rounded-lg border border-border p-4 flex items-start justify-between gap-3">
                      <p className="text-[13px] text-foreground flex-1">{caption}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 flex-shrink-0"
                        onClick={() => copyToClipboard(caption, `caption-${i}`)}
                      >
                        {copiedItem === `caption-${i}` ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="ctas" className="mt-0">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {ctaVariations.map((cta, i) => (
                      <div key={i} className="rounded-lg border border-border p-4 flex items-center justify-between gap-3">
                        <span className="text-[13px] font-medium text-foreground">{cta}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 flex-shrink-0"
                          onClick={() => copyToClipboard(cta, `cta-${i}`)}
                        >
                          {copiedItem === `cta-${i}` ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        {/* Campaign Builder & Content Planner Row */}
        <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-2">
          {/* Campaign Builder */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3.5">
              <h2 className="text-[14px] font-semibold text-foreground">Campaign Builder</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Turn one creative into a full mini campaign</p>
            </div>
            <div className="p-4">
              {/* Campaign steps */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {["Select Creative", "Choose Objective", "Choose Audience", "Generate Copy", "Launch"].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      "flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap",
                      i === 0 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                    )}>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background/20 text-[10px]">{i + 1}</span>
                      {step}
                    </div>
                    {i < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>

              {/* Campaign presets */}
              <div className="space-y-2">
                {campaignPresets.slice(0, 4).map((preset) => (
                  <div key={preset.name} className="rounded-lg border border-border p-3 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-foreground">{preset.name}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{preset.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {preset.channels.map((ch) => (
                            <span key={ch} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {ch}
                            </span>
                          ))}
                          <span className="text-[10px] text-muted-foreground">{preset.useCase}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-[11px] flex-shrink-0">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-3 text-[12px]">
                View all campaign templates
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Content Planner */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-semibold text-foreground">Content Planner</h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Plan and schedule your marketing content</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-[12px]">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  View Calendar
                </Button>
              </div>
            </div>
            <div className="p-4">
              {/* Quick actions */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button variant="outline" size="sm" className="h-auto py-2.5 flex-col gap-1 text-[11px]">
                  <Sparkles className="h-4 w-4" />
                  Generate Week
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-2.5 flex-col gap-1 text-[11px]">
                  <Calendar className="h-4 w-4" />
                  Schedule Posts
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-2.5 flex-col gap-1 text-[11px]">
                  <Layers className="h-4 w-4" />
                  Create 3 Variations
                </Button>
              </div>

              {/* Content ideas */}
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Suggested Content Ideas</p>
              <div className="space-y-2">
                {contentIdeas.slice(0, 4).map((idea) => (
                  <div key={idea.title} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      {idea.type === "Video" ? (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      ) : idea.type === "Carousel" ? (
                        <Layers className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-[13px] text-foreground">{idea.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{idea.time}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Brand Kit & Performance Row */}
        <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3">
          {/* Brand Kit */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3.5">
              <h2 className="text-[14px] font-semibold text-foreground">Brand Kit</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Your reusable marketing info</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Building className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">Crystal Clear Pressure Washing</p>
                  <p className="text-[11px] text-muted-foreground">Business Name</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-[12px]">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">(512) 555-0123</span>
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">crystalclearpw.com</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Brand Colors:</span>
                <div className="flex gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-blue-600 border border-border" />
                  <div className="h-5 w-5 rounded-full bg-slate-800 border border-border" />
                  <div className="h-5 w-5 rounded-full bg-white border border-border" />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-2">Recent Review Snippet</p>
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-foreground italic">&ldquo;Mike and his team did an amazing job on our driveway. It looks brand new!&rdquo;</p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full h-8 text-[12px]">
                <Palette className="h-3.5 w-3.5 mr-1.5" />
                Edit Brand Kit
              </Button>
            </div>
          </div>

          {/* Marketing Performance */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3.5">
              <h2 className="text-[14px] font-semibold text-foreground">Marketing Performance</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Your ad and campaign analytics</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Leads from Ads</p>
                  <p className="mt-1 text-xl font-semibold text-foreground tabular-nums">{performanceData.leadsFromAds}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Cost per Lead</p>
                  <p className="mt-1 text-xl font-semibold text-foreground tabular-nums">${performanceData.costPerLead}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Est. Revenue</p>
                  <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">${performanceData.estimatedRevenue.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Top Performers</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { label: "Top Creative", value: performanceData.bestCreative, icon: Award },
                  { label: "Best Hook", value: performanceData.bestHook, icon: MessageSquare },
                  { label: "Top Platform", value: performanceData.topPlatform, icon: TrendingUp },
                  { label: "Best Offer", value: "Spring 20% Off", icon: DollarSign },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                    <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className="text-[12px] font-medium text-foreground truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Library */}
        <div className="mt-5 sm:mt-6 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3.5">
            <h2 className="text-[14px] font-semibold text-foreground">Marketing Templates Library</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Pre-built templates for common marketing needs</p>
          </div>
          <div className="p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {marketingTemplates.map((template) => (
                <div key={template.name} className="rounded-lg border border-border p-4 hover:bg-secondary/30 transition-colors">
                  <p className="text-[13px] font-medium text-foreground">{template.name}</p>
                  <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-muted-foreground">{template.recommended}</span>
                    <Button variant="outline" size="sm" className="h-7 text-[11px]">
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-5 sm:mt-6 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3.5">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <h2 className="text-[14px] font-semibold text-foreground">AI Recommendations</h2>
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5">Smart suggestions to improve your marketing</p>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {aiRecommendations.map((rec, i) => (
                <div key={i} className={cn(
                  "flex items-start gap-3 rounded-lg border px-4 py-3",
                  rec.priority === "high" ? "border-amber-500/30 bg-amber-500/5 dark:border-amber-500/20 dark:bg-amber-500/10" : "border-border"
                )}>
                  <rec.icon className={cn(
                    "h-4 w-4 flex-shrink-0 mt-0.5",
                    rec.priority === "high" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                  )} />
                  <p className="text-[13px] text-foreground flex-1">{rec.text}</p>
                  <Button variant="ghost" size="sm" className="h-7 text-[11px] flex-shrink-0">
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
