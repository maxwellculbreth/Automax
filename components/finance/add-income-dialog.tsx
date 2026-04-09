"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, UserPlus } from "lucide-react"
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/use-data"
import { createCompletedLeadFromIncome } from "@/lib/data-service"
import type { TransactionInsert } from "@/lib/data-service"
import { toast } from "sonner"

const INCOME_CATEGORIES = [
  "House Wash",
  "Driveway Cleaning",
  "House Wash + Driveway",
  "Roof Wash",
  "Fence Wash",
  "Patio / Concrete",
  "Commercial Wash",
  "HOA / Common Areas",
  "Fleet Washing",
  "Window Cleaning",
  "Gutter Cleaning",
  "Other",
]

const PAYMENT_METHODS = [
  { value: "cash",   label: "Cash" },
  { value: "check",  label: "Check" },
  { value: "card",   label: "Card" },
  { value: "venmo",  label: "Venmo" },
  { value: "zelle",  label: "Zelle" },
  { value: "ach",    label: "ACH / Bank Transfer" },
  { value: "other",  label: "Other" },
]

interface EditableTransaction {
  id: string
  amount: number
  transaction_date: string
  category: string | null
  description: string | null
  payment_method: string | null
}

interface AddIncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When provided, the dialog acts as an edit form */
  transaction?: EditableTransaction | null
}

const today = () => new Date().toISOString().split("T")[0]

export function AddIncomeDialog({ open, onOpenChange, transaction }: AddIncomeDialogProps) {
  const { createTransaction, isCreating } = useCreateTransaction()
  const { updateTransaction, isUpdating } = useUpdateTransaction()

  const isEditMode = !!transaction

  const [amount,           setAmount]          = useState("")
  const [date,             setDate]            = useState(today())
  const [category,         setCategory]        = useState("")
  const [description,      setDescription]     = useState("")
  const [paymentMethod,    setPaymentMethod]   = useState("")
  const [createCrmRecord,  setCreateCrmRecord] = useState(false)
  const [clientName,       setClientName]      = useState("")
  const [isCreatingLead,   setIsCreatingLead]  = useState(false)

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount?.toString() ?? "")
      setDate(transaction.transaction_date ?? today())
      setCategory(transaction.category ?? "")
      setDescription(transaction.description ?? "")
      setPaymentMethod(transaction.payment_method ?? "")
    } else {
      reset()
    }
  }, [transaction, open])

  const reset = () => {
    setAmount("")
    setDate(today())
    setCategory("")
    setDescription("")
    setPaymentMethod("")
    setCreateCrmRecord(false)
    setClientName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0 || !date) return

    let success: boolean | undefined

    if (isEditMode && transaction) {
      success = await updateTransaction({
        id: transaction.id,
        updates: {
          amount: parsedAmount,
          transaction_date: date,
          category: category || null,
          description: description || null,
          payment_method: paymentMethod || null,
        },
      })
    } else {
      const payload: TransactionInsert = {
        type: "income",
        source_type: "manual",
        amount: parsedAmount,
        transaction_date: date,
        category: category || null,
        description: description || null,
        payment_method: paymentMethod || null,
        status: "collected",
      }
      success = await createTransaction(payload)

      // Optionally create a matching completed lead/job in CRM
      if (success && createCrmRecord) {
        setIsCreatingLead(true)
        try {
          const leadId = await createCompletedLeadFromIncome({
            customerName: clientName.trim() || "Manual Entry",
            serviceType: category || "Other",
            amount: parsedAmount,
            transactionDate: date,
            description: description || null,
          })
          if (leadId) {
            toast.success("Income added + job record created in CRM")
          } else {
            toast.success("Income added")
            toast.error("Could not create CRM record — check console")
          }
        } finally {
          setIsCreatingLead(false)
        }
      } else if (success) {
        toast.success("Income added")
      }
    }

    if (success) {
      if (isEditMode) toast.success("Income updated")
      reset()
      onOpenChange(false)
    } else if (success === false) {
      toast.error("Failed to save — check your connection. If this keeps happening, run the DB migration.")
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const isBusy = isCreating || isUpdating || isCreatingLead

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-bold">
            {isEditMode ? "Edit Income" : "Add Income"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px]">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="pl-7 h-9 text-[13px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px]">Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="h-9 text-[13px]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Select service type…" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-[13px]">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Description</Label>
            <Input
              placeholder="e.g. Full house wash + driveway for Smith residence"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-9 text-[13px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="How was this paid?" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map(m => (
                  <SelectItem key={m.value} value={m.value} className="text-[13px]">{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CRM sync — only shown in add mode */}
          {!isEditMode && (
            <div className="space-y-2.5 rounded-xl border border-border bg-secondary/20 p-3.5">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="create-crm-record"
                  checked={createCrmRecord}
                  onCheckedChange={(v) => setCreateCrmRecord(!!v)}
                  className="mt-0.5"
                />
                <div>
                  <label htmlFor="create-crm-record" className="text-[13px] font-medium text-foreground cursor-pointer flex items-center gap-1.5">
                    <UserPlus className="h-3.5 w-3.5 text-blue-400" />
                    Also create completed job record in CRM
                  </label>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Use this for real completed work you want tracked as a finished job.
                  </p>
                </div>
              </div>

              {createCrmRecord && (
                <div className="pt-1">
                  <Label className="text-[12px]">Client name <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input
                    placeholder="e.g. John Smith"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="h-9 text-[13px] mt-1.5"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" className="h-8 text-[13px]" onClick={handleClose} disabled={isBusy}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-[13px] bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isBusy || !amount || !date}
            >
              {isBusy && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              {isEditMode ? "Save Changes" : "Add Income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
