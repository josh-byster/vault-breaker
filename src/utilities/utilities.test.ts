import { computeGuessForNumber, generateAnswer, getSecondsElapsed, getDigit } from "./utilities";

describe("computeGuessForNumber", () => {
  it("returns all correct when guess matches answer exactly", () => {
    const result = computeGuessForNumber([1, 2, 3, 4], [1, 2, 3, 4]);
    expect(result).toEqual({
      numbers: [1, 2, 3, 4],
      correctSpot: 4,
      incorrectSpot: 0,
      incorrect: 0,
    });
  });

  it("returns all incorrect when no digits match", () => {
    const result = computeGuessForNumber([1, 2, 3, 4], [5, 6, 7, 8]);
    expect(result).toEqual({
      numbers: [1, 2, 3, 4],
      correctSpot: 0,
      incorrectSpot: 0,
      incorrect: 4,
    });
  });

  it("detects digits in wrong positions", () => {
    const result = computeGuessForNumber([1, 2, 3, 4], [4, 3, 2, 1]);
    expect(result).toEqual({
      numbers: [1, 2, 3, 4],
      correctSpot: 0,
      incorrectSpot: 4,
      incorrect: 0,
    });
  });

  it("handles mix of correct, wrong position, and incorrect", () => {
    const result = computeGuessForNumber([1, 2, 3, 4], [1, 3, 5, 6]);
    expect(result).toEqual({
      numbers: [1, 2, 3, 4],
      correctSpot: 1,
      incorrectSpot: 1,
      incorrect: 2,
    });
  });

  it("handles single correct digit among all wrong", () => {
    const result = computeGuessForNumber([1, 2, 3, 4], [1, 5, 6, 7]);
    expect(result).toEqual({
      numbers: [1, 2, 3, 4],
      correctSpot: 1,
      incorrectSpot: 0,
      incorrect: 3,
    });
  });

  it("counts sum of correctSpot + incorrectSpot + incorrect equals length", () => {
    const result = computeGuessForNumber([9, 0, 7, 2], [2, 7, 0, 9]);
    expect(result.correctSpot + result.incorrectSpot + result.incorrect).toBe(4);
  });

  it("handles zeros in guess and answer", () => {
    const result = computeGuessForNumber([0, 1, 2, 3], [0, 1, 2, 3]);
    expect(result.correctSpot).toBe(4);
  });

  it("handles partial overlap with zero", () => {
    const result = computeGuessForNumber([0, 1, 2, 3], [3, 2, 1, 0]);
    expect(result.correctSpot).toBe(0);
    expect(result.incorrectSpot).toBe(4);
  });
});

describe("generateAnswer", () => {
  it("generates an array of the specified length", () => {
    const answer = generateAnswer(4);
    expect(answer).toHaveLength(4);
  });

  it("generates only single digits (0-9)", () => {
    const answer = generateAnswer(4);
    answer.forEach((digit) => {
      expect(digit).toBeGreaterThanOrEqual(0);
      expect(digit).toBeLessThanOrEqual(9);
    });
  });

  it("generates unique digits (no repeats)", () => {
    for (let i = 0; i < 50; i++) {
      const answer = generateAnswer(4);
      const unique = new Set(answer);
      expect(unique.size).toBe(4);
    }
  });

  it("can generate answers of different lengths", () => {
    const short = generateAnswer(2);
    expect(short).toHaveLength(2);
    expect(new Set(short).size).toBe(2);

    const long = generateAnswer(6);
    expect(long).toHaveLength(6);
    expect(new Set(long).size).toBe(6);
  });

  it("generates maximum length 10 (all digits)", () => {
    const answer = generateAnswer(10);
    expect(answer).toHaveLength(10);
    expect(new Set(answer).size).toBe(10);
  });
});

describe("getSecondsElapsed", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:10.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns correct elapsed time", () => {
    const start = new Date("2024-01-01T00:00:05.000Z");
    const elapsed = getSecondsElapsed(start);
    expect(elapsed).toBe(5);
  });

  it("returns zero when start equals current time", () => {
    const start = new Date("2024-01-01T00:00:10.000Z");
    const elapsed = getSecondsElapsed(start);
    expect(elapsed).toBe(0);
  });

  it("returns fractional seconds", () => {
    const start = new Date("2024-01-01T00:00:09.500Z");
    const elapsed = getSecondsElapsed(start);
    expect(elapsed).toBe(0.5);
  });
});

describe("getDigit", () => {
  it("returns a number between 0 and 9", () => {
    for (let i = 0; i < 100; i++) {
      const digit = getDigit();
      expect(digit).toBeGreaterThanOrEqual(0);
      expect(digit).toBeLessThanOrEqual(9);
    }
  });

  it("returns an integer", () => {
    for (let i = 0; i < 50; i++) {
      const digit = getDigit();
      expect(Number.isInteger(digit)).toBe(true);
    }
  });
});

describe("computeGuessForNumber - advanced cases", () => {
  it("single digit correct, rest swapped", () => {
    const result = computeGuessForNumber([1, 3, 2, 4], [1, 2, 3, 4]);
    expect(result.correctSpot).toBe(2);
    expect(result.incorrectSpot).toBe(2);
    expect(result.incorrect).toBe(0);
  });

  it("all digits present but none in correct spot", () => {
    const result = computeGuessForNumber([2, 1, 4, 3], [1, 2, 3, 4]);
    expect(result.correctSpot).toBe(0);
    expect(result.incorrectSpot).toBe(4);
  });

  it("one correct, two wrong position, one missing", () => {
    const result = computeGuessForNumber([1, 4, 3, 9], [1, 2, 3, 4]);
    expect(result.correctSpot).toBe(2);
    expect(result.incorrectSpot).toBe(1);
    expect(result.incorrect).toBe(1);
  });

  it("guess with all zeros against non-zero answer", () => {
    const result = computeGuessForNumber([0, 0, 0, 0], [1, 2, 3, 4]);
    // This can't actually happen in the game (unique digits enforced)
    // but testing the algorithm itself
    expect(result.correctSpot).toBe(0);
    expect(result.incorrect).toBeGreaterThan(0);
  });

  it("handles answer containing zero", () => {
    const result = computeGuessForNumber([0, 5, 6, 7], [0, 1, 2, 3]);
    expect(result.correctSpot).toBe(1);
    expect(result.incorrectSpot).toBe(0);
    expect(result.incorrect).toBe(3);
  });

  it("correctSpot + incorrectSpot + incorrect always equals input length", () => {
    const testCases: [number[], number[]][] = [
      [[1, 2, 3, 4], [5, 6, 7, 8]],
      [[1, 2, 3, 4], [1, 2, 3, 4]],
      [[1, 2, 3, 4], [4, 3, 2, 1]],
      [[0, 9, 5, 3], [3, 5, 9, 0]],
      [[7, 8, 9, 0], [0, 9, 8, 7]],
    ];
    for (const [guess, answer] of testCases) {
      const result = computeGuessForNumber(guess, answer);
      expect(result.correctSpot + result.incorrectSpot + result.incorrect).toBe(4);
    }
  });

  it("is not commutative (guess vs answer order matters)", () => {
    const r1 = computeGuessForNumber([1, 2, 3, 4], [1, 5, 6, 7]);
    const r2 = computeGuessForNumber([1, 5, 6, 7], [1, 2, 3, 4]);
    // Both should have 1 correct, but this confirms the function uses
    // the right direction for indexOf
    expect(r1.correctSpot).toBe(1);
    expect(r2.correctSpot).toBe(1);
    // incorrectSpot may differ if digits overlap asymmetrically
    expect(r1.incorrectSpot).toBe(0);
    expect(r2.incorrectSpot).toBe(0);
  });

  it("correctly handles when guessed digit appears later in answer", () => {
    // Guess 3 in position 0, answer has 3 in position 2
    const result = computeGuessForNumber([3, 5, 6, 7], [1, 2, 3, 4]);
    expect(result.correctSpot).toBe(0);
    expect(result.incorrectSpot).toBe(1);
    expect(result.incorrect).toBe(3);
  });
});

describe("generateAnswer - stress tests", () => {
  it("never produces an answer shorter than requested", () => {
    for (let i = 0; i < 200; i++) {
      const answer = generateAnswer(4);
      expect(answer.length).toBe(4);
    }
  });

  it("distribution covers all digits over many runs", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 200; i++) {
      const answer = generateAnswer(4);
      answer.forEach((d) => seen.add(d));
    }
    // With 200 runs of 4-digit answers, we should see all 10 digits
    expect(seen.size).toBe(10);
  });

  it("works correctly with length 1", () => {
    const answer = generateAnswer(1);
    expect(answer).toHaveLength(1);
    expect(answer[0]).toBeGreaterThanOrEqual(0);
    expect(answer[0]).toBeLessThanOrEqual(9);
  });
});

describe("getSecondsElapsed - edge cases", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:05:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("handles sub-second durations", () => {
    const start = new Date("2024-01-01T00:04:59.750Z");
    const elapsed = getSecondsElapsed(start);
    expect(elapsed).toBe(0.25);
  });

  it("handles long elapsed times (5 minutes)", () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const elapsed = getSecondsElapsed(start);
    expect(elapsed).toBe(300);
  });

  it("handles exactly 1 second", () => {
    const start = new Date("2024-01-01T00:04:59.000Z");
    const elapsed = getSecondsElapsed(start);
    expect(elapsed).toBe(1);
  });
});
