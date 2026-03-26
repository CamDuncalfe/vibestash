import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support VibeStash',
  description: 'Help us keep curating the best vibe-coded products.',
};

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Browse all products',
      'Submit products',
      'Save up to 5 favorites',
    ],
    cta: 'Get started',
    href: '/auth',
    disabled: false,
    highlighted: false,
  },
  {
    name: 'Supporter',
    price: '$5',
    period: '/mo',
    features: [
      'Everything in Free',
      'Unlimited favorites',
      'Private collections',
      'Full-res screenshots',
      'Early access',
    ],
    cta: 'Coming soon',
    href: '#',
    disabled: true,
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$35',
    period: '/mo',
    features: [
      'Everything in Supporter',
      'Unlimited team members',
      'Shared collections',
      'Centralized billing',
    ],
    cta: 'Coming soon',
    href: '#',
    disabled: true,
    highlighted: false,
  },
];

export default function SupportersPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">
          Support VibeStash
        </h1>
        <p className="mt-2 text-gray-500">
          Help us keep curating the best vibe-coded products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-white rounded-lg p-8 flex flex-col ${
              tier.highlighted
                ? 'border-2 border-[#FF6B35] shadow-sm'
                : 'border border-gray-200'
            }`}
          >
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              {tier.name}
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#1a1a1a]">
                {tier.price}
              </span>
              <span className="text-sm text-gray-400">{tier.period}</span>
            </div>

            <ul className="mt-6 space-y-3 flex-1">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <svg
                    className="h-4 w-4 mt-0.5 text-[#FF6B35] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {tier.disabled ? (
                <button
                  disabled
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  {tier.cta}
                </button>
              ) : (
                <Link
                  href={tier.href}
                  className={`block w-full text-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? 'bg-[#FF6B35] text-white hover:bg-[#e55a2a]'
                      : 'border border-gray-200 text-[#1a1a1a] hover:border-gray-300'
                  }`}
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
