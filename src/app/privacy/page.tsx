import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — VibeStash',
  description: 'How VibeStash handles your data.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 md:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-mbogray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-mbogray-600 dark:text-mbogray-300">
        <p className="text-sm text-mbogray-400 dark:text-mbogray-500">Last updated: March 29, 2026</p>

        <h2 className="text-lg font-semibold text-mbogray-800 dark:text-mbogray-100 mt-8">What we collect</h2>
        <p>
          <strong>Newsletter subscribers:</strong> If you subscribe to our newsletter, we store your email address. That&apos;s it. No tracking pixels in emails.
        </p>
        <p>
          <strong>Account sign-in:</strong> If you sign in with Google or X, we receive your name, email, and profile picture from those providers via Supabase Auth. We use this to identify your account and display your name on submissions and upvotes.
        </p>
        <p>
          <strong>Product submissions:</strong> If you submit a product, we store the submission details you provide (URL, name, description, etc.) along with your user ID.
        </p>

        <h2 className="text-lg font-semibold text-mbogray-800 dark:text-mbogray-100 mt-8">Analytics</h2>
        <p>
          We use <a href="https://umami.is" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Umami</a> and <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Vercel Analytics</a> to understand how people use the site. Both are privacy-focused: no cookies, no personal data collection, no cross-site tracking. We see page views and basic performance metrics. We do not see who you are.
        </p>

        <h2 className="text-lg font-semibold text-mbogray-800 dark:text-mbogray-100 mt-8">What we do NOT do</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>We do not sell your data. Ever.</li>
          <li>We do not share your email with third parties.</li>
          <li>We do not run retargeting ads.</li>
          <li>We do not use cookies for tracking.</li>
        </ul>

        <h2 className="text-lg font-semibold text-mbogray-800 dark:text-mbogray-100 mt-8">Data storage</h2>
        <p>
          Your data is stored in <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Supabase</a> (hosted on AWS). The site is deployed on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Vercel</a>.
        </p>

        <h2 className="text-lg font-semibold text-mbogray-800 dark:text-mbogray-100 mt-8">Deleting your data</h2>
        <p>
          Want your account or newsletter subscription removed? Email <a href="mailto:dev@layertwodesign.com" className="text-accent hover:underline">dev@layertwodesign.com</a> and we will handle it within 48 hours.
        </p>

        <h2 className="text-lg font-semibold text-mbogray-800 dark:text-mbogray-100 mt-8">Questions</h2>
        <p>
          Reach out at <a href="mailto:dev@layertwodesign.com" className="text-accent hover:underline">dev@layertwodesign.com</a> with any privacy questions.
        </p>
      </div>
    </main>
  );
}
