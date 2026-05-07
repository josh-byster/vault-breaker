import {
  GameStatisticsService,
  GameStatisticsDAO,
  DEFAULT_STATISTICS,
  GameStatistics,
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
});
