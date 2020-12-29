import { IonAlert, IonButton } from "@ionic/react";
import React, { useState, useMemo } from "react";
import { GameState } from "../store/GameState";
import "./HintController.css";
interface Props {
  state: GameState;
}

const getDigit = (): number => {
  return Math.floor(Math.random() * 10);
};

const HintController: React.FC<Props> = ({ state }) => {
  const [open, setOpen] = useState(false);

  const hintMessage = useMemo((): string => {
    let randomDigit = getDigit();
    while (state.answer.indexOf(randomDigit) !== -1) {
      randomDigit = getDigit();
    }
    return `The answer does not contain ${randomDigit}.`;
  }, [state.answer]);

  return (
    <>
      <IonAlert
        isOpen={open}
        onDidDismiss={() => setOpen(false)}
        header={"Hint"}
        message={hintMessage}
        buttons={["OK"]}
      />
      <IonButton
        className="hint"
        onClick={() => {
          setOpen(true);
          state.hintsLeft = false;
        }}
        disabled={!state.hintsLeft || state.guesses.length < 5}
      >
        Hint
      </IonButton>
    </>
  );
};

export default HintController;
