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
  getScheduledMessages,
  createScheduledMessage,
  cancelScheduledMessage,
  getAutomations,
  updateAutomation,
  getActivities,
  getJobs,
  getUpcomingJobs,
  getTodayJobs,
  getWeekJobs,
  createJob,
  getJobByLeadId,
  getQuoteByLeadId,
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
  updateExpense,
  deleteExpense,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  type Lead,
  type Message,
  type ScheduledMessage,
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
  type CustomDateRange,
  type ExpenseCategory,
  type TransactionInsert,
  type JobCreatePayload,
} from "@/lib/data-service"
import type { LeadInsert, LeadUpdate, MessageInsert, AutomationUpdate, ExpenseInsert, ScheduledMessageInsert } from "@/lib/database.types"

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
// SCHEDULED MESSAGES
// ============================================================================

export function useScheduledMessages(leadId?: string) {
  const key = leadId ? `scheduled-messages-${leadId}` : "scheduled-messages"
  const { data, error, isLoading, mutate } = useSWR<ScheduledMessage[]>(
    key,
    () => getScheduledMessages(leadId),
    { refreshInterval: 30000 }
  )

  return {
    scheduledMessages: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useCreateScheduledMessage() {
  const { trigger, isMutating } = useSWRMutation(
    "scheduled-messages",
    async (_key: string, { arg }: { arg: Omit<ScheduledMessageInsert, "company_id"> }) => {
      return await createScheduledMessage(arg)
    }
  )

  return {
    scheduleMessage: trigger,
    isScheduling: isMutating,
  }
}

export function useCancelScheduledMessage() {
  const { trigger, isMutating } = useSWRMutation(
    "scheduled-messages",
    async (_key: string, { arg }: { arg: string }) => {
      return await cancelScheduledMessage(arg)
    }
  )

  return {
    cancelMessage: trigger,
    isCancelling: isMutating,
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

export function useTodayJobs() {
  const { data, error, isLoading, mutate } = useSWR<Job[]>(
    "today-jobs",
    getTodayJobs,
    { refreshInterval: 60000 }
  )
  return { jobs: data ?? [], isLoading, isError: !!error, mutate }
}

export function useWeekJobs() {
  const { data, error, isLoading, mutate } = useSWR<Job[]>(
    "week-jobs",
    getWeekJobs,
    { refreshInterval: 60000 }
  )
  return { jobs: data ?? [], isLoading, isError: !!error, mutate }
}

export function useJobByLead(leadId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Job | null>(
    leadId ? `job-by-lead-${leadId}` : null,
    () => (leadId ? getJobByLeadId(leadId) : null),
    { revalidateOnFocus: false }
  )
  return { job: data ?? null, isLoading, isError: !!error, mutate }
}

export function useQuoteByLead(leadId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ id: string; quote_number: string; status: string; total: number } | null>(
    leadId ? `quote-by-lead-${leadId}` : null,
    () => (leadId ? getQuoteByLeadId(leadId) : null),
    { revalidateOnFocus: false }
  )
  return { quote: data ?? null, isLoading, isError: !!error, mutate }
}

export function useCreateJob() {
  const { mutate: mutateJobs } = useSWR<Job[]>("jobs")

  const { trigger, isMutating } = useSWRMutation(
    "jobs",
    async (_key: string, { arg }: { arg: JobCreatePayload }) => {
      const job = await createJob(arg)
      mutateJobs(
        (current: Job[] | undefined) => [job, ...(current ?? [])],
        { revalidate: true }
      )
      return job
    }
  )

  return {
    createJob: trigger,
    isCreating: isMutating,
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

export function useDashboardKPIs(range: DateRangeKey = "week", customRange?: CustomDateRange) {
  const cacheKey = customRange
    ? `dashboard-kpis-custom-${customRange.from.toISOString().slice(0, 10)}-${customRange.to.toISOString().slice(0, 10)}`
    : `dashboard-kpis-${range}`

  const { data, error, isLoading, mutate } = useSWR<DashboardKPIs>(
    cacheKey,
    () => getDashboardKPIs(range, customRange),
    { refreshInterval: 60000 }
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

// Shared invalidation helper for all finance mutations
const invalidateFinance = () => {
  const ranges = ["this-week", "this-month", "last-30", "this-quarter", "ytd"]
  return Promise.all(ranges.map(r => globalMutate(`finance-data-${r}`, undefined, { revalidate: true })))
}

export function useCreateExpense() {
  const { trigger, isMutating } = useSWRMutation(
    "create-expense",
    async (_key: string, { arg }: { arg: ExpenseInsert }) => {
      const success = await createExpense(arg)
      if (success) await invalidateFinance()
      return success
    }
  )
  return { createExpense: trigger, isCreating: isMutating }
}

export function useUpdateExpense() {
  const { trigger, isMutating } = useSWRMutation(
    "update-expense",
    async (_key: string, { arg }: { arg: { id: string; updates: Partial<ExpenseInsert> } }) => {
      const success = await updateExpense(arg.id, arg.updates)
      if (success) await invalidateFinance()
      return success
    }
  )
  return { updateExpense: trigger, isUpdating: isMutating }
}

export function useDeleteExpense() {
  const { trigger, isMutating } = useSWRMutation(
    "delete-expense",
    async (_key: string, { arg }: { arg: string }) => {
      const success = await deleteExpense(arg)
      if (success) await invalidateFinance()
      return success
    }
  )
  return { deleteExpense: trigger, isDeleting: isMutating }
}

export function useCreateTransaction() {
  const { trigger, isMutating } = useSWRMutation(
    "create-transaction",
    async (_key: string, { arg }: { arg: TransactionInsert }) => {
      const success = await createTransaction(arg)
      if (success) await invalidateFinance()
      return success
    }
  )
  return { createTransaction: trigger, isCreating: isMutating }
}

export function useUpdateTransaction() {
  const { trigger, isMutating } = useSWRMutation(
    "update-transaction",
    async (_key: string, { arg }: { arg: { id: string; updates: Partial<TransactionInsert> } }) => {
      const success = await updateTransaction(arg.id, arg.updates)
      if (success) await invalidateFinance()
      return success
    }
  )
  return { updateTransaction: trigger, isUpdating: isMutating }
}

export function useDeleteTransaction() {
  const { trigger, isMutating } = useSWRMutation(
    "delete-transaction",
    async (_key: string, { arg }: { arg: string }) => {
      const success = await deleteTransaction(arg)
      if (success) await invalidateFinance()
      return success
    }
  )
  return { deleteTransaction: trigger, isDeleting: isMutating }
}
