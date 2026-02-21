// src/app/api/plans/generate/route.ts
import { NextResponse } from 'next/server';
import { validateSchedule, Task } from '@/lib/guardrail';

export async function POST(request: Request) {
  try {
    const { duration, startDate, identity, identityElaboration, struggles } = await request.json();
    console.log(`Generating ${duration}-day plan starting ${startDate} for identity: ${identity}`);
    console.log(`Context: Struggles with ${struggles.join(", ")}, Elaboration: ${identityElaboration}`);

    let mockTasks: Task[] = [];
    let dailyStrategy = "";

    // Adjust strategy based on duration and struggles
    if (duration === 90) {
        dailyStrategy = `Day 1 of 90. This is a marathon, not a sprint. We are starting with foundation setting. `;
    } else if (duration === 30) {
        dailyStrategy = `Day 1 of 30. High intensity kickoff. Immediate action required. `;
    }

    if (struggles.includes("Procrastination")) {
        dailyStrategy += "Your schedule includes shorter, punchy work blocks to keep momentum high.";
    } else if (struggles.includes("Burnout")) {
        dailyStrategy += "We've prioritized extended recovery buffers and a hard stop at 6 PM.";
    }

    if (identity === "The Elite Programmer") {
        mockTasks = [
            { title: "Wake Up & Hydrate", durationMinutes: 30, category: 'ROUTINE' },
            { title: "LeetCode / Algo Warmup", durationMinutes: 60, category: 'GOAL' },
            { title: "Transition: Coffee & Setup", durationMinutes: 15, category: 'BUFFER' },
            { title: "Deep Work: Core Feature Dev", durationMinutes: 240, category: 'WORK' },
            { title: "Lunch & Walk", durationMinutes: 60, category: 'BUFFER' },
            { title: "Code Review & Architecture", durationMinutes: 240, category: 'WORK' },
            { title: "Transition: Decompress", durationMinutes: 15, category: 'BUFFER' },
            { title: "Side Project / Learning", durationMinutes: 90, category: 'GOAL' },
            { title: "Dinner & Relax", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Read Technical Papers", durationMinutes: 120, category: 'GOAL' },
            { title: "Sleep", durationMinutes: 510, category: 'SLEEP' }, // 8.5 hours
        ];
    } else if (identity === "The Hybrid Athlete") {
        mockTasks = [
            { title: "Wake Up & Electrolytes", durationMinutes: 30, category: 'ROUTINE' },
            { title: "Zone 2 Run (Low HR)", durationMinutes: 90, category: 'GOAL' },
            { title: "Post-Run Fuel & Shower", durationMinutes: 30, category: 'ROUTINE' },
            { title: "Transition: Commute/Setup", durationMinutes: 15, category: 'BUFFER' },
            { title: "Deep Work Block 1", durationMinutes: 240, category: 'WORK' },
            { title: "Lunch & Mobility Work", durationMinutes: 60, category: 'BUFFER' },
            { title: "Deep Work Block 2", durationMinutes: 240, category: 'WORK' },
            { title: "Transition: Pre-Workout", durationMinutes: 15, category: 'BUFFER' },
            { title: "Strength Training (Heavy)", durationMinutes: 90, category: 'GOAL' },
            { title: "Dinner & Protein", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Recovery / Stretching", durationMinutes: 90, category: 'ROUTINE' },
            { title: "Sleep", durationMinutes: 480, category: 'SLEEP' }, // 8 hours
        ];
    } else {
        // Default / Generic Day 1
        mockTasks = [
            { title: "Wake Up & Hydrate", durationMinutes: 30, category: 'ROUTINE' },
            { title: "Initial Assessment & Goal Setting", durationMinutes: 60, category: 'GOAL' },
            { title: "Setup Workspace / Environment", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Deep Work: Project Scoping", durationMinutes: 180, category: 'WORK' },
            { title: "Lunch & Walk", durationMinutes: 60, category: 'BUFFER' },
            { title: "Skill Baseline Test", durationMinutes: 120, category: 'GOAL' },
            { title: "Transition: Decompress", durationMinutes: 15, category: 'BUFFER' },
            { title: "Light Exercise / Mobility", durationMinutes: 60, category: 'GOAL' },
            { title: "Dinner & Relax", durationMinutes: 75, category: 'ROUTINE' },
            { title: "Plan Tomorrow & Journal", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Sleep", durationMinutes: 720, category: 'SLEEP' },
        ];
    }

    // Validate the schedule using the Guardrail
    const validation = validateSchedule(mockTasks);

    if (!validation.valid) {
      console.error("AI Hallucinated an invalid schedule:", validation.error);
      return NextResponse.json({
        error: "AI Generation Error: Schedule validation failed.",
        details: validation.error
      }, { status: 500 });
    }

    // Simulate saving plan to DB...

    return NextResponse.json({
      message: "Plan generated successfully",
      planId: "mock-plan-abc",
      schedule: mockTasks,
      dailyStrategy: dailyStrategy,
      validation: validation
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
