// src/app/onboarding/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    routine: { wake: '', bed: '' },
    identity: '',
    energyProfile: 'Morning Lark',
    constraints: [] as string[],
    skills: {} as Record<string, number>,
    non_negotiables: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;

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
        // Trigger smart plan generation
        await fetch('/api/plans/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: 30,
            startDate: new Date().toISOString(),
            identity: formData.identity // Pass identity to generator
          }),
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
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="mb-6">
            <h1 className="text-xl font-bold text-center mb-2">Life Audit</h1>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">Step {step} of {totalSteps}</div>
        </div>

        {step === 1 && (
          <RoutineStep
            data={formData.routine}
            update={(d) => setFormData({ ...formData, routine: { ...formData.routine, ...d } })}
          />
        )}

        {step === 2 && (
          <IdentityStep
            value={formData.identity}
            update={(val) => setFormData({ ...formData, identity: val })}
          />
        )}

        {step === 3 && (
          <EnergyEnvironmentStep
            energy={formData.energyProfile}
            constraints={formData.constraints}
            updateEnergy={(val: string) => setFormData({ ...formData, energyProfile: val })}
            updateConstraints={(val: string[]) => setFormData({ ...formData, constraints: val })}
          />
        )}

        {step === 4 && (
          <SkillsStep
            skills={formData.skills}
            update={(val) => setFormData({ ...formData, skills: val })}
          />
        )}

        {step === 5 && (
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

          {step < totalSteps ? (
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
              {loading ? 'Designing Plan...' : 'Build My Blueprint'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// Step 1: Routine
function RoutineStep({ data, update }: { data: { wake: string; bed: string }; update: (d: any) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Baseline Routine</h2>
      <p className="text-gray-400 mb-6">When does your day start and end?</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Wake Up Time</label>
          <input
            type="time"
            value={data.wake}
            onChange={(e) => update({ wake: e.target.value })}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Bedtime</label>
          <input
            type="time"
            value={data.bed}
            onChange={(e) => update({ bed: e.target.value })}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Identity
function IdentityStep({ value, update }: { value: string; update: (val: string) => void }) {
  const presets = ["The Elite Programmer", "The Hybrid Athlete", "The Serial Entrepreneur", "The Zen Master", "The Polymath"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Choose Your Identity</h2>
      <p className="text-gray-400 mb-6">Who are you becoming in the next 30 days?</p>

      <div className="grid gap-3 mb-4">
        {presets.map(p => (
            <button
                key={p}
                onClick={() => update(p)}
                className={`p-3 rounded border text-left transition-colors ${
                    value === p
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
                }`}
            >
                {p}
            </button>
        ))}
      </div>
      <input
          type="text"
          value={value}
          onChange={(e) => update(e.target.value)}
          placeholder="Or type your own..."
          className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 outline-none"
        />
    </div>
  );
}

// Step 3: Energy & Environment
interface EnergyEnvironmentProps {
  energy: string;
  constraints: string[];
  updateEnergy: (val: string) => void;
  updateConstraints: (val: string[]) => void;
}

function EnergyEnvironmentStep({ energy, constraints, updateEnergy, updateConstraints }: EnergyEnvironmentProps) {
  const toggleConstraint = (c: string) => {
    if (constraints.includes(c)) updateConstraints(constraints.filter((x: string) => x !== c));
    else updateConstraints([...constraints, c]);
  };

  return (
    <div>
        <h2 className="text-2xl font-bold mb-4">Context Injection</h2>

        <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Energy Peak</label>
            <div className="flex gap-4">
                {['Morning Lark', 'Night Owl', 'Afternoon Power'].map(e => (
                    <button
                        key={e}
                        onClick={() => updateEnergy(e)}
                        className={`flex-1 p-3 rounded border text-sm ${
                            energy === e
                                ? 'bg-amber-600 border-amber-500 text-white'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        {e}
                    </button>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Environmental Constraints</label>
            <div className="grid grid-cols-2 gap-2">
                {['Loud Office', 'Home Gym', 'Commute > 1h', 'Kids/Family', 'Quiet Space Available'].map(c => (
                     <button
                        key={c}
                        onClick={() => toggleConstraint(c)}
                        className={`p-2 rounded border text-sm text-left ${
                            constraints.includes(c)
                                ? 'bg-red-900/50 border-red-500 text-white'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}

// Step 4: Skills
function SkillsStep({ skills, update }: { skills: Record<string, number>; update: (val: any) => void }) {
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if(newSkill && !skills[newSkill]) {
            update({ ...skills, [newSkill]: 1 });
            setNewSkill('');
        }
    }

    const updateLevel = (skill: string, level: number) => {
        update({ ...skills, [skill]: level });
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Skill Baseline</h2>
            <p className="text-gray-400 mb-6">Rate your current competence (1-10).</p>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. Coding, Running)..."
                    className="flex-1 p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="px-4 bg-gray-600 hover:bg-gray-500 rounded font-bold">+</button>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {Object.entries(skills).map(([skill, level]) => (
                    <div key={skill} className="bg-gray-700/50 p-3 rounded border border-gray-700">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">{skill}</span>
                            <span className="text-blue-400 font-mono">{level}/10</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="10"
                            value={level}
                            onChange={(e) => updateLevel(skill, parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>
                ))}
                {Object.keys(skills).length === 0 && (
                    <div className="text-center text-gray-500 italic">No skills added yet.</div>
                )}
            </div>
        </div>
    )
}

// Step 5: Non-Negotiables
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
      <p className="text-gray-400 mb-6">What MUST happen every day?</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add constraint (e.g. Work 9-5)..."
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
