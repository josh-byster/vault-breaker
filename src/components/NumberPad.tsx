import { IonButton, IonIcon } from "@ionic/react";
import React from "react";
import { NUMBER_LENGTH } from "./constants";
import "./NumberPad.css";
import { backspaceOutline, lockOpen } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { GameState } from "../store/GameState";
interface ContainerProps {
  state: GameState;
}

const NumberPad: React.FC<ContainerProps> = ({ state }) => {
  const shouldDisableNumber = (number: number) =>
    state.numbers.indexOf(number) !== -1 ||
    state.numbers.length === NUMBER_LENGTH;

  const makeButton = (number: number) => (
    <IonButton
      className="number"
      color="primary"
      onClick={() => state.addNumber(number)}
      disabled={shouldDisableNumber(number)}
    >
      {number}
    </IonButton>
  );
  return (
    <>
      {makeButton(1)}
      {makeButton(2)}
      {makeButton(3)}
      <br />
      {makeButton(4)}
      {makeButton(5)}
      {makeButton(6)}
      <br />
      {makeButton(7)}
      {makeButton(8)}
      {makeButton(9)}
      <br />

      <IonButton
        className="submit"
        onClick={state.removeLastNumber.bind(state)}
        disabled={state.numbers.length === 0}
        color="secondary"
      >
        <IonIcon icon={backspaceOutline}></IonIcon>
      </IonButton>
      {makeButton(0)}
      <IonButton
        className="submit"
        onClick={state.submitClicked.bind(state)}
        disabled={state.numbers.length < NUMBER_LENGTH}
        color="tertiary"
      >
        <IonIcon icon={lockOpen}></IonIcon>
      </IonButton>
    </>
  );
};

export default observer(NumberPad);
