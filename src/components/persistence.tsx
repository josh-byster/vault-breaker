import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

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

// JSON "set" example
export const logGameplay = async ({
  time,
  guesses,
}: {
  time: number;
  guesses: number;
}) => {
  const prevValues = await getInfoOrDefault();
  const newValues: GameStatistics = {
    time: prevValues.time + time,
    guesses: prevValues.guesses + guesses,
    gamesPlayed: prevValues.gamesPlayed + 1,
    fastestWin:
      prevValues.fastestWin !== 0
        ? time > 0.1
          ? Math.min(prevValues.fastestWin, time)
          : prevValues.fastestWin
        : time,
    dayStarted: prevValues.dayStarted,
    lowestGuessCount:
      prevValues.lowestGuessCount !== 0
        ? Math.min(prevValues.lowestGuessCount, guesses)
        : guesses,
    highestGuessCount: Math.max(prevValues.highestGuessCount, guesses),
  };
  await Storage.set({
    key: GAME_INFO_KEY,
    value: JSON.stringify(newValues),
  });
};

export const getInfoOrDefault: () => Promise<GameStatistics> = async () => {
  const { value } = await Storage.get({ key: GAME_INFO_KEY });
  console.log(value);
  if (value !== null) return JSON.parse(value);

  resetGameInfo();
  return JSON.parse(DEFAULT_INFO.value);
};

export const resetGameInfo: () => Promise<any> = async () => {
  return Storage.set(DEFAULT_INFO);
};
