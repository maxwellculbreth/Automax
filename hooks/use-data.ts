// SWR hooks for data fetching
// These hooks provide real-time data with caching and revalidation

"use client"

import useSWR, { mutate as globalMutate } from "swr"
import useSWRMutation from "swr/mutation"
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getMessages,
  createMessage,
  markMessagesRead,
  getAutomations,
  updateAutomation,
  getActivities,
  getJobs,
  getUpcomingJobs,
  getBusiness,
  updateBusiness,
  getUsers,
  getCurrentUser,
  getDashboardKPIs,
  getUrgentItems,
  getAIGenerations,
  getCurrentCompany,
  getFinanceData,
  getExpenseCategories,
  createExpense,
  type Lead,
  type Message,
  type Automation,
  type Activity,
  type Job,
  type Business,
  type User,
  type DashboardKPIs,
  type UrgentItem,
  type AIGeneration,
  type Company,
  type FinanceData,
  type DateRangeKey,
  type ExpenseCategory,
} from "@/lib/data-service"
import type { LeadInsert, LeadUpdate, MessageInsert, AutomationUpdate, ExpenseInsert } from "@/lib/database.types"

// ============================================================================
// LEADS
// ============================================================================

export function useLeads() {
  const { data, error, isLoading, mutate } = useSWR<Lead[]>("leads", getLeads, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    leads: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useLead(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Lead | null>(
    id ? `lead-${id}` : null,
    () => (id ? getLead(id) : null)
  )

  return {
    lead: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useCreateLead() {
  const { trigger, isMutating } = useSWRMutation(
    "leads",
    async (_key: string, { arg }: { arg: LeadInsert }) => {
      return await createLead(arg)
    }
  )

  return {
    createLead: trigger,
    isCreating: isMutating,
  }
}

export function useUpdateLead() {
  const { mutate: mutateLeads } = useSWR("leads")
  
  const { trigger, isMutating } = useSWRMutation(
    "leads",
    async (_key: string, { arg }: { arg: { id: string; updates: LeadUpdate & { completed_at?: string } } }) => {
      const result = await updateLead(arg.id, arg.updates)
      if (result) {
        // Patch the cache immediately so the list badge updates without waiting
        // for a full re-fetch. revalidate:true runs a background refresh to confirm.
        mutateLeads(
          (current: Lead[] | undefined) =>
            current?.map((l) => (l.id === result.id ? result : l)) ?? [],
          { revalidate: true }
        )
      }
      return result
    }
  )

  return {
    updateLead: trigger,
    isUpdating: isMutating,
  }
}

export function useDeleteLead() {
  const { mutate: mutateLeads } = useSWR<Lead[]>("leads")

  const { trigger, isMutating } = useSWRMutation(
    "leads",
    async (_key: string, { arg }: { arg: string }) => {
      const success = await deleteLead(arg)
      if (success) {
        // Remove the lead from the cache immediately
        mutateLeads(
          (current: Lead[] | undefined) => current?.filter((l) => l.id !== arg) ?? [],
          { revalidate: false }
        )
      }
      return success
    }
  )

  return {
    deleteLead: trigger,
    isDeleting: isMutating,
  }
}

// ============================================================================
// MESSAGES
// ============================================================================

export function useMessages(leadId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Message[]>(
    leadId ? `messages-${leadId}` : null,
    () => (leadId ? getMessages(leadId) : []),
    {
      refreshInterval: 10000, // Refresh every 10 seconds for real-time feel
    }
  )

  return {
    messages: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useCreateMessage() {
  const { trigger, isMutating } = useSWRMutation(
    "messages",
    async (_key: string, { arg }: { arg: MessageInsert }) => {
      return await createMessage(arg)
    }
  )

  return {
    createMessage: trigger,
    isSending: isMutating,
  }
}

export function useMarkMessagesRead() {
  const { trigger, isMutating } = useSWRMutation(
    "messages",
    async (_key: string, { arg }: { arg: string }) => {
      await markMessagesRead(arg)
    }
  )

  return {
    markRead: trigger,
    isMarking: isMutating,
  }
}

// ============================================================================
// AUTOMATIONS
// ============================================================================

export function useAutomations() {
  const { data, error, isLoading, mutate } = useSWR<Automation[]>(
    "automations",
    getAutomations
  )

  return {
    automations: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useUpdateAutomation() {
  const { trigger, isMutating } = useSWRMutation(
    "automations",
    async (_key: string, { arg }: { arg: { id: string; updates: AutomationUpdate } }) => {
      return await updateAutomation(arg.id, arg.updates)
    }
  )

  return {
    updateAutomation: trigger,
    isUpdating: isMutating,
  }
}

// ============================================================================
// ACTIVITIES
// ============================================================================

export function useActivities(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<Activity[]>(
    `activities-${limit}`,
    () => getActivities(limit),
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    activities: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

// ============================================================================
// JOBS
// ============================================================================

export function useJobs() {
  const { data, error, isLoading, mutate } = useSWR<Job[]>("jobs", getJobs)

  return {
    jobs: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useUpcomingJobs(limit = 5) {
  const { data, error, isLoading, mutate } = useSWR<Job[]>(
    `upcoming-jobs-${limit}`,
    () => getUpcomingJobs(limit)
  )

  return {
    jobs: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

// ============================================================================
// BUSINESS
// ============================================================================

export function useBusiness() {
  const { data, error, isLoading, mutate } = useSWR<Business>("business", getBusiness)

  return {
    business: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useUpdateBusiness() {
  const { trigger, isMutating } = useSWRMutation(
    "business",
    async (_key: string, { arg }: { arg: Partial<Business> }) => {
      return await updateBusiness(arg)
    }
  )

  return {
    updateBusiness: trigger,
    isUpdating: isMutating,
  }
}

// ============================================================================
// USERS
// ============================================================================

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>("users", getUsers)

  return {
    users: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<User>("current-user", getCurrentUser)

  return {
    user: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  }
}

// ============================================================================
// DASHBOARD
// ============================================================================

export function useDashboardKPIs(range: DateRangeKey = "week") {
  const { data, error, isLoading, mutate } = useSWR<DashboardKPIs>(
    `dashboard-kpis-${range}`,
    () => getDashboardKPIs(range),
    {
      refreshInterval: 60000,
    }
  )

  return {
    kpis: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useUrgentItems() {
  const { data, error, isLoading, mutate } = useSWR<UrgentItem[]>(
    "urgent-items",
    getUrgentItems,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  return {
    items: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

// ============================================================================
// AI GENERATIONS
// ============================================================================

export function useAIGenerations(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<AIGeneration[]>(
    `ai-generations-${limit}`,
    () => getAIGenerations(limit)
  )

  return {
    generations: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

// ============================================================================
// COMPANY
// ============================================================================

export function useCompany() {
  const { data, error, isLoading, mutate } = useSWR<Company | null>(
    "current-company",
    getCurrentCompany,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    company: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  }
}

// ============================================================================
// FINANCE
// ============================================================================

export function useFinanceData(range = "this-month") {
  const { data, error, isLoading, mutate } = useSWR<FinanceData | null>(
    `finance-data-${range}`,
    () => getFinanceData(range),
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    financeData: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useExpenseCategories() {
  const { data, error, isLoading } = useSWR<ExpenseCategory[]>(
    "expense-categories",
    getExpenseCategories,
    { revalidateOnFocus: false }
  )

  return {
    categories: data ?? [],
    isLoading,
    isError: !!error,
  }
}

export function useCreateExpense() {
  const { trigger, isMutating } = useSWRMutation(
    "create-expense",
    async (_key: string, { arg }: { arg: ExpenseInsert }) => {
      const result = await createExpense(arg)
      if (result) {
        // Invalidate all finance-data range keys
        const ranges = ["this-week", "this-month", "last-30", "this-quarter", "ytd"]
        await Promise.all(ranges.map(r => globalMutate(`finance-data-${r}`)))
      }
      return result
    }
  )

  return {
    createExpense: trigger,
    isCreating: isMutating,
  }
}
