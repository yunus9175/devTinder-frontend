import { useState, useCallback } from 'react'
import { getProfile } from '../api/auth'
import { createOrder, verifyPremium, type OrderEntity } from '../api/payment'
import { PaymentPlanCard } from '../components/payment/PaymentPlanCard'
import { PLANS, membershipAmount } from '../constants/payment'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials } from '../store/slices/authSlice'

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
            modal?: { ondismiss?: () => void }
        }) => { open: () => void }
    }
}

export function Payments() {
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)
    const currentPlanId = (user?.membershipType ?? 'basic') as 'basic' | 'standard' | 'premium'
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    const openRazorpay = useCallback((order: OrderEntity, planName: string, keyId: string) => {
        const rzp = new window.Razorpay({
            key: keyId,
            amount: order.amount,
            order_id: order.id,
            currency: order.currency,
            name: 'DevTinder',
            description: `${planName} plan`,
            prefill: {
                email: 'yunus616@gmail.com',
                name: 'Yunus626',
            },
            theme: {
                color: '#F37254',
            },
            handler() {
                verifyPremium()
                    .then(({ isPremium }) => {
                        return getProfile().then((res) => ({ isPremium, user: res.user }))
                    })
                    .then(({ isPremium, user }) => {
                        dispatch(setCredentials(user))
                        if (isPremium) {
                            setToast("You're now a premium member! Enjoy your benefits.")
                        } else {
                            setToast('Payment successful!')
                        }
                        setTimeout(() => setToast(null), 4000)
                    })
                    .catch((err) => {
                        setError(err instanceof Error ? err.message : 'Payment verification failed')
                    })
            },
            modal: {
                ondismiss: () => {
                    setToast('Payment cancelled')
                    setTimeout(() => setToast(null), 3000)
                },
            },
        })
        try {
            rzp.open()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not open payment. Check key and order.')
        }
    }, [dispatch])

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

                {toast && (
                    <div className="toast toast-top toast-center z-50">
                        <div className={`alert shadow-lg ${toast.includes('success') || toast.includes('premium') ? 'alert-success' : 'alert-info'}`}>
                            <span>{toast}</span>
                        </div>
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
                            isCurrentPlan={plan.id === currentPlanId}
                            onChoosePlan={() => handleChoosePlan(plan.id)}
                        />
                    ))}
                </section>
            </main>
        </div>
    )
}