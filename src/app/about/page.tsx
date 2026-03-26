import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — VibeStash',
  description: 'Learn about VibeStash and our mission to curate the best vibe-coded products.',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a1a1a]">About VibeStash</h1>

      <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
        <p>
          Vibe coding is changing how software gets built. With AI-powered tools
          like Cursor, Bolt, Lovable, and v0, a new generation of makers is
          shipping real products faster than ever before &mdash; often in hours
          instead of months.
        </p>

        <p>
          VibeStash exists to curate and celebrate the best of what this
          movement produces. We collect, organize, and showcase products that
          were built using AI coding tools so you can discover what is possible,
          find inspiration for your own projects, and connect with fellow
          builders.
        </p>

        <p>
          Whether you are a seasoned developer exploring AI-assisted workflows
          or someone who just shipped their very first app with a prompt, this
          community is for you. Every product on VibeStash tells a story about
          what happens when human creativity meets AI capability.
        </p>

        <p>
          We believe the best way to understand the vibe coding revolution is to
          see what people are actually building. That is why we welcome
          submissions from anyone &mdash; if you have built something cool with
          AI tools, we want to hear about it.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/submit"
          className="inline-flex rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#e55a2a] transition-colors"
        >
          Submit a product
        </Link>
      </div>
    </main>
  );
}
