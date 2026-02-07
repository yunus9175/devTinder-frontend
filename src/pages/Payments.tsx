import { useState, useCallback } from 'react'
import { createOrder } from '../api/payment'
import type { OrderEntity } from '../api/payment'
import { PaymentPlanCard } from '../components/payment/PaymentPlanCard'
import { PLANS, membershipAmount } from '../constants/payment'

declare global {
    interface Window {
        Razorpay: new (options: {
            key: string
            amount: number
            order_id: string
            currency: string
            name?: string
            description?: string
            handler: (response: { razorpay_payment_id: string; razorpay_order_id: string }) => void
            prefill?: { email?: string; name?: string }
            theme?: { color?: string }
        }) => { open: () => void }
    }
}

export function Payments() {
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const openRazorpay = useCallback((order: OrderEntity, planName: string, keyId: string) => {
        const rzp = new window.Razorpay({
            key: keyId,
            amount: order.amount,
            order_id: order.id,
            currency: order.currency,
            name: 'DevTinder',
            description: `${planName} plan`,
            prefill: {
                email: 'yunus619@gmail.com',
                name: 'Yunus',
            },
            theme: {
                color: '#F37254',
            },
            handler(response: { razorpay_payment_id: string; razorpay_order_id: string }) {
                console.log(response)
                // Payment success – backend can verify via webhook or verify-payment API
            },
        })
        rzp.open()
    }, [])

    async function handleChoosePlan(planId: string) {
        const plan = PLANS.find((p) => p.id === planId)
        if (!plan) return
        setError(null)
        setLoadingPlanId(planId)
        try {
            const { order, keyId } = await createOrder({
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                membershipType: plan.id,
            })
            openRazorpay(order, plan.name, keyId)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order')
        } finally {
            setLoadingPlanId(null)
        }
    }

    return (
        <div className="min-h-dvh flex flex-col bg-base-200 safe-area-padding">
            <main className="flex-1 px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center">
                {/* Header */}
                <section className="w-full max-w-5xl text-center mb-8 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content">
                        Choose your plan
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-base-content/70">
                        All plans are <span className="font-semibold">free for the first 30 days</span>. Switch
                        or cancel anytime.
                    </p>
                </section>

                {error && (
                    <div className="w-full max-w-5xl mb-4 alert alert-error text-sm">
                        <span>{error}</span>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setError(null)}>
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Plans grid – monthly only */}
                <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {PLANS.map((plan) => (
                        <PaymentPlanCard
                            key={plan.id}
                            plan={plan}
                            amount={
                                plan.id === 'standard'
                                    ? membershipAmount.standard
                                    : plan.id === 'premium'
                                        ? membershipAmount.premium
                                        : null
                            }
                            isLoading={loadingPlanId === plan.id}
                            onChoosePlan={() => handleChoosePlan(plan.id)}
                        />
                    ))}
                </section>
            </main>
        </div>
    )
}