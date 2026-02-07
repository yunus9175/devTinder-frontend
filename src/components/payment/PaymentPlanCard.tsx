import type { PaymentPlan } from '../../constants/payment'
import { Button } from '../ui/Button'

interface PaymentPlanCardProps {
  plan: PaymentPlan
  amount: number | null
  isLoading: boolean
  onChoosePlan: () => void
}

export function PaymentPlanCard({ plan, amount, isLoading, onChoosePlan }: PaymentPlanCardProps) {
  const isBasic = plan.id === 'basic'
  const isFeatured = plan.featured

  return (
    <article
      className={`relative card bg-base-100 border ${
        isFeatured ? 'border-primary shadow-2xl scale-[1.02]' : 'border-base-300 shadow-lg'
      } transition-transform`}
    >
      {isFeatured && plan.badge && (
        <div className="absolute -top-3 right-4">
          <span className="badge badge-primary badge-sm">{plan.badge}</span>
        </div>
      )}
      <div className="card-body">
        <h2 className="text-lg font-semibold text-base-content">{plan.name}</h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-base-content/60">Billed monthly</p>
        <div className="mt-4 flex items-baseline gap-1">
          {amount !== null ? (
            <>
              <span className="text-3xl font-bold text-base-content">₹{amount}</span>
              <span className="text-xs text-base-content/60">/month</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-base-content/70">Free</span>
          )}
        </div>

        <ul className="mt-4 space-y-2 text-sm text-base-content/80">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button
            type="button"
            fullWidth
            disabled={isBasic || isLoading}
            className={`btn-md ${
              isFeatured
                ? 'btn-primary'
                : 'btn-outline border-primary text-primary hover:bg-primary hover:text-primary-content'
            }`}
            onClick={onChoosePlan}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : isBasic ? (
              'Current plan'
            ) : (
              'Choose plan'
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}
