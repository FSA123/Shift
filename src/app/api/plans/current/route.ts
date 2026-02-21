// src/app/api/plans/current/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching current active plan and today's schedule
  const today = new Date().toISOString().split('T')[0];
  const mockPlan = {
    planId: "mock-plan-abc",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    durationDays: 30,
    status: "ACTIVE",
    todaySchedule: {
      date: today,
      dayNumber: 5,
      tasks: [
        { id: "task-1", title: "Wake Up", start: "07:00", end: "07:30", status: "COMPLETED" },
        { id: "task-2", title: "Morning Run", start: "07:30", end: "08:00", status: "PENDING" },
        // ... more tasks
      ]
    }
  };

  return NextResponse.json(mockPlan, { status: 200 });
}
