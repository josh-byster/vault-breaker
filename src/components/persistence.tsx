import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const GAME_INFO_KEY = "gameInfo";

const DEFAULT_INFO = {
  key: GAME_INFO_KEY,
  value: JSON.stringify({
    time: 0,
    guesses: 0,
    gamesPlayed: 0,
  }),
};

// JSON "set" example
const logGameplay = async ({
  time,
  guesses,
}: {
  time: Number;
  guesses: Number;
}) => {
  const prevValues = await getGameInfo();
  await Storage.set({
    key: GAME_INFO_KEY,
    value: JSON.stringify({
      time: prevValues.time + time,
      guesses: prevValues.guesses + guesses,
      gamesPlayed: prevValues.gamesPlayed + 1,
    }),
  });
  console.log(await getGameInfo());
};

// JSON "get" example
const getGameInfo = async () => {
  const { value } = await Storage.get({ key: GAME_INFO_KEY });
  if (value !== null) return JSON.parse(value);

  await Storage.set(DEFAULT_INFO);
  return DEFAULT_INFO;
};

export { logGameplay };
