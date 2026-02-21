// scripts/test-guardrail.ts
import { validateSchedule, Task } from '../src/lib/guardrail';

function testGuardrail() {
  console.log("Running Guardrail Tests...");

  // Test Case 1: Valid Schedule
  const validTasks: Task[] = [
    { title: "Sleep", durationMinutes: 480, category: 'SLEEP' }, // 8 hours
    { title: "Work", durationMinutes: 480, category: 'WORK' }, // 8 hours
    { title: "Routine", durationMinutes: 120, category: 'ROUTINE' }, // 2 hours
    { title: "Goal", durationMinutes: 240, category: 'GOAL' }, // 4 hours
    { title: "Buffer", durationMinutes: 120, category: 'BUFFER' }, // 2 hours
  ];

  const result1 = validateSchedule(validTasks);
  if (result1.valid) {
    console.log("✅ Test 1 Passed: Valid Schedule detected correctly.");
  } else {
    console.error("❌ Test 1 Failed: Valid Schedule marked invalid.", result1);
  }

  // Test Case 2: Invalid Schedule (Under 24h)
  const invalidTasksUnder: Task[] = [
    { title: "Sleep", durationMinutes: 480, category: 'SLEEP' },
    { title: "Work", durationMinutes: 480, category: 'WORK' },
  ]; // Total 16 hours = 960 mins

  const result2 = validateSchedule(invalidTasksUnder);
  if (!result2.valid) {
    console.log(`✅ Test 2 Passed: Invalid Schedule (Under) detected. Error: ${result2.error}`);
  } else {
    console.error("❌ Test 2 Failed: Invalid Schedule (Under) marked valid.", result2);
  }

  // Test Case 3: Invalid Schedule (Over 24h)
  const invalidTasksOver: Task[] = [
    { title: "Sleep", durationMinutes: 600, category: 'SLEEP' }, // 10h
    { title: "Work", durationMinutes: 600, category: 'WORK' }, // 10h
    { title: "Play", durationMinutes: 600, category: 'OTHER' }, // 10h
  ]; // Total 30h

  const result3 = validateSchedule(invalidTasksOver);
  if (!result3.valid) {
    console.log(`✅ Test 3 Passed: Invalid Schedule (Over) detected. Error: ${result3.error}`);
  } else {
    console.error("❌ Test 3 Failed: Invalid Schedule (Over) marked valid.", result3);
  }
}

testGuardrail();
