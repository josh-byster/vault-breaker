import {
  GameStatisticsService,
  GameStatisticsDAO,
  DEFAULT_STATISTICS,
} from "../components/persistence";
import {
  assert,
  createStubInstance,
  match,
  SinonStub,
  SinonStubbedInstance,
  stub,
} from "sinon";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

describe("Game statistics service", () => {
  let theService: GameStatisticsService;
  let theDAO: SinonStubbedInstance<GameStatisticsDAO>;
  beforeEach(() => {
    theDAO = createStubInstance(GameStatisticsDAO);
    theService = new GameStatisticsService(theDAO);
  });

  test("Calls get on DAO upon getting statistics", () => {
    theService.getStatistics();

    assert.calledOnce(theDAO.get);
  });

  test("Calls set on DAO upon setting statistics", async () => {
    theDAO.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    await theService.logGameplay({ time: 0, guesses: 0 });

    assert.calledOnce(theDAO.get);
    assert.calledOnce(theDAO.set);
  });

  test("Returns default statistics when DAO returns empty state", async () => {
    theDAO.get.returns(Promise.resolve(null));

    const returnValue = await theService.getStatistics();

    expect(returnValue).toEqual(DEFAULT_STATISTICS);
  });

  test("Correctly computes basic result on next iteration", async () => {
    theDAO.get.returns(Promise.resolve(DEFAULT_STATISTICS));

    const returnValue = await theService.logGameplay({ time: 2, guesses: 5 });

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
    theDAO.get.returns(
      Promise.resolve({ ...DEFAULT_STATISTICS, fastestWin: 5 })
    );

    const returnValue = await theService.logGameplay({
      time: 0.01,
      guesses: 1,
    });

    expect(returnValue.fastestWin).toBe(5);
  });

  test("Correctly sets min guess count", async () => {
    theDAO.get.returns(
      Promise.resolve({
        ...DEFAULT_STATISTICS,
        lowestGuessCount: 5,
      })
    );

    const returnValue = await theService.logGameplay({
      time: 2,
      guesses: 3,
    });

    expect(returnValue.lowestGuessCount).toBe(3);
  });

  test("Correctly sets max guess count", async () => {
    theDAO.get.returns(
      Promise.resolve({
        ...DEFAULT_STATISTICS,
        highestGuessCount: 7,
      })
    );

    const returnValue = await theService.logGameplay({
      time: 2,
      guesses: 8,
    });

    expect(returnValue.highestGuessCount).toBe(8);
  });
});

describe("Statistics DAO", () => {
  let theDAO: GameStatisticsDAO;
  let theGetStub: SinonStub;
  let theSetStub: SinonStub;
  beforeEach(() => {
    theGetStub = stub(Storage, "get");
    theSetStub = stub(Storage, "set");
    theDAO = new GameStatisticsDAO();
  });

  afterEach(() => {
    theGetStub.restore();
    theSetStub.restore();
  });

  test("Correctly sets with default statistics", async () => {
    await theDAO.set(DEFAULT_STATISTICS);

    assert.calledOnceWithMatch(
      theSetStub,
      match({ key: match.any, value: JSON.stringify(DEFAULT_STATISTICS) })
    );
  });

  test("Returns null if no values are set", async () => {
    theGetStub.returns({ value: null });

    const returnValue = await theDAO.get();

    expect(returnValue).toEqual(null);
  });

  test("Returns a parsed version of the results", async () => {
    theGetStub.returns({ value: JSON.stringify(DEFAULT_STATISTICS) });

    const returnValue = await theDAO.get();

    expect(returnValue).toEqual(DEFAULT_STATISTICS);
  });
});
