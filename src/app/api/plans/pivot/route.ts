// src/app/api/plans/pivot/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { currentTime, reason } = await request.json();
    console.log(`Pivoting schedule at ${currentTime} due to: ${reason}`);

    // Mock AI Logic to adjust remaining tasks
    // In a real app, we would fetch the current plan, filter remaining tasks, and re-prompt the LLM.

    const reasonLower = reason.toLowerCase();
    let newSchedule = [];

    if (reasonLower.includes("tired") || reasonLower.includes("sick")) {
        newSchedule = [
            { id: "pivot-1", title: "Power Nap / Recovery", start: currentTime, end: "15:00", duration: 60, category: "ROUTINE", status: "PENDING" },
            { id: "pivot-2", title: "Light Work / Admin", start: "15:00", end: "17:00", duration: 120, category: "WORK", status: "PENDING" },
            { id: "pivot-3", title: "Transition: Walk", start: "17:00", end: "17:30", duration: 30, category: "BUFFER", status: "PENDING" },
            { id: "pivot-4", title: "Evening Routine", start: "17:30", end: "18:30", duration: 60, category: "ROUTINE", status: "PENDING" },
        ];
    } else if (reasonLower.includes("emergency") || reasonLower.includes("urgent")) {
        newSchedule = [
            { id: "pivot-1", title: "Handle Emergency", start: currentTime, end: "16:00", duration: 120, category: "Work", status: "PENDING" },
            { id: "pivot-2", title: "Compressed Deep Work", start: "16:00", end: "18:00", duration: 120, category: "WORK", status: "PENDING" },
            { id: "pivot-3", title: "Quick Transition", start: "18:00", end: "18:15", duration: 15, category: "BUFFER", status: "PENDING" },
            { id: "pivot-4", title: "Goal Work", start: "18:15", end: "19:45", duration: 90, category: "GOAL", status: "PENDING" },
        ];
    } else {
        // Standard Shift
        newSchedule = [
            { id: "pivot-1", title: "Rescheduled Deep Work", start: currentTime, end: "18:00", duration: 120, category: "WORK", status: "PENDING" },
            { id: "pivot-2", title: "Transition: Decompress", start: "18:00", end: "18:15", duration: 15, category: "BUFFER", status: "PENDING" },
            { id: "pivot-3", title: "Compressed Goal Work", start: "18:15", end: "19:15", duration: 60, category: "GOAL", status: "PENDING" },
            { id: "pivot-4", title: "Dinner & Relax", start: "19:15", end: "20:15", duration: 60, category: "ROUTINE", status: "PENDING" },
            { id: "pivot-5", title: "Late Night Study", start: "20:15", end: "22:15", duration: 120, category: "GOAL", status: "PENDING" },
            { id: "pivot-6", title: "Sleep", start: "22:15", end: "07:00", duration: 525, category: "SLEEP", status: "PENDING" },
        ];
    }

    return NextResponse.json({
      message: "Schedule pivoted successfully",
      newSchedule: newSchedule
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to pivot schedule" }, { status: 500 });
  }
}
