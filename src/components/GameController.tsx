import React, { useCallback, useEffect, useState } from "react";
import "./GameController.css";
import { GuessList, Guess } from "./GuessList";
import InputBar from "./InputBar";
import NumberPad from "./NumberPad";
import { NUMBER_LENGTH } from "./constants";
import {
  computeGuessForNumber,
  generateAnswer,
  getSecondsElapsed,
} from "./utilities";
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
import { logGameplay } from "./persistence";
import HintController from "./HintController";

const GameController: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [answer, setAnswer] = useState<number[]>(() =>
    generateAnswer(NUMBER_LENGTH)
  );
  const [showGameAlert, setShowGameAlert] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>();
  const [hintsLeft, setHintsLeft] = useState<boolean>(true);

  const appendNumber = useCallback(
    (value: number): void => {
      setNumbers((nums) => {
        if (nums.length < NUMBER_LENGTH) {
          return [...nums, value];
        }
        return nums;
      });
    },
    [setNumbers]
  );

  const deleteNumber = () => setNumbers((nums) => nums.slice(0, -1));

  const handleWin = (startTime: Date, guesses: number) => {
    logGameplay({ time: getSecondsElapsed(startTime), guesses: guesses + 1 });
    setShowGameAlert(true);
  };

  const submitClicked = useCallback(() => {
    if (numbers.length !== NUMBER_LENGTH) return;
    const curTime = new Date();
    if (!startTime) {
      setStartTime(curTime);
    }
    if (numbers.join("") === answer.join("")) {
      handleWin(startTime || curTime, guesses.length);
    }
    setGuesses((guesses) => {
      return [...guesses, computeGuessForNumber(numbers, answer)];
    });
    clearNumbers();
  }, [numbers, answer, startTime, guesses]);

  useEffect(() => {
    const cb = (ev: globalThis.KeyboardEvent) => {
      if (ev.repeat) return;
      if (numbers.indexOf(parseInt(ev.key)) !== -1) return;
      if (/\d$/.test(ev.key)) appendNumber(parseInt(ev.key));
      if (ev.key === "Enter") submitClicked();
      if (ev.key === "Backspace") deleteNumber();
    };
    document.addEventListener("keydown", cb);
    return () => {
      document.removeEventListener("keydown", cb);
    };
  }, [submitClicked, appendNumber, numbers]);

  const clearNumbers = () => setNumbers([]);

  const resetGame = () => {
    clearNumbers();
    setGuesses([]);
    setAnswer(generateAnswer(NUMBER_LENGTH));
    setStartTime(undefined);
    setHintsLeft(true);
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
          isOpen={showGameAlert}
          onDidDismiss={() => {
            setShowGameAlert(false);
            resetGame();
          }}
          cssClass="my-custom-class"
          header={"You Won!"}
          message={`You completed the game in ${getSecondsElapsed(
            startTime!
          )} seconds and took ${guesses.length + 1} attempts.`}
          buttons={["OK"]}
        />
        <div style={{ height: "100%", paddingTop: "30px" }}>
          <div className="game-col" id="guess-list-col">
            <GuessList items={guesses}></GuessList>
          </div>
          <div className="game-col" id="input-col">
            <InputBar values={numbers} total={NUMBER_LENGTH}></InputBar>
            <NumberPad
              numbers={numbers}
              numberAdded={appendNumber}
              backspaceClicked={deleteNumber}
              submitClicked={submitClicked}
            ></NumberPad>
            <HintController
              answer={answer}
              enabled={hintsLeft && guesses.length >= 5}
              hintUsed={() => setHintsLeft(false)}
            ></HintController>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GameController;
