// src/app/api/plans/pivot/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { currentTime, reason } = await request.json();
    console.log(`Pivoting schedule at ${currentTime} due to: ${reason}`);

    // Mock AI Logic to adjust remaining tasks
    // For now, we return a mock adjusted schedule starting from currentTime

    return NextResponse.json({
      message: "Schedule pivoted successfully",
      newSchedule: [
        { id: "task-new-1", title: "Rescheduled Deep Work", start: currentTime, end: "18:00", duration: 120 },
        { id: "task-new-2", title: "Compressed Workout", start: "18:00", end: "18:30", duration: 30 },
        // ...
      ]
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to pivot schedule" }, { status: 500 });
  }
}
