import { Preferences } from "@capacitor/preferences";
import logger from "debug";

const log = logger("persistence");
const GAME_INFO_KEY = "gameInfo";

export interface GameStatistics {
  time: number;
  guesses: number;
  gamesPlayed: number;
  fastestWin: number;
  dayStarted: Date;
  lowestGuessCount: number;
  highestGuessCount: number;
}

export const DEFAULT_STATISTICS: GameStatistics = {
  time: 0,
  guesses: 0,
  gamesPlayed: 0,
  fastestWin: 0,
  dayStarted: new Date(),
  lowestGuessCount: 0,
  highestGuessCount: 0,
};

interface GameStatisticsDTO {
  time: number;
  guesses: number;
}
export class GameStatisticsService {
  private statisticsDAO: GameStatisticsDAO;

  constructor(dao = new GameStatisticsDAO()) {
    log("Instantiating GameStatisticsService");
    this.statisticsDAO = dao;
  }

  public async logGameplay({
    time,
    guesses,
  }: GameStatisticsDTO): Promise<GameStatistics> {
    const prevValues = await this.getStatistics();

    const newStats: GameStatistics = {
      time: prevValues.time + time,
      guesses: prevValues.guesses + guesses,
      gamesPlayed: prevValues.gamesPlayed + 1,
      fastestWin: this.computeFastestWin(prevValues.fastestWin, time, guesses),
      dayStarted: prevValues.dayStarted,
      lowestGuessCount: this.computeMinGuessCount(
        prevValues.lowestGuessCount,
        guesses
      ),
      highestGuessCount: Math.max(prevValues.highestGuessCount, guesses),
    };

    await this.statisticsDAO.set(newStats);
    return newStats;
  }

  public async getStatistics(): Promise<GameStatistics> {
    const values = await this.statisticsDAO.get();
    if (values !== null) {
      return values;
    }
    return this.resetStatistics();
  }

  public async resetStatistics(): Promise<GameStatistics> {
    log("Resetting statistics to defaults");
    await this.statisticsDAO.set(DEFAULT_STATISTICS);
    return DEFAULT_STATISTICS;
  }

  private computeFastestWin(
    prevTime: number,
    currTime: number,
    guesses: number
  ) {
    if (prevTime === 0) {
      return currTime;
    }
    if (guesses > 1) {
      return Math.min(prevTime, currTime);
    }
    return prevTime;
  }

  private computeMinGuessCount(prevCount: number, curCount: number) {
    if (prevCount === 0) {
      return curCount;
    }

    return Math.min(prevCount, curCount);
  }
}

export class GameStatisticsDAO {
  public async get(): Promise<GameStatistics | null> {
    const { value } = await Preferences.get({ key: GAME_INFO_KEY });

    if (value === null) {
      log("No statistics exist in storage.");
      return null;
    }

    log("Loaded current statistics: %o", JSON.parse(value));
    return JSON.parse(value, (key, value) =>
      key === "dayStarted" ? new Date(value) : value
    );
  }

  public async set(stats: GameStatistics) {
    log("Setting new statistics: ", stats);
    await Preferences.set({
      key: GAME_INFO_KEY,
      value: JSON.stringify(stats),
    });
  }
}
