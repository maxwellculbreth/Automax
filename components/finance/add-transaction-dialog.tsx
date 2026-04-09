"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import { AddIncomeDialog } from "./add-income-dialog"
import { AddExpenseDialog } from "./add-expense-dialog"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const [showIncome, setShowIncome] = useState(false)
  const [showExpense, setShowExpense] = useState(false)

  const handleClose = () => onOpenChange(false)

  const handleIncome = () => {
    onOpenChange(false)
    setShowIncome(true)
  }

  const handleExpense = () => {
    onOpenChange(false)
    setShowExpense(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-bold">Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2 pb-1">
            <button
              onClick={handleIncome}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 hover:bg-emerald-950/40 hover:border-emerald-700 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-900/50 flex items-center justify-center group-hover:bg-emerald-800/60 transition-colors">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-foreground">Income</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Log a payment received</p>
              </div>
            </button>

            <button
              onClick={handleExpense}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 hover:bg-red-950/40 hover:border-red-700 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-red-900/50 flex items-center justify-center group-hover:bg-red-800/60 transition-colors">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-foreground">Expense</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Record a business cost</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AddIncomeDialog open={showIncome} onOpenChange={setShowIncome} />
      <AddExpenseDialog open={showExpense} onOpenChange={setShowExpense} />
    </>
  )
}
