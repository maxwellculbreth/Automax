"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Automation } from "@/lib/data-service"

interface EditAutomationDialogProps {
  automation: Automation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAutomationDialog({
  automation,
  open,
  onOpenChange,
}: EditAutomationDialogProps) {
  if (!automation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px]">Edit Automation</DialogTitle>
          <DialogDescription className="text-[13px]">
            Configure the workflow settings
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[13px]">Name</Label>
            <Input id="name" defaultValue={automation.name} className="h-9 text-[13px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[13px]">Description</Label>
            <Textarea
              id="description"
              defaultValue={automation.description}
              className="min-h-[60px] text-[13px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-[13px]">Status</Label>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Enable or disable this automation
              </p>
            </div>
            <Switch defaultChecked={automation.enabled} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[13px]">Trigger</Label>
              <Select
                defaultValue={
                  automation.type === "missed_call"
                    ? "missed_call"
                    : automation.type === "new_lead"
                    ? "new_lead"
                    : automation.type === "quote_follow_up"
                    ? "quote_sent"
                    : automation.type === "review_request"
                    ? "job_completed"
                    : "lead_cold"
                }
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="missed_call" className="text-[13px]">Missed call</SelectItem>
                  <SelectItem value="new_lead" className="text-[13px]">New lead</SelectItem>
                  <SelectItem value="quote_sent" className="text-[13px]">Quote sent</SelectItem>
                  <SelectItem value="job_completed" className="text-[13px]">Job completed</SelectItem>
                  <SelectItem value="lead_cold" className="text-[13px]">Lead goes cold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay" className="text-[13px]">Delay</Label>
              <Select defaultValue="immediate">
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate" className="text-[13px]">Immediately</SelectItem>
                  <SelectItem value="1min" className="text-[13px]">1 minute</SelectItem>
                  <SelectItem value="5min" className="text-[13px]">5 minutes</SelectItem>
                  <SelectItem value="1hour" className="text-[13px]">1 hour</SelectItem>
                  <SelectItem value="24hours" className="text-[13px]">24 hours</SelectItem>
                  <SelectItem value="2days" className="text-[13px]">2 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-[13px]">Message Template</Label>
            <Textarea
              id="message"
              className="min-h-[100px] text-[13px] resize-none"
              defaultValue={
                automation.type === "missed_call"
                  ? "Hey {{first_name}}, sorry I missed your call! I'm on a job right now. What can I help you with?"
                  : automation.type === "new_lead"
                  ? "Hi {{first_name}}! Thanks for reaching out about {{service}}. I'd love to help - when's a good time to come by for a free quote?"
                  : automation.type === "quote_follow_up"
                  ? "Hi {{first_name}}, just following up on the quote I sent. Let me know if you have questions or want to get on the schedule!"
                  : automation.type === "review_request"
                  ? "Hi {{first_name}}! Thanks for choosing Crystal Clear. If you have a moment, we'd really appreciate a quick Google review!"
                  : "Hi {{first_name}}, checking in to see if you're still interested in {{service}}. Let me know if you'd like to reschedule!"
              }
            />
            <p className="text-[11px] text-muted-foreground">
              Variables: {"{{first_name}}"}, {"{{service}}"}, {"{{business_name}}"}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-8 text-[13px]">
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="h-8 text-[13px]">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
