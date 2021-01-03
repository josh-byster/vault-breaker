import { observer } from "mobx-react-lite";
import React from "react";
import { IonAlert } from "@ionic/react";
import { GameState } from "../store/GameState";
import { getSecondsElapsed } from "../utilities/utilities";

interface Props {
  state: GameState;
  resetGame: () => void;
}

const WinAlert = ({ state, resetGame }: Props) => {
  return (
    <IonAlert
      isOpen={state.showGameAlert}
      onDidDismiss={resetGame}
      cssClass="my-custom-class"
      header="You Won!"
      message={`You completed the game in ${getSecondsElapsed(
        state.startTime!
      )} seconds and took ${state.guesses.length} attempts.`}
      buttons={["OK"]}
    />
  );
};

export default observer(WinAlert);
