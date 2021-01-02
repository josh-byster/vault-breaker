import { Plugins } from "@capacitor/core";
import logger from "debug";
const { Storage } = Plugins;

const log = logger("persistence");
const GAME_INFO_KEY = "gameInfo";

type GameInfo = { key: string; value: string };

export interface GameStatistics {
  time: number;
  guesses: number;
  gamesPlayed: number;
  fastestWin: number;
  dayStarted: Date;
  lowestGuessCount: number;
  highestGuessCount: number;
}

const DEFAULT_STATISTICS: GameStatistics = {
  time: 0,
  guesses: 0,
  gamesPlayed: 0,
  fastestWin: 0,
  dayStarted: new Date(),
  lowestGuessCount: 0,
  highestGuessCount: 0,
};

const DEFAULT_INFO: GameInfo = {
  key: GAME_INFO_KEY,
  value: JSON.stringify(DEFAULT_STATISTICS),
};

export const logGameplay = async ({
  time,
  guesses,
}: {
  time: number;
  guesses: number;
}) => {
  const prevValues = await getGameStatistics();

  const newStats: GameStatistics = {
    time: prevValues.time + time,
    guesses: prevValues.guesses + guesses,
    gamesPlayed: prevValues.gamesPlayed + 1,
    fastestWin: computeFastestWin(prevValues.fastestWin, time),
    dayStarted: prevValues.dayStarted,
    lowestGuessCount: computeMinGuessCount(
      prevValues.lowestGuessCount,
      guesses
    ),
    highestGuessCount: Math.max(prevValues.highestGuessCount, guesses),
  };

  setGameStatistics(newStats);
};

export const getGameStatistics: () => Promise<GameStatistics> = async () => {
  const { value } = await Storage.get({ key: GAME_INFO_KEY });
  log("Loaded current statistics: %o", value !== null && JSON.parse(value));

  if (value !== null) return JSON.parse(value);

  resetGameInfo();
  return JSON.parse(DEFAULT_INFO.value);
};

export const resetGameInfo: () => Promise<any> = async () => {
  log("Resetting storage to default: %o", DEFAULT_INFO);
  return Storage.set(DEFAULT_INFO);
};

const setGameStatistics = async (stats: GameStatistics) => {
  log("Setting new statistics: ", stats);
  await Storage.set({
    key: GAME_INFO_KEY,
    value: JSON.stringify(stats),
  });
};

const computeFastestWin = (prevFastestTime: number, currGameTime: number) => {
  if (prevFastestTime === 0) {
    return currGameTime;
  }
  if (currGameTime > 0.1) {
    return Math.min(prevFastestTime, currGameTime);
  }
  return prevFastestTime;
};

const computeMinGuessCount = (
  oldLowestGuessCount: number,
  curGuessCount: number
) => {
  if (oldLowestGuessCount === 0) {
    return curGuessCount;
  }
  return Math.min(oldLowestGuessCount, curGuessCount);
};
