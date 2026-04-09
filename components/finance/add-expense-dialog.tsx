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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useExpenseCategories, useCreateExpense, useUpdateExpense } from "@/hooks/use-data"
import type { ExpenseInsert } from "@/lib/database.types"
import { toast } from "sonner"

interface EditableExpense {
  id: string
  amount: number
  expense_date: string | null
  expense_category_id: string | null
  vendor: string | null
  description: string | null
  payment_method: string | null
}

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When provided, the dialog acts as an edit form */
  expense?: EditableExpense | null
}

const today = () => new Date().toISOString().split("T")[0]

export function AddExpenseDialog({ open, onOpenChange, expense }: AddExpenseDialogProps) {
  const { categories } = useExpenseCategories()
  const { createExpense, isCreating } = useCreateExpense()
  const { updateExpense, isUpdating } = useUpdateExpense()

  const isEditMode = !!expense

  const [amount,        setAmount]        = useState("")
  const [expenseDate,   setExpenseDate]   = useState(today())
  const [categoryId,    setCategoryId]    = useState("")
  const [vendor,        setVendor]        = useState("")
  const [description,   setDescription]  = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  // Populate fields when editing
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount?.toString() ?? "")
      setExpenseDate(expense.expense_date ?? today())
      setCategoryId(expense.expense_category_id ?? "")
      setVendor(expense.vendor ?? "")
      setDescription(expense.description ?? "")
      setPaymentMethod(expense.payment_method ?? "")
    } else {
      reset()
    }
  }, [expense, open])

  const reset = () => {
    setAmount("")
    setExpenseDate(today())
    setCategoryId("")
    setVendor("")
    setDescription("")
    setPaymentMethod("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0 || !expenseDate) return

    const payload: Partial<ExpenseInsert> = {
      amount: parsedAmount,
      expense_date: expenseDate,
      expense_category_id: categoryId || null,
      vendor: vendor || null,
      description: description || null,
      payment_method: paymentMethod || null,
    }

    let success: boolean | undefined
    if (isEditMode && expense) {
      success = await updateExpense({ id: expense.id, updates: payload })
    } else {
      success = await createExpense({ ...payload, status: "cleared" } as ExpenseInsert)
    }

    if (success) {
      toast.success(isEditMode ? "Expense updated" : "Expense added")
      reset()
      onOpenChange(false)
    } else {
      toast.error("Failed to save — check your connection.")
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const isBusy = isCreating || isUpdating

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-bold">
            {isEditMode ? "Edit Expense" : "Add Expense"}
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
                value={expenseDate}
                onChange={e => setExpenseDate(e.target.value)}
                className="h-9 text-[13px]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id} className="text-[13px]">
                    {cat.label || cat.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Vendor</Label>
            <Input
              placeholder="e.g. Home Depot"
              value={vendor}
              onChange={e => setVendor(e.target.value)}
              className="h-9 text-[13px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Description</Label>
            <Input
              placeholder="What was this expense for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-9 text-[13px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card"  className="text-[13px]">Card</SelectItem>
                <SelectItem value="cash"  className="text-[13px]">Cash</SelectItem>
                <SelectItem value="check" className="text-[13px]">Check</SelectItem>
                <SelectItem value="ach"   className="text-[13px]">ACH / Bank Transfer</SelectItem>
                <SelectItem value="other" className="text-[13px]">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" className="h-8 text-[13px]" onClick={handleClose} disabled={isBusy}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-[13px]" disabled={isBusy || !amount || !expenseDate}>
              {isBusy && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              {isEditMode ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
