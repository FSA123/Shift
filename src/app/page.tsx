// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-700 bg-gray-800 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-800 lg:p-4">
          Project Blueprint
        </p>
      </div>

      <div className="relative flex flex-col place-items-center mt-20">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Design Your Life in 30 Days.
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-lg text-center">
          Project Blueprint generates a hyper-personalized, minute-by-minute schedule to help you achieve your goals.
        </p>

        <Link
          href="/onboarding"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          Start Your Plan
        </Link>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left mt-20 gap-8">
        <FeatureCard
          title="AI Architect"
          description="Builds a custom routine based on your goals and constraints."
        />
        <FeatureCard
          title="Active Timeline"
          description="Stay on track with a dynamic, checklist-style daily schedule."
        />
        <FeatureCard
          title="Pivot Engine"
          description="Life happens. Instantly re-optimize your day when things go off track."
        />
      </div>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-700 hover:bg-gray-800/30">
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {title}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-gray-400`}>
        {description}
      </p>
    </div>
  );
}
