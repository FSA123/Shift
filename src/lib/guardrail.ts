// src/lib/guardrail.ts

export interface Task {
  title: string;
  durationMinutes: number;
  category: 'SLEEP' | 'WORK' | 'GOAL' | 'ROUTINE' | 'BUFFER' | 'OTHER';
}

export function validateSchedule(tasks: Task[]): { valid: boolean; totalMinutes: number; error?: string } {
  const totalMinutes = tasks.reduce((sum, task) => sum + task.durationMinutes, 0);
  const EXPECTED_MINUTES = 24 * 60; // 1440 minutes

  if (totalMinutes === EXPECTED_MINUTES) {
    return { valid: true, totalMinutes };
  } else {
    return {
      valid: false,
      totalMinutes,
      error: `Total duration is ${totalMinutes} minutes, expected ${EXPECTED_MINUTES} minutes. Difference: ${EXPECTED_MINUTES - totalMinutes} minutes.`,
    };
  }
}
