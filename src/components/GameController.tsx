import React, { useEffect, useState } from "react";
import "./GameController.css";
import { GuessList } from "./GuessList";
import InputBar from "./InputBar";
import NumberPad from "./NumberPad";
import { NUMBER_LENGTH } from "./constants";
import { getSecondsElapsed } from "./utilities";
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import HintController from "./HintController";
import { observer } from "mobx-react-lite";
import { GameState } from "../store/GameState";
import { action } from "mobx";

const GameController: React.FC = observer(() => {
  const [state, setGameState] = useState(() => new GameState());

  useEffect(() => {
    document.addEventListener("keydown", state.handleKeyboardEvent.bind(state));
    return () => {
      document.removeEventListener("keydown", state.handleKeyboardEvent);
    };
  }, [state]);

  const resetGame = () => {
    setGameState(new GameState());
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={resetGame}>New Game</IonButton>
          </IonButtons>
          <IonTitle>Vault Breaker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen forceOverscroll={false}>
        <IonAlert
          isOpen={state.showGameAlert}
          onDidDismiss={() => {
            action(() => (state.showGameAlert = false));
            resetGame();
          }}
          cssClass="my-custom-class"
          header={"You Won!"}
          message={`You completed the game in ${getSecondsElapsed(
            state.startTime!
          )} seconds and took ${state.guesses.length} attempts.`}
          buttons={["OK"]}
        />
        <div style={{ height: "100%", paddingTop: "30px" }}>
          <div className="game-col" id="guess-list-col">
            <GuessList items={state.guesses}></GuessList>
          </div>
          <div className="game-col" id="input-col">
            <InputBar values={state.numbers} total={NUMBER_LENGTH}></InputBar>
            <NumberPad state={state}></NumberPad>
            <HintController state={state}></HintController>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
});

export default GameController;
