// src/app/onboarding/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    routine: { wake: '', bed: '' },
    goals: [] as string[],
    non_negotiables: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Also trigger plan generation for the user to see something immediately
        await fetch('/api/plans/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration: 30, startDate: new Date().toISOString() }),
        });

        router.push('/dashboard');
      } else {
        alert('Failed to save data');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="mb-6 flex justify-between text-sm text-gray-400">
          <span>Step {step} of 3</span>
          <span>{Math.round((step / 3) * 100)}% Complete</span>
        </div>

        {step === 1 && (
          <RoutineStep
            data={formData.routine}
            update={(d) => setFormData({ ...formData, routine: { ...formData.routine, ...d } })}
          />
        )}

        {step === 2 && (
          <GoalsStep
            selected={formData.goals}
            update={(goals) => setFormData({ ...formData, goals })}
          />
        )}

        {step === 3 && (
          <NonNegotiablesStep
            items={formData.non_negotiables}
            update={(items) => setFormData({ ...formData, non_negotiables: items })}
          />
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white font-bold disabled:opacity-50"
            >
              {loading ? 'Generating Plan...' : 'Build My Blueprint'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function RoutineStep({ data, update }: { data: { wake: string; bed: string }; update: (d: any) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Daily Routine</h2>
      <p className="text-gray-400 mb-6">Let's set the boundaries for your day.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Wake Up Time</label>
          <input
            type="time"
            name="wake"
            value={data.wake}
            onChange={(e) => update({ wake: e.target.value })}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Bedtime</label>
          <input
            type="time"
            name="bed"
            value={data.bed}
            onChange={(e) => update({ bed: e.target.value })}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function GoalsStep({ selected, update }: { selected: string[]; update: (s: string[]) => void }) {
  const options = ['Fitness', 'Skill Acquisition', 'Productivity', 'Mindfulness', 'Career Growth', 'Organization'];

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      update(selected.filter(s => s !== option));
    } else {
      update([...selected, option]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Primary Goals</h2>
      <p className="text-gray-400 mb-6">Select up to 3 focus areas.</p>

      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`p-3 rounded border text-left transition-colors ${
              selected.includes(opt)
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function NonNegotiablesStep({ items, update }: { items: string[]; update: (i: string[]) => void }) {
  const [input, setInput] = useState('');

  const add = () => {
    if (input.trim()) {
      update([...items, input.trim()]);
      setInput('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Non-Negotiables</h2>
      <p className="text-gray-400 mb-6">What MUST happen every day? (e.g., "Work 9-5", "Pick up kids")</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add constraint..."
          className="flex-1 p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 outline-none"
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button onClick={add} className="px-4 bg-gray-600 hover:bg-gray-500 rounded font-bold">+</button>
      </div>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center p-2 bg-gray-700/50 rounded border border-gray-700">
            <span>{item}</span>
            <button
              onClick={() => update(items.filter((_, i) => i !== idx))}
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
