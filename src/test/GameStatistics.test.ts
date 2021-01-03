import {
  GameStatisticsService,
  GameStatisticsDAO,
  DEFAULT_STATISTICS,
  GameStatistics,
} from "../services/persistence";
import { assert, createStubInstance, SinonStubbedInstance } from "sinon";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

describe("Game statistics service", () => {
  let service: GameStatisticsService;
  let dao: SinonStubbedInstance<GameStatisticsDAO>;
  beforeEach(() => {
    dao = createStubInstance(GameStatisticsDAO);
    service = new GameStatisticsService(dao);
  });

  test("Calls get on DAO upon getting statistics", () => {
    service.getStatistics();

    assert.calledOnce(dao.get);
  });

  test("Calls set on DAO upon setting statistics", async () => {
    dao.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    await service.logGameplay({ time: 0, guesses: 0 });

    assert.calledOnce(dao.get);
    assert.calledOnce(dao.set);
  });

  test("Returns default statistics when DAO returns empty state", async () => {
    dao.get.returns(Promise.resolve(null));

    const returnValue = await service.getStatistics();

    expect(returnValue).toEqual(DEFAULT_STATISTICS);
  });

  test("Correctly computes basic result on next iteration", async () => {
    dao.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    const returnValue = await service.logGameplay({ time: 2, guesses: 5 });

    expect(returnValue).toMatchObject({
      time: 2,
      guesses: 5,
      gamesPlayed: 1,
      fastestWin: 2,
      highestGuessCount: 5,
      lowestGuessCount: 5,
      dayStarted: expect.any(Date),
    });
  });

  test("Does not update fastest win if win on first guess", async () => {
    dao.get.returns(Promise.resolve({ ...DEFAULT_STATISTICS, fastestWin: 5 }));

    const returnValue = await service.logGameplay({
      time: 0.01,
      guesses: 1,
    });

    expect(returnValue.fastestWin).toBe(5);
  });

  test("Correctly sets min guess count", async () => {
    dao.get.returns(
      Promise.resolve({
        ...DEFAULT_STATISTICS,
        lowestGuessCount: 5,
      })
    );

    const returnValue = await service.logGameplay({
      time: 2,
      guesses: 3,
    });

    expect(returnValue.lowestGuessCount).toBe(3);
  });

  test("Correctly sets max guess count", async () => {
    dao.get.returns(
      Promise.resolve({
        ...DEFAULT_STATISTICS,
        highestGuessCount: 7,
      })
    );

    const returnValue = await service.logGameplay({
      time: 2,
      guesses: 8,
    });

    expect(returnValue.highestGuessCount).toBe(8);
  });
});

describe("Statistics DAO", () => {
  let dao: GameStatisticsDAO;
  beforeEach(() => {
    dao = new GameStatisticsDAO();
  });

  afterEach(() => {
    Storage.clear();
  });

  test("Correctly sets with default statistics", async () => {
    await dao.set(DEFAULT_STATISTICS);

    const result = await dao.get();

    expect(result).toEqual(DEFAULT_STATISTICS);
  });

  test("Returns null if no values are set", async () => {
    const returnValue = await dao.get();

    expect(returnValue).toEqual(null);
  });

  test("Correctly sets and gets a non-default statistic", async () => {
    const customObject: GameStatistics = { ...DEFAULT_STATISTICS, time: 1 };

    await dao.set(customObject);
    const returnValue = await dao.get();

    expect(returnValue).toEqual(customObject);
  });

  test("Is idempotent for getting values", async () => {
    await dao.set(DEFAULT_STATISTICS);

    expect(await dao.get()).toEqual(await dao.get());
  });
});
