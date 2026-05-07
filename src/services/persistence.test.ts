import {
  GameStatisticsService,
  GameStatisticsDAO,
  DEFAULT_STATISTICS,
  GameStatistics,
  STREAK_THRESHOLD,
} from "./persistence";
import { createStubInstance, SinonStubbedInstance } from "sinon";

describe("GameStatisticsService - edge cases", () => {
  let service: GameStatisticsService;
  let dao: SinonStubbedInstance<GameStatisticsDAO>;

  beforeEach(() => {
    dao = createStubInstance(GameStatisticsDAO);
    service = new GameStatisticsService(dao);
  });

  it("accumulates total time across multiple games", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, gamesPlayed: 2, time: 30 })
    );

    const result = await service.logGameplay({ time: 15, guesses: 4 });
    expect(result.time).toBe(45);
  });

  it("accumulates total guesses across multiple games", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, gamesPlayed: 3, guesses: 20 })
    );

    const result = await service.logGameplay({ time: 10, guesses: 5 });
    expect(result.guesses).toBe(25);
  });

  it("increments gamesPlayed", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, gamesPlayed: 7 })
    );

    const result = await service.logGameplay({ time: 10, guesses: 3 });
    expect(result.gamesPlayed).toBe(8);
  });

  it("sets fastestWin on first real game (prev was 0)", async () => {
    dao.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    const result = await service.logGameplay({ time: 12, guesses: 3 });
    expect(result.fastestWin).toBe(12);
  });

  it("updates fastestWin when new time is faster", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, fastestWin: 20 })
    );

    const result = await service.logGameplay({ time: 10, guesses: 3 });
    expect(result.fastestWin).toBe(10);
  });

  it("does not update fastestWin when new time is slower", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, fastestWin: 10 })
    );

    const result = await service.logGameplay({ time: 25, guesses: 3 });
    expect(result.fastestWin).toBe(10);
  });

  it("does not update fastestWin for single-guess wins (cheating guard)", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, fastestWin: 10 })
    );

    const result = await service.logGameplay({ time: 0.5, guesses: 1 });
    expect(result.fastestWin).toBe(10);
  });

  it("sets lowestGuessCount on first game (prev was 0)", async () => {
    dao.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    const result = await service.logGameplay({ time: 10, guesses: 4 });
    expect(result.lowestGuessCount).toBe(4);
  });

  it("updates lowestGuessCount when fewer guesses used", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, lowestGuessCount: 5 })
    );

    const result = await service.logGameplay({ time: 10, guesses: 3 });
    expect(result.lowestGuessCount).toBe(3);
  });

  it("does not update lowestGuessCount when more guesses used", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, lowestGuessCount: 3 })
    );

    const result = await service.logGameplay({ time: 10, guesses: 7 });
    expect(result.lowestGuessCount).toBe(3);
  });

  it("preserves dayStarted from previous statistics", async () => {
    const pastDate = new Date("2023-01-15");
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, dayStarted: pastDate })
    );

    const result = await service.logGameplay({ time: 10, guesses: 3 });
    expect(result.dayStarted).toEqual(pastDate);
  });

  it("resetStatistics sets defaults and persists them", async () => {
    const result = await service.resetStatistics();
    expect(result.gamesPlayed).toBe(0);
    expect(result.time).toBe(0);
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(0);
    expect(result.fastestByGuessCount).toEqual({});
    expect(dao.set.calledOnce).toBe(true);
  });

  it("getStatistics returns defaults when DAO returns null", async () => {
    dao.get.returns(Promise.resolve(null));

    const result = await service.getStatistics();
    expect(result.gamesPlayed).toBe(0);
    expect(dao.set.calledOnce).toBe(true);
  });

  it("getStatistics returns stored values when DAO has data", async () => {
    const stored: GameStatistics = {
      ...DEFAULT_STATISTICS,
      gamesPlayed: 42,
      time: 500,
    };
    dao.get.returns(Promise.resolve(stored));

    const result = await service.getStatistics();
    expect(result.gamesPlayed).toBe(42);
    expect(result.time).toBe(500);
  });

  it("getStatistics fills in missing fields from defaults (backward compat)", async () => {
    const oldStats = {
      time: 100,
      guesses: 50,
      gamesPlayed: 10,
      fastestWin: 5,
      dayStarted: new Date("2024-01-01"),
      lowestGuessCount: 4,
      highestGuessCount: 8,
    } as GameStatistics;
    dao.get.returns(Promise.resolve(oldStats));

    const result = await service.getStatistics();
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(0);
    expect(result.fastestByGuessCount).toEqual({});
    expect(result.gamesPlayed).toBe(10);
  });
});

describe("GameStatisticsService - streak tracking", () => {
  let service: GameStatisticsService;
  let dao: SinonStubbedInstance<GameStatisticsDAO>;

  beforeEach(() => {
    dao = createStubInstance(GameStatisticsDAO);
    service = new GameStatisticsService(dao);
  });

  it("increments streak when guesses are within threshold", async () => {
    dao.get.returns(Promise.resolve({ ...DEFAULT_STATISTICS, currentStreak: 3 }));

    const result = await service.logGameplay({ time: 10, guesses: STREAK_THRESHOLD });
    expect(result.currentStreak).toBe(4);
  });

  it("resets streak when guesses exceed threshold", async () => {
    dao.get.returns(Promise.resolve({ ...DEFAULT_STATISTICS, currentStreak: 10 }));

    const result = await service.logGameplay({ time: 10, guesses: STREAK_THRESHOLD + 1 });
    expect(result.currentStreak).toBe(0);
  });

  it("starts streak from 0 on first qualifying game", async () => {
    dao.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    const result = await service.logGameplay({ time: 10, guesses: 4 });
    expect(result.currentStreak).toBe(1);
  });

  it("updates bestStreak when current exceeds it", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, currentStreak: 5, bestStreak: 5 })
    );

    const result = await service.logGameplay({ time: 10, guesses: 4 });
    expect(result.currentStreak).toBe(6);
    expect(result.bestStreak).toBe(6);
  });

  it("preserves bestStreak when current streak breaks", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, currentStreak: 3, bestStreak: 10 })
    );

    const result = await service.logGameplay({ time: 10, guesses: STREAK_THRESHOLD + 1 });
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(10);
  });

  it("does not update bestStreak when current is lower", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, currentStreak: 2, bestStreak: 15 })
    );

    const result = await service.logGameplay({ time: 10, guesses: 4 });
    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(15);
  });

  it("handles streak at exact threshold boundary", async () => {
    dao.get.returns(Promise.resolve({ ...DEFAULT_STATISTICS, currentStreak: 0 }));

    const atThreshold = await service.logGameplay({ time: 10, guesses: STREAK_THRESHOLD });
    expect(atThreshold.currentStreak).toBe(1);
  });

  it("handles streak one above threshold boundary", async () => {
    dao.get.returns(Promise.resolve({ ...DEFAULT_STATISTICS, currentStreak: 5 }));

    const aboveThreshold = await service.logGameplay({ time: 10, guesses: STREAK_THRESHOLD + 1 });
    expect(aboveThreshold.currentStreak).toBe(0);
  });
});

describe("GameStatisticsService - fastest by guess count", () => {
  let service: GameStatisticsService;
  let dao: SinonStubbedInstance<GameStatisticsDAO>;

  beforeEach(() => {
    dao = createStubInstance(GameStatisticsDAO);
    service = new GameStatisticsService(dao);
  });

  it("records first time for a guess count", async () => {
    dao.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    const result = await service.logGameplay({ time: 8.5, guesses: 4 });
    expect(result.fastestByGuessCount[4]).toBe(8.5);
  });

  it("updates time when new time is faster", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, fastestByGuessCount: { 4: 10 } })
    );

    const result = await service.logGameplay({ time: 7, guesses: 4 });
    expect(result.fastestByGuessCount[4]).toBe(7);
  });

  it("does not update time when new time is slower", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, fastestByGuessCount: { 4: 5 } })
    );

    const result = await service.logGameplay({ time: 12, guesses: 4 });
    expect(result.fastestByGuessCount[4]).toBe(5);
  });

  it("tracks separate records for different guess counts", async () => {
    dao.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, fastestByGuessCount: { 4: 5 } })
    );

    const result = await service.logGameplay({ time: 12, guesses: 6 });
    expect(result.fastestByGuessCount[4]).toBe(5);
    expect(result.fastestByGuessCount[6]).toBe(12);
  });

  it("preserves all existing records when adding new one", async () => {
    dao.get.returns(
      Promise.resolve({
        ...DEFAULT_STATISTICS,
        fastestByGuessCount: { 4: 5, 5: 8, 6: 11 },
      })
    );

    const result = await service.logGameplay({ time: 15, guesses: 7 });
    expect(result.fastestByGuessCount).toEqual({ 4: 5, 5: 8, 6: 11, 7: 15 });
  });

  it("resets fastestByGuessCount on statistics reset", async () => {
    const result = await service.resetStatistics();
    expect(result.fastestByGuessCount).toEqual({});
  });
});
