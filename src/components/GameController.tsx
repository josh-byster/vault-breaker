import React, { useCallback, useEffect, useState } from "react";
import "./GameController.css";
import { GuessList, Guess } from "./GuessList";
import InputBar from "./InputBar";
import NumberPad from "./NumberPad";
import { NUMBER_LENGTH } from "./constants";
import { computeGuessForNumber, generateAnswer } from "./utilities";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const GameController: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [answer, setAnswer] = useState<number[]>(() =>
    generateAnswer(NUMBER_LENGTH)
  );

  const appendNumber = useCallback(
    (value: number): void => {
      setNumbers((nums) => {
        console.log("HERE!");
        console.log(nums);
        if (nums.length < NUMBER_LENGTH) {
          return [...nums, value];
        }
        return nums;
      });
    },
    [setNumbers]
  );

  const deleteNumber = () => setNumbers((nums) => nums.slice(0, -1));

  const submitClicked = useCallback(() => {
    if (numbers.length !== NUMBER_LENGTH) return;
    setGuesses((guesses) => {
      return [...guesses, computeGuessForNumber(numbers, answer)];
    });
    clearNumbers();
  }, [numbers, answer]);

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
        <div style={{ height: "100%", paddingTop: "30px" }}>
          <div
            style={{
              width: "50%",
              height: "100%",
              paddingRight: "20px",
              display: "inline-block",
              verticalAlign: "top",
              overflowY: "scroll",
            }}
          >
            <GuessList items={guesses}></GuessList>
          </div>
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "inline-block",
              verticalAlign: "top",
              textAlign: "center",
            }}
          >
            <InputBar values={numbers} total={NUMBER_LENGTH}></InputBar>
            <NumberPad
              numbers={numbers}
              numberAdded={appendNumber}
              backspaceClicked={deleteNumber}
              submitClicked={submitClicked}
            ></NumberPad>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GameController;
