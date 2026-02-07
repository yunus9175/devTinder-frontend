/** Subscription plan id (basic has no paid tier). */
export type MembershipType = 'basic' | 'standard' | 'premium'

export interface PaymentPlan {
  id: MembershipType
  name: string
  features: string[]
  featured?: boolean
  badge?: string
}

/** Monthly plan amounts in INR (basic has no paid tier – button disabled). */
export const membershipAmount: Record<'standard' | 'premium', number> = {
  standard: 500,
  premium: 1000,
}

export const PLANS: readonly PaymentPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    features: ['Limited daily swipes', 'Standard visibility', 'Basic filters', 'Email support'],
  },
  {
    id: 'standard',
    name: 'Standard',
    featured: true,
    badge: 'Most popular',
    features: [
      'Unlimited swipes',
      'Boosted visibility',
      'Skill & location filters',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    features: [
      'Everything in Standard',
      'See who viewed your profile',
      'Profile insights',
      '1-on-1 onboarding',
    ],
  },
]
