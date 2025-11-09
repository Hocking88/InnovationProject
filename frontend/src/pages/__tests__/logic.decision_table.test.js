// Tests for simple UI decision rules
// Techniques used: Decision Tables + a small State-Transition check

jest.mock('react-router-dom');




import {
  statusFromLabel,
  shouldEnableExport,
  needsScoreRerender,
} from '../Upload';



test("statusFromLabel (decision rules)", () => {
  expect(statusFromLabel(1)).toBe("SAFE");
  expect(statusFromLabel(0)).toBe("MALICIOUS");
  // robustness for anything non-1:
  expect(statusFromLabel(undefined)).toBe("MALICIOUS");
});

test("shouldEnableExport (decision rules)", () => {
  expect(shouldEnableExport("SAFE")).toBe(false);
  expect(shouldEnableExport("MALICIOUS")).toBe(true);
});

// State transition: chart text should update only when score changes
test("needsScoreRerender (state transition)", () => {
  expect(needsScoreRerender(50, 50)).toBe(false);
  expect(needsScoreRerender(50, 51)).toBe(true);
  // numeric equality across types still no re-render
  expect(needsScoreRerender("50", 50)).toBe(false);
});
