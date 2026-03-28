import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'wtf is vibestash',
  description: 'The place where vibe-coded products live. Built weird, shipped fast.',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-mbogray-900 dark:text-white tracking-tight">
        wtf is vibestash
      </h1>

      <div className="mt-10 space-y-5 text-[17px] text-mbogray-600 dark:text-amber-100/70 leading-relaxed">
        <p>
          people are building entire apps with AI in like... 2 hours. sometimes
          as a joke. sometimes the joke gets 500k views on X. sometimes the joke
          becomes an actual product.
        </p>

        <p>
          <strong className="text-mbogray-900 dark:text-white">vibestash is where all of that lives.</strong>
        </p>

        <p>
          we catalog the best stuff coming out of the vibe coding movement. the
          tools people make with Cursor and Claude and Bolt and whatever drops
          next week. the dumb ones. the genius ones. the ones that are somehow
          both.
        </p>

        <p>
          this is not a curated gallery. this is not a startup directory. this is
          the place you come when you want to see what unhinged thing someone
          shipped at 3am on a tuesday.
        </p>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-mbogray-900 dark:text-white mb-3">
          how it works
        </h3>
        <ul className="space-y-2 text-[17px] text-mbogray-600 dark:text-amber-100/70">
          <li>— somebody ships something weird</li>
          <li>— if it&apos;s good (or spectacularly bad) it ends up here</li>
          <li>— you upvote the ones you like</li>
          <li>— you find stuff before it blows up on X</li>
          <li>— you feel smug about it later</li>
        </ul>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-mbogray-900 dark:text-white mb-3">
          who are we
        </h3>
        <p className="text-[17px] text-mbogray-600 dark:text-amber-100/70 leading-relaxed">
          <a
            href="https://layertwo.design"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            layertwo.design
          </a>{' '}
          built this. we&apos;re a design studio that works with web3 and AI
          startups. we were deep in the vibe coding scene and realized nobody was
          collecting all this stuff in one place.
        </p>
        <p className="text-[17px] text-mbogray-600 dark:text-amber-100/70 mt-3">
          so we did.
        </p>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-mbogray-900 dark:text-white mb-3">
          want in? 🚀
        </h3>
        <p className="text-[17px] text-mbogray-600 dark:text-amber-100/70 mb-6">
          submit your project. or just come browse. we add new stuff constantly.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Submit a product
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full border border-mbogray-300 dark:border-mbogray-600 px-6 py-2.5 text-sm font-medium text-mbogray-700 dark:text-mbogray-300 hover:bg-mbogray-100 dark:hover:bg-mbogray-800 transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
    </main>
  );
}
