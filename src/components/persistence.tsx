import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

interface GameInfo {
  key: string;
  value: string;
}

export interface GameStatistics {
  time: number;
  guesses: number;
  gamesPlayed: number;
}

const GAME_INFO_KEY = "gameInfo";

const DEFAULT_INFO: GameInfo = {
  key: GAME_INFO_KEY,
  value: JSON.stringify({
    time: 0,
    guesses: 0,
    gamesPlayed: 0,
  }),
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
  await Storage.set({
    key: GAME_INFO_KEY,
    value: JSON.stringify({
      time: prevValues.time + time,
      guesses: prevValues.guesses + guesses,
      gamesPlayed: prevValues.gamesPlayed + 1,
    }),
  });
};

export const getInfoOrDefault: () => Promise<GameStatistics> = async () => {
  const { value } = await Storage.get({ key: GAME_INFO_KEY });
  console.log(value);
  if (value !== null) return JSON.parse(value);

  resetGameInfo();
  console.log("Returning");
  return JSON.parse(DEFAULT_INFO.value);
};

export const resetGameInfo: () => void = async () => {
  await Storage.set(DEFAULT_INFO);
};
