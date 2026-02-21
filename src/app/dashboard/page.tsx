// src/app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';

type Task = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  duration?: number;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [pivotReason, setPivotReason] = useState('');
  const [showPivot, setShowPivot] = useState(false);

  useEffect(() => {
    fetch('/api/plans/current')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.todaySchedule.tasks || []);
        setLoading(false);
      });
  }, []);

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';

    // Optimistic Update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
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
      // Replace future tasks with new schedule
      // For this mock, we just append/replace
      setTasks(prev => [
        ...prev.filter(t => t.status === 'COMPLETED'), // Keep completed
        ...data.newSchedule // Add new
      ]);
    }
    setLoading(false);
    setPivotReason('');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="animate-pulse">Loading your blueprint...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Today's Blueprint
          </h1>
          <p className="text-sm text-gray-400">Day 5 of 30 • 45% Complete</p>
        </div>
        <button
          onClick={() => setShowPivot(true)}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold border border-red-500/50 transition-colors"
        >
          Pivot Plan
        </button>
      </header>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto space-y-4 relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />

        {tasks.map((task, idx) => (
          <div key={task.id || idx} className="relative pl-12 group">
            {/* Timeline Dot */}
            <div className={`absolute left-[13px] top-4 w-3 h-3 rounded-full border-2 z-10 transition-colors ${
              task.status === 'COMPLETED'
                ? 'bg-emerald-500 border-emerald-500'
                : 'bg-gray-900 border-gray-600 group-hover:border-blue-500'
            }`} />

            {/* Task Card */}
            <div
              onClick={() => toggleTask(task.id, task.status)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-900/10 border-emerald-500/30 opacity-60'
                  : 'bg-gray-800 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/80'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-medium ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {task.start} - {task.end} • {task.duration || 30}m
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  task.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'
                }`}>
                  {task.status === 'COMPLETED' && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pivot Modal */}
      {showPivot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Why are you pivoting?</h2>
            <textarea
              value={pivotReason}
              onChange={(e) => setPivotReason(e.target.value)}
              placeholder="e.g. Meeting ran late, traffic, feeling sick..."
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none resize-none mb-4"
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Regenerate Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
