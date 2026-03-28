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
        <h1 className="text-3xl font-bold text-mbogray-900 dark:text-white">
          Support VibeStash
        </h1>
        <p className="mt-2 text-mbogray-500 dark:text-mbogray-400">
          Help us keep curating the best vibe-coded products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-white dark:bg-mbogray-800 rounded-lg p-8 flex flex-col ${
              tier.highlighted
                ? 'border-2 border-accent shadow-sm'
                : 'border border-mbogray-200 dark:border-mbogray-700'
            }`}
          >
            <h2 className="text-lg font-semibold text-mbogray-900 dark:text-white">
              {tier.name}
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-mbogray-900 dark:text-white">
                {tier.price}
              </span>
              <span className="text-sm text-mbogray-400 dark:text-mbogray-500">{tier.period}</span>
            </div>

            <ul className="mt-6 space-y-3 flex-1">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-mbogray-600 dark:text-mbogray-400"
                >
                  <svg
                    className="h-4 w-4 mt-0.5 text-accent shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {tier.disabled ? (
                <button
                  disabled
                  className="w-full rounded-lg border border-mbogray-200 dark:border-mbogray-700 px-4 py-2.5 text-sm font-medium text-mbogray-400 dark:text-mbogray-500 cursor-not-allowed"
                >
                  {tier.cta}
                </button>
              ) : (
                <Link
                  href={tier.href}
                  className={`block w-full text-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'border border-mbogray-200 dark:border-mbogray-700 text-mbogray-800 dark:text-mbogray-200 hover:border-mbogray-300 dark:hover:border-mbogray-600'
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
