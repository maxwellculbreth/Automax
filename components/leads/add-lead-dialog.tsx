"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DollarSign, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useCreateLead, useLeads, useDashboardKPIs, useUrgentItems } from "@/hooks/use-data"

interface AddLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ValidationErrors {
  name?: string
  phone?: string
  service?: string
}

const services = [
  "Driveway",
  "Driveway + Patio",
  "Full House Wash",
  "Fence + Deck",
  "Pool Deck",
  "Commercial Storefront",
  "Restaurant Exterior",
  "HOA Common Areas",
  "Property Management",
  "Other",
]

const sources = [
  "Google Ads",
  "Google Search",
  "Facebook Ad",
  "Nextdoor",
  "Yelp",
  "Referral",
  "Repeat Customer",
  "LinkedIn",
  "Website Form",
  "Phone Call",
  "Other",
]

export function AddLeadDialog({ open, onOpenChange }: AddLeadDialogProps) {
  const { createLead, isCreating } = useCreateLead()
  const { mutate: mutateLeads } = useLeads()
  const { mutate: mutateKPIs } = useDashboardKPIs()
  const { mutate: mutateUrgent } = useUrgentItems()
  
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    source: "",
    sqft: "",
    estimated_value: "",
    notes: "",
    property_type: "residential" as "residential" | "commercial",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: ValidationErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }
    if (!formData.service) {
      newErrors.service = "Service is required"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const result = await createLead({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || null,
      address: formData.address?.trim() || null,
      service: formData.service,
      source: formData.source || null,
      sqft: formData.sqft ? parseInt(formData.sqft) : null,
      estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
      notes: formData.notes?.trim() || null,
      property_type: formData.property_type,
      status: "new",
    })

    if (result) {
      // Revalidate all relevant data
      mutateLeads()
      mutateKPIs()
      mutateUrgent()
      
      // Show success toast
      toast.success("Lead added successfully", {
        description: `${formData.name.trim()} has been added to your pipeline.`,
        duration: 3000,
      })
      
      // Close modal
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        service: "",
        source: "",
        sqft: "",
        estimated_value: "",
        notes: "",
        property_type: "residential",
      })
      setErrors({})
    } else {
      // Show error toast
      toast.error("Failed to add lead", {
        description: "Please try again or contact support if the issue persists.",
        duration: 5000,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px]">Add New Lead</DialogTitle>
          <DialogDescription className="text-[13px]">
            Enter lead information to add them to your pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[13px]">Name *</Label>
            <Input 
              id="name" 
              placeholder="John Smith" 
              className={`h-9 text-[13px] ${errors.name ? "border-red-500" : ""}`}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-[12px] text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-[13px]">Phone *</Label>
              <Input 
                id="phone" 
                placeholder="(512) 555-0100" 
                className={`h-9 text-[13px] ${errors.phone ? "border-red-500" : ""}`}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              {errors.phone && (
                <p className="text-[12px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[13px]">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@email.com" 
                className="h-9 text-[13px]"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="text-[13px]">Property Address</Label>
            <Input 
              id="address" 
              placeholder="1234 Main St, Austin, TX" 
              className="h-9 text-[13px]"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="service" className="text-[13px]">Service *</Label>
              <Select value={formData.service} onValueChange={(v) => handleChange("service", v)}>
                <SelectTrigger className={`h-9 text-[13px] ${errors.service ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service} className="text-[13px]">
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service && (
                <p className="text-[12px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.service}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source" className="text-[13px]">Source</Label>
              <Select value={formData.source} onValueChange={(v) => handleChange("source", v)}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source} className="text-[13px]">
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="sqft" className="text-[13px]">Square Footage</Label>
              <Input 
                id="sqft" 
                type="number" 
                placeholder="800" 
                className="h-9 text-[13px]"
                value={formData.sqft}
                onChange={(e) => handleChange("sqft", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value" className="text-[13px]">Est. Value</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  id="value" 
                  type="number" 
                  placeholder="350" 
                  className="h-9 pl-8 text-[13px]"
                  value={formData.estimated_value}
                  onChange={(e) => handleChange("estimated_value", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-[13px]">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Initial message or details about the job..."
              className="min-h-[80px] text-[13px] resize-none"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-9 text-[13px]"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="h-9 text-[13px]"
            disabled={isCreating || !formData.name || !formData.phone || !formData.service}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Lead"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
