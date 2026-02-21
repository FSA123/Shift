// src/app/api/plans/current/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching current active plan and today's schedule
  const today = new Date().toISOString().split('T')[0];

  // Mock "Elite Programmer" Day 1
  const mockPlan = {
    planId: "mock-plan-abc",
    startDate: today,
    endDate: "2023-12-31", // Adjusted dynamically in real app
    durationDays: 90, // Example
    status: "ACTIVE",
    todaySchedule: {
      date: today,
      dayNumber: 1,
      dailyStrategy: "Day 1 is about setting the baseline. Don't overdo it. Focus on hitting the non-negotiables and setting up your environment for success.",
      tasks: [
        { id: "task-1", title: "Wake Up & Hydrate", start: "07:00", end: "07:30", status: "PENDING", duration: 30, category: "ROUTINE" },
        { id: "task-2", title: "Initial Assessment & Goal Setting", start: "07:30", end: "08:30", status: "PENDING", duration: 60, category: "GOAL" },
        { id: "task-3", title: "Setup Workspace / Environment", start: "08:30", end: "09:30", status: "PENDING", duration: 60, category: "ROUTINE" },
        { id: "task-4", title: "Deep Work: Project Scoping", start: "09:30", end: "12:30", status: "PENDING", duration: 180, category: "WORK" },
        { id: "task-5", title: "Lunch & Walk", start: "12:30", end: "13:30", status: "PENDING", duration: 60, category: "BUFFER" },
        { id: "task-6", title: "Skill Baseline Test", start: "13:30", end: "15:30", status: "PENDING", duration: 120, category: "GOAL" },
        { id: "task-7", title: "Transition: Decompress", start: "15:30", end: "15:45", status: "PENDING", duration: 15, category: "BUFFER" },
        { id: "task-8", title: "Light Exercise / Mobility", start: "15:45", end: "16:45", status: "PENDING", duration: 60, category: "GOAL" },
        { id: "task-9", title: "Dinner & Relax", start: "16:45", end: "18:00", status: "PENDING", duration: 75, category: "ROUTINE" },
        { id: "task-10", title: "Plan Tomorrow & Journal", start: "18:00", end: "19:00", status: "PENDING", duration: 60, category: "ROUTINE" },
        { id: "task-11", title: "Sleep", start: "19:00", end: "07:00", status: "PENDING", duration: 720, category: "SLEEP" },
      ]
    }
  };

  return NextResponse.json(mockPlan, { status: 200 });
}
