"use client"

import { useState } from "react"
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
import { useExpenseCategories, useCreateExpense } from "@/hooks/use-data"

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const today = () => new Date().toISOString().split("T")[0]

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  const { categories } = useExpenseCategories()
  const { createExpense, isCreating } = useCreateExpense()

  const [amount, setAmount] = useState("")
  const [expenseDate, setExpenseDate] = useState(today())
  const [categoryId, setCategoryId] = useState("")
  const [vendor, setVendor] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"pending" | "cleared">("pending")
  const [paymentMethod, setPaymentMethod] = useState("")

  const reset = () => {
    setAmount("")
    setExpenseDate(today())
    setCategoryId("")
    setVendor("")
    setDescription("")
    setStatus("pending")
    setPaymentMethod("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || !expenseDate) return

    await createExpense({
      amount: parsedAmount,
      expense_date: expenseDate,
      expense_category_id: categoryId || null,
      vendor: vendor || null,
      description: description || null,
      status,
      payment_method: paymentMethod || null,
    })

    reset()
    onOpenChange(false)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expense-date">Date *</Label>
              <Input
                id="expense-date"
                type="date"
                value={expenseDate}
                onChange={e => setExpenseDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label || cat.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              placeholder="e.g. Home Depot"
              value={vendor}
              onChange={e => setVendor(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as "pending" | "cleared")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="ach">ACH / Bank Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !amount || !expenseDate}>
              {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
