// src/app/api/plans/current/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching current active plan and today's schedule
  const today = new Date().toISOString().split('T')[0];

  // Mock "Elite Programmer" Day 5
  const mockPlan = {
    planId: "mock-plan-abc",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    durationDays: 30,
    status: "ACTIVE",
    todaySchedule: {
      date: today,
      dayNumber: 5,
      dailyStrategy: "Focus on deep work blocks early in the day. Use transition buffers to completely disconnect from code.",
      tasks: [
        { id: "task-1", title: "Wake Up & Hydrate", start: "07:00", end: "07:30", status: "COMPLETED", duration: 30, category: "ROUTINE" },
        { id: "task-2", title: "LeetCode / Algo Warmup", start: "07:30", end: "08:30", status: "COMPLETED", duration: 60, category: "GOAL" },
        { id: "task-3", title: "Transition: Coffee & Setup", start: "08:30", end: "08:45", status: "PENDING", duration: 15, category: "BUFFER" },
        { id: "task-4", title: "Deep Work: Core Feature Dev", start: "08:45", end: "12:45", status: "PENDING", duration: 240, category: "WORK" },
        { id: "task-5", title: "Lunch & Walk", start: "12:45", end: "13:45", status: "PENDING", duration: 60, category: "BUFFER" },
        { id: "task-6", title: "Code Review & Architecture", start: "13:45", end: "17:45", status: "PENDING", duration: 240, category: "WORK" },
        { id: "task-7", title: "Transition: Decompress", start: "17:45", end: "18:00", status: "PENDING", duration: 15, category: "BUFFER" },
        { id: "task-8", title: "Side Project / Learning", start: "18:00", end: "19:30", status: "PENDING", duration: 90, category: "GOAL" },
        { id: "task-9", title: "Dinner & Relax", start: "19:30", end: "20:30", status: "PENDING", duration: 60, category: "ROUTINE" },
        { id: "task-10", title: "Read Technical Papers", start: "20:30", end: "22:30", status: "PENDING", duration: 120, category: "GOAL" },
        { id: "task-11", title: "Sleep", start: "22:30", end: "07:00", status: "PENDING", duration: 510, category: "SLEEP" },
      ]
    }
  };

  return NextResponse.json(mockPlan, { status: 200 });
}
