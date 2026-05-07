import { GameState } from "./GameState";
import { GameStatisticsService } from "../services/persistence";
import { createStubInstance, SinonStubbedInstance } from "sinon";

describe("GameState", () => {
  let state: GameState;
  let statsService: SinonStubbedInstance<GameStatisticsService>;

  beforeEach(() => {
    statsService = createStubInstance(GameStatisticsService);
    state = new GameState(statsService);
  });

  describe("initialization", () => {
    it("starts with empty numbers array", () => {
      expect(state.numbers).toEqual([]);
    });

    it("starts with empty guesses array", () => {
      expect(state.guesses).toEqual([]);
    });

    it("generates a 4-digit answer with unique digits", () => {
      expect(state.answer).toHaveLength(4);
      expect(new Set(state.answer).size).toBe(4);
    });

    it("does not show game alert initially", () => {
      expect(state.showGameAlert).toBe(false);
    });

    it("starts with hints available", () => {
      expect(state.hintsLeft).toBe(true);
    });

    it("starts with undefined startTime", () => {
      expect(state.startTime).toBeUndefined();
    });
  });

  describe("addNumber", () => {
    it("adds a digit to the numbers array", () => {
      state.addNumber(5);
      expect(state.numbers).toEqual([5]);
    });

    it("adds multiple different digits", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      expect(state.numbers).toEqual([1, 2, 3]);
    });

    it("does not add more than NUMBER_LENGTH digits", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.addNumber(5);
      expect(state.numbers).toHaveLength(4);
      expect(state.numbers).toEqual([1, 2, 3, 4]);
    });

    it("is idempotent - does not add duplicate digits", () => {
      state.addNumber(3);
      state.addNumber(3);
      expect(state.numbers).toEqual([3]);
    });

    it("handles zero correctly", () => {
      state.addNumber(0);
      expect(state.numbers).toEqual([0]);
    });

    it("rejects duplicate zero", () => {
      state.addNumber(0);
      state.addNumber(0);
      expect(state.numbers).toEqual([0]);
    });
  });

  describe("clearNumbers", () => {
    it("removes all entered numbers", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.clearNumbers();
      expect(state.numbers).toEqual([]);
    });

    it("is safe to call when already empty", () => {
      state.clearNumbers();
      expect(state.numbers).toEqual([]);
    });
  });

  describe("removeLastNumber", () => {
    it("removes the last entered number", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.removeLastNumber();
      expect(state.numbers).toEqual([1, 2]);
    });

    it("results in empty array when only one number present", () => {
      state.addNumber(5);
      state.removeLastNumber();
      expect(state.numbers).toEqual([]);
    });

    it("is safe to call when already empty", () => {
      state.removeLastNumber();
      expect(state.numbers).toEqual([]);
    });
  });

  describe("submitClicked", () => {
    it("does nothing when numbers are incomplete", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.submitClicked();
      expect(state.guesses).toHaveLength(0);
    });

    it("adds a guess when numbers are complete", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.guesses).toHaveLength(1);
    });

    it("clears numbers after submission", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.numbers).toEqual([]);
    });

    it("sets startTime on first guess", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.startTime).toBeInstanceOf(Date);
    });

    it("does not override startTime on subsequent guesses", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      const firstStartTime = state.startTime;

      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.addNumber(8);
      state.submitClicked();
      expect(state.startTime).toBe(firstStartTime);
    });

    it("computes correct guess feedback", () => {
      // Force a known answer
      state.answer = [1, 2, 3, 4];
      state.addNumber(1);
      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.submitClicked();
      expect(state.guesses[0]).toEqual({
        numbers: [1, 5, 6, 7],
        correctSpot: 1,
        incorrectSpot: 0,
        incorrect: 3,
      });
    });

    it("detects a win and shows game alert", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.showGameAlert).toBe(true);
    });

    it("logs gameplay statistics on win", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(statsService.logGameplay.calledOnce).toBe(true);
    });

    it("does not show game alert on incorrect guess", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.addNumber(8);
      state.submitClicked();
      expect(state.showGameAlert).toBe(false);
    });

    it("does not call statsService on incorrect guess", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.addNumber(8);
      state.submitClicked();
      expect(statsService.logGameplay.called).toBe(false);
    });

    it("accumulates multiple guesses", () => {
      state.answer = [1, 2, 3, 4];

      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.addNumber(8);
      state.submitClicked();

      state.addNumber(9);
      state.addNumber(0);
      state.addNumber(1);
      state.addNumber(2);
      state.submitClicked();

      expect(state.guesses).toHaveLength(2);
    });
  });

  describe("handleKeyboardEvent", () => {
    const makeKeyEvent = (key: string, repeat = false): globalThis.KeyboardEvent => {
      return { key, repeat } as globalThis.KeyboardEvent;
    };

    it("adds digit on number key press", () => {
      state.handleKeyboardEvent(makeKeyEvent("5"));
      expect(state.numbers).toEqual([5]);
    });

    it("adds zero on 0 key press", () => {
      state.handleKeyboardEvent(makeKeyEvent("0"));
      expect(state.numbers).toEqual([0]);
    });

    it("submits on Enter when numbers are complete", () => {
      state.answer = [1, 2, 3, 4];
      state.handleKeyboardEvent(makeKeyEvent("5"));
      state.handleKeyboardEvent(makeKeyEvent("6"));
      state.handleKeyboardEvent(makeKeyEvent("7"));
      state.handleKeyboardEvent(makeKeyEvent("8"));
      state.handleKeyboardEvent(makeKeyEvent("Enter"));
      expect(state.guesses).toHaveLength(1);
    });

    it("ignores Enter when numbers are incomplete", () => {
      state.handleKeyboardEvent(makeKeyEvent("5"));
      state.handleKeyboardEvent(makeKeyEvent("Enter"));
      expect(state.guesses).toHaveLength(0);
    });

    it("removes last number on Backspace", () => {
      state.handleKeyboardEvent(makeKeyEvent("1"));
      state.handleKeyboardEvent(makeKeyEvent("2"));
      state.handleKeyboardEvent(makeKeyEvent("Backspace"));
      expect(state.numbers).toEqual([1]);
    });

    it("ignores repeated key events", () => {
      state.handleKeyboardEvent(makeKeyEvent("5", true));
      expect(state.numbers).toEqual([]);
    });

    it("ignores non-digit non-control keys", () => {
      state.handleKeyboardEvent(makeKeyEvent("a"));
      state.handleKeyboardEvent(makeKeyEvent("Shift"));
      state.handleKeyboardEvent(makeKeyEvent(" "));
      expect(state.numbers).toEqual([]);
    });

    it("ignores duplicate digit key press (idempotent)", () => {
      state.handleKeyboardEvent(makeKeyEvent("3"));
      state.handleKeyboardEvent(makeKeyEvent("3"));
      expect(state.numbers).toEqual([3]);
    });
  });

  describe("shouldDisableNumber", () => {
    it("returns false for unused number when input is not full", () => {
      expect(state.shouldDisableNumber(5)).toBe(false);
    });

    it("returns true for already-entered number", () => {
      state.addNumber(3);
      expect(state.shouldDisableNumber(3)).toBe(true);
    });

    it("returns false for non-entered number", () => {
      state.addNumber(3);
      expect(state.shouldDisableNumber(5)).toBe(false);
    });

    it("returns true for all numbers when input is full", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      for (let i = 0; i <= 9; i++) {
        expect(state.shouldDisableNumber(i)).toBe(true);
      }
    });
  });

  describe("submitButtonDisabled", () => {
    it("is disabled when numbers are empty", () => {
      expect(state.submitButtonDisabled).toBe(true);
    });

    it("is disabled when numbers are partially filled", () => {
      state.addNumber(1);
      state.addNumber(2);
      expect(state.submitButtonDisabled).toBe(true);
    });

    it("is enabled when numbers are complete", () => {
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      expect(state.submitButtonDisabled).toBe(false);
    });
  });

  describe("backspaceButtonDisabled", () => {
    it("is disabled when no numbers entered", () => {
      expect(state.backspaceButtonDisabled).toBe(true);
    });

    it("is enabled when at least one number entered", () => {
      state.addNumber(1);
      expect(state.backspaceButtonDisabled).toBe(false);
    });
  });

  describe("hintButtonDisabled", () => {
    it("is disabled when fewer than 5 guesses made", () => {
      expect(state.hintButtonDisabled).toBe(true);
    });

    it("is enabled after 5 guesses with hints remaining", () => {
      state.answer = [1, 2, 3, 4];
      for (let i = 0; i < 5; i++) {
        state.addNumber(5);
        state.addNumber(6);
        state.addNumber(7);
        state.addNumber(8);
        state.submitClicked();
      }
      expect(state.hintButtonDisabled).toBe(false);
    });

    it("is disabled after hint has been used", () => {
      state.answer = [1, 2, 3, 4];
      for (let i = 0; i < 5; i++) {
        state.addNumber(5);
        state.addNumber(6);
        state.addNumber(7);
        state.addNumber(8);
        state.submitClicked();
      }
      state.hintsLeft = false;
      expect(state.hintButtonDisabled).toBe(true);
    });
  });

  describe("hintMessage", () => {
    it("returns a message about a digit not in the answer", () => {
      state.answer = [1, 2, 3, 4];
      const message = state.hintMessage;
      expect(message).toMatch(/The answer does not contain \d\./);
      const digit = parseInt(message.match(/\d/)![0]);
      expect([1, 2, 3, 4]).not.toContain(digit);
    });
  });

  describe("full game flow", () => {
    it("can complete a game from start to win", () => {
      state.answer = [5, 8, 2, 9];

      // First guess: wrong
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.guesses).toHaveLength(1);
      expect(state.showGameAlert).toBe(false);

      // Second guess: win
      state.addNumber(5);
      state.addNumber(8);
      state.addNumber(2);
      state.addNumber(9);
      state.submitClicked();
      expect(state.guesses).toHaveLength(2);
      expect(state.showGameAlert).toBe(true);
    });

    it("tracks guess feedback correctly across multiple guesses", () => {
      state.answer = [1, 2, 3, 4];

      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.addNumber(8);
      state.submitClicked();
      expect(state.guesses[0].incorrect).toBe(4);

      state.addNumber(4);
      state.addNumber(3);
      state.addNumber(2);
      state.addNumber(1);
      state.submitClicked();
      expect(state.guesses[1].incorrectSpot).toBe(4);

      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.guesses[2].correctSpot).toBe(4);
    });
  });

  describe("answer generation invariants", () => {
    it("never generates duplicate digits across many instances", () => {
      for (let i = 0; i < 100; i++) {
        const s = new GameState(statsService);
        const unique = new Set(s.answer);
        expect(unique.size).toBe(4);
      }
    });

    it("generates different answers across instances (not deterministic)", () => {
      const answers = new Set<string>();
      for (let i = 0; i < 50; i++) {
        const s = new GameState(statsService);
        answers.add(s.answer.join(""));
      }
      expect(answers.size).toBeGreaterThan(1);
    });

    it("only contains digits 0-9", () => {
      for (let i = 0; i < 50; i++) {
        const s = new GameState(statsService);
        s.answer.forEach((d) => {
          expect(d).toBeGreaterThanOrEqual(0);
          expect(d).toBeLessThanOrEqual(9);
        });
      }
    });
  });

  describe("addNumber boundary conditions", () => {
    it("handles all 10 possible digits individually", () => {
      for (let i = 0; i <= 9; i++) {
        const s = new GameState(statsService);
        s.addNumber(i);
        expect(s.numbers).toEqual([i]);
      }
    });

    it("stops exactly at NUMBER_LENGTH even with rapid calls", () => {
      state.addNumber(0);
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.addNumber(5);
      state.addNumber(6);
      expect(state.numbers).toHaveLength(4);
      expect(state.numbers).toEqual([0, 1, 2, 3]);
    });
  });

  describe("submitClicked edge cases", () => {
    it("does nothing when called repeatedly with empty input", () => {
      state.submitClicked();
      state.submitClicked();
      state.submitClicked();
      expect(state.guesses).toHaveLength(0);
    });

    it("can submit immediately after clearing and re-entering", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(5);
      state.addNumber(6);
      state.clearNumbers();
      state.addNumber(7);
      state.addNumber(8);
      state.addNumber(9);
      state.addNumber(0);
      state.submitClicked();
      expect(state.guesses).toHaveLength(1);
      expect(state.guesses[0].numbers).toEqual([7, 8, 9, 0]);
    });

    it("handles win on first guess", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.showGameAlert).toBe(true);
      expect(state.guesses).toHaveLength(1);
      expect(state.startTime).toBeInstanceOf(Date);
    });

    it("records correct guess count in statistics on win", () => {
      state.answer = [1, 2, 3, 4];
      // Make 3 wrong guesses first
      for (let i = 0; i < 3; i++) {
        state.addNumber(5);
        state.addNumber(6);
        state.addNumber(7);
        state.addNumber(8);
        state.submitClicked();
      }
      // Win on 4th guess
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();

      const logCall = statsService.logGameplay.getCall(0);
      expect(logCall.args[0].guesses).toBe(4);
    });
  });

  describe("handleKeyboardEvent edge cases", () => {
    const makeKeyEvent = (key: string, repeat = false): globalThis.KeyboardEvent => {
      return { key, repeat } as globalThis.KeyboardEvent;
    };

    it("handles full keyboard game flow: enter digits, submit, enter more", () => {
      state.answer = [1, 2, 3, 4];
      state.handleKeyboardEvent(makeKeyEvent("5"));
      state.handleKeyboardEvent(makeKeyEvent("6"));
      state.handleKeyboardEvent(makeKeyEvent("7"));
      state.handleKeyboardEvent(makeKeyEvent("8"));
      state.handleKeyboardEvent(makeKeyEvent("Enter"));
      expect(state.guesses).toHaveLength(1);
      expect(state.numbers).toEqual([]);

      // Can enter new digits after submit
      state.handleKeyboardEvent(makeKeyEvent("1"));
      state.handleKeyboardEvent(makeKeyEvent("2"));
      expect(state.numbers).toEqual([1, 2]);
    });

    it("backspace works multiple times", () => {
      state.handleKeyboardEvent(makeKeyEvent("1"));
      state.handleKeyboardEvent(makeKeyEvent("2"));
      state.handleKeyboardEvent(makeKeyEvent("3"));
      state.handleKeyboardEvent(makeKeyEvent("Backspace"));
      state.handleKeyboardEvent(makeKeyEvent("Backspace"));
      expect(state.numbers).toEqual([1]);
    });

    it("backspace on empty does not crash", () => {
      state.handleKeyboardEvent(makeKeyEvent("Backspace"));
      state.handleKeyboardEvent(makeKeyEvent("Backspace"));
      expect(state.numbers).toEqual([]);
    });

    it("ignores keys when input is full (except Enter/Backspace)", () => {
      state.handleKeyboardEvent(makeKeyEvent("1"));
      state.handleKeyboardEvent(makeKeyEvent("2"));
      state.handleKeyboardEvent(makeKeyEvent("3"));
      state.handleKeyboardEvent(makeKeyEvent("4"));
      // 5 should be ignored since input is full
      state.handleKeyboardEvent(makeKeyEvent("5"));
      expect(state.numbers).toEqual([1, 2, 3, 4]);
    });

    it("can backspace after filling and re-enter a different digit", () => {
      state.handleKeyboardEvent(makeKeyEvent("1"));
      state.handleKeyboardEvent(makeKeyEvent("2"));
      state.handleKeyboardEvent(makeKeyEvent("3"));
      state.handleKeyboardEvent(makeKeyEvent("4"));
      state.handleKeyboardEvent(makeKeyEvent("Backspace"));
      state.handleKeyboardEvent(makeKeyEvent("5"));
      expect(state.numbers).toEqual([1, 2, 3, 5]);
    });

    it("ignores function keys and special characters", () => {
      state.handleKeyboardEvent(makeKeyEvent("F1"));
      state.handleKeyboardEvent(makeKeyEvent("Tab"));
      state.handleKeyboardEvent(makeKeyEvent("Escape"));
      state.handleKeyboardEvent(makeKeyEvent("ArrowUp"));
      state.handleKeyboardEvent(makeKeyEvent("Meta"));
      state.handleKeyboardEvent(makeKeyEvent("Control"));
      state.handleKeyboardEvent(makeKeyEvent("Alt"));
      state.handleKeyboardEvent(makeKeyEvent("!"));
      state.handleKeyboardEvent(makeKeyEvent("@"));
      expect(state.numbers).toEqual([]);
    });

    it("can complete full game via keyboard only", () => {
      state.answer = [7, 3, 9, 0];
      state.handleKeyboardEvent(makeKeyEvent("7"));
      state.handleKeyboardEvent(makeKeyEvent("3"));
      state.handleKeyboardEvent(makeKeyEvent("9"));
      state.handleKeyboardEvent(makeKeyEvent("0"));
      state.handleKeyboardEvent(makeKeyEvent("Enter"));
      expect(state.showGameAlert).toBe(true);
    });
  });

  describe("hintMessage invariants", () => {
    it("always returns a digit NOT in the answer", () => {
      for (let trial = 0; trial < 100; trial++) {
        const s = new GameState(statsService);
        const msg = s.hintMessage;
        const digit = parseInt(msg.match(/\d/)![0]);
        expect(s.answer).not.toContain(digit);
      }
    });

    it("returns a digit between 0 and 9", () => {
      const msg = state.hintMessage;
      const digit = parseInt(msg.match(/\d/)![0]);
      expect(digit).toBeGreaterThanOrEqual(0);
      expect(digit).toBeLessThanOrEqual(9);
    });

    it("message format is consistent", () => {
      const msg = state.hintMessage;
      expect(msg).toMatch(/^The answer does not contain \d\.$/);
    });
  });

  describe("state transitions after win", () => {
    it("numbers are cleared after winning submit", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      expect(state.numbers).toEqual([]);
    });

    it("can still add numbers after winning (no crash)", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(1);
      state.addNumber(2);
      state.addNumber(3);
      state.addNumber(4);
      state.submitClicked();
      // Game is won but state allows continued interaction
      state.addNumber(5);
      expect(state.numbers).toEqual([5]);
    });
  });

  describe("shouldDisableNumber after state changes", () => {
    it("re-enables number after clearing", () => {
      state.addNumber(3);
      expect(state.shouldDisableNumber(3)).toBe(true);
      state.clearNumbers();
      expect(state.shouldDisableNumber(3)).toBe(false);
    });

    it("re-enables last number after backspace", () => {
      state.addNumber(1);
      state.addNumber(2);
      expect(state.shouldDisableNumber(2)).toBe(true);
      state.removeLastNumber();
      expect(state.shouldDisableNumber(2)).toBe(false);
      expect(state.shouldDisableNumber(1)).toBe(true);
    });

    it("all numbers re-enable after submit", () => {
      state.answer = [1, 2, 3, 4];
      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.addNumber(8);
      state.submitClicked();
      for (let i = 0; i <= 9; i++) {
        expect(state.shouldDisableNumber(i)).toBe(false);
      }
    });
  });
});
