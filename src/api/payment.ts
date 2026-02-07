import axios from 'axios'
import { api } from './client'

/** Request body for POST /payment/create (amount is determined by the backend from membershipType) */
export interface CreateOrderPayload {
  currency: string
  receipt: string
  membershipType: 'basic' | 'standard' | 'premium'
}

/** Order object returned by the API */
export interface OrderEntity {
  amount: number
  amount_due: number
  amount_paid: number
  attempts: number
  created_at: number
  currency: string
  entity: string
  id: string
  notes?: Record<string, string>
  offer_id: string | null
  receipt: string
  status: string
}

/** Response from POST /payment/create */
export interface CreateOrderResponse {
  order: OrderEntity
  /** Razorpay key ID to use for checkout (e.g. rzp_test_...) */
  keyId: string
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data) {
    const data = err.response.data as { error?: string; message?: string }
    return data.error ?? data.message ?? 'Request failed'
  }
  return err instanceof Error ? err.message : 'Request failed'
}

/**
 * Creates a payment order via POST /payment/create.
 * Use the returned order.id for checkout (e.g. Razorpay).
 */
export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  try {
    const { data } = await api.post<CreateOrderResponse>('/payment/create', payload)
    if (data?.order && data?.keyId) {
      return data
    }
    throw new Error('Invalid payment/create response')
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}
