// src/app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';

type Task = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  category: 'SLEEP' | 'WORK' | 'GOAL' | 'ROUTINE' | 'BUFFER';
  duration: number;
  verificationNote?: string;
  isNegotiable?: boolean;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyStrategy, setDailyStrategy] = useState('');
  const [planInfo, setPlanInfo] = useState({ day: 1, totalDays: 30 }); // Default
  const [loading, setLoading] = useState(true);
  const [pivotReason, setPivotReason] = useState('');
  const [showPivot, setShowPivot] = useState(false);
  const [verifyingTask, setVerifyingTask] = useState<string | null>(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [identityPoints, setIdentityPoints] = useState(0); // Day 1 starts at 0

  useEffect(() => {
    fetch('/api/plans/current')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.todaySchedule.tasks || []);
        setDailyStrategy(data.todaySchedule.dailyStrategy || "Execute the plan.");
        setPlanInfo({
            day: data.todaySchedule.dayNumber || 1,
            totalDays: data.durationDays || 30
        });
        setLoading(false);
      });
  }, []);

  const toggleTask = async (taskId: string, currentStatus: string) => {
    // If pending, open verification modal instead of instant complete
    if (currentStatus === 'PENDING') {
        setVerifyingTask(taskId);
        return;
    }

    // Toggle back to pending
    const newStatus = 'PENDING';
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await updateTask(taskId, { status: newStatus });
  };

  const submitVerification = async () => {
    if (!verifyingTask) return;

    const taskId = verifyingTask;
    const newStatus = 'COMPLETED';

    // Optimistic Update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus, verificationNote } : t));
    setIdentityPoints(prev => prev + 15);
    setVerifyingTask(null);
    setVerificationNote('');

    await updateTask(taskId, { status: newStatus, verificationNote });
  };

  const updateTask = async (taskId: string, payload: any) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const handlePivot = async () => {
    if (!pivotReason) return;
    setLoading(true);
    setShowPivot(false);

    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const res = await fetch('/api/plans/pivot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentTime: now, reason: pivotReason }),
    });

    const data = await res.json();
    if (data.newSchedule) {
      setTasks(prev => [
        ...prev.filter(t => t.status === 'COMPLETED'), // Keep completed
        ...data.newSchedule // Add new
      ]);
    }
    setLoading(false);
    setPivotReason('');
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
        case 'WORK': return 'border-l-blue-500 bg-blue-900/10';
        case 'GOAL': return 'border-l-purple-500 bg-purple-900/10';
        case 'ROUTINE': return 'border-l-gray-500 bg-gray-800/50';
        case 'BUFFER': return 'border-l-amber-500 bg-amber-900/10';
        case 'SLEEP': return 'border-l-indigo-900 bg-indigo-950/30';
        default: return 'border-l-gray-500';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="animate-pulse text-xl font-mono">Loading Blueprint...</div>
    </div>
  );

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  // Find current task based on time (mock logic: first pending task)
  const currentTask = tasks.find(t => t.status === 'PENDING') || tasks[tasks.length - 1];

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20 font-sans">
      {/* Top Bar: Mastery & Identity */}
      <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-lg font-bold text-white">Day {planInfo.day} of {planInfo.totalDays}</h1>
                    <p className="text-xs text-blue-400 font-mono">IDENTITY POINTS: {identityPoints}</p>
                </div>
                <button
                    onClick={() => setShowPivot(true)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded text-sm font-semibold border border-red-500/30 transition-colors"
                >
                    Pivot
                </button>
            </div>

            {/* Mastery Bar */}
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden relative">
                <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-6">

        {/* Daily Strategy Card */}
        <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Daily Strategy</h3>
            <p className="text-gray-200 italic">"{dailyStrategy}"</p>
        </div>

        {/* Current Task Highlight (GPS View) */}
        {currentTask && (
            <div className="mb-10">
                <h2 className="text-sm font-bold text-blue-400 mb-3 uppercase tracking-widest">Current Objective</h2>
                <div className={`p-6 rounded-2xl border-2 border-blue-500/50 bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>
                    </div>
                    <div className="relative z-10">
                        <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">{currentTask.category}</span>
                        <h3 className="text-3xl font-bold text-white mb-2">{currentTask.title}</h3>
                        <p className="text-xl text-gray-300 font-mono mb-6">
                            {currentTask.start} - {currentTask.end} <span className="text-gray-500">• {currentTask.duration}m</span>
                        </p>

                        <button
                            onClick={() => toggleTask(currentTask.id, currentTask.status)}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>Complete Task</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Vertical Timeline */}
        <div className="relative space-y-0 pb-20">
            {/* Continuous Line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-800" />

            {tasks.map((task, idx) => {
                const isCurrent = currentTask?.id === task.id;
                const isCompleted = task.status === 'COMPLETED';

                return (
                    <div key={task.id || idx} className={`relative pl-10 py-2 group ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-50' : 'opacity-80'}`}>
                        {/* Dot */}
                        <div className={`absolute left-[14px] top-6 w-3 h-3 rounded-full border-2 z-10 transition-colors bg-gray-900 ${
                            isCompleted ? 'border-emerald-500 bg-emerald-500' :
                            isCurrent ? 'border-blue-500 animate-pulse' : 'border-gray-600'
                        }`} />

                        {/* Block */}
                        <div
                            onClick={() => !isCompleted && toggleTask(task.id, task.status)}
                            className={`
                                relative p-4 rounded-lg border-l-4 border transition-all cursor-pointer
                                ${getCategoryColor(task.category)}
                                ${isCompleted ? 'grayscale' : 'hover:bg-gray-800'}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                        {task.title}
                                    </h4>
                                    <div className="text-xs text-gray-400 mt-1 font-mono flex items-center gap-2">
                                        <span>{task.start} - {task.end}</span>
                                        <span>•</span>
                                        <span>{task.duration}m</span>
                                        {task.verificationNote && (
                                            <span className="text-emerald-400 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isCompleted && (
                                    <div className="text-emerald-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Verification Modal ("Prove It") */}
      {verifyingTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-sm border border-gray-700 shadow-2xl">
                <h3 className="text-xl font-bold mb-2">Prove It</h3>
                <p className="text-gray-400 text-sm mb-4">Upload a photo or write a note to verify completion.</p>

                <textarea
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    placeholder="e.g. 'Hit a new PR on squats' or 'Code compiled successfully'"
                    className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-emerald-500 outline-none resize-none mb-4"
                    autoFocus
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => { setVerifyingTask(null); setVerificationNote(''); }}
                        className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submitVerification}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm"
                    >
                        Verify & Complete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Pivot Modal */}
      {showPivot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-red-400">Recalculating Route...</h2>
            <p className="text-gray-400 text-sm mb-4">Why are you off track?</p>
            <textarea
              value={pivotReason}
              onChange={(e) => setPivotReason(e.target.value)}
              placeholder="e.g. Meeting ran late..."
              className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-red-500 outline-none resize-none mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPivot(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePivot}
                disabled={!pivotReason}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pivot Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
