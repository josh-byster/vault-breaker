import { IonButton, IonIcon } from "@ionic/react";
import React from "react";
import { NUMBER_LENGTH } from "./constants";
import "./NumberPad.css";
import { backspaceOutline, lockOpen } from "ionicons/icons";
interface ContainerProps {
  numberAdded: (number: number) => void;
  backspaceClicked: () => void;
  submitClicked: () => void;
  numbers: number[];
}

const NumberPad: React.FC<ContainerProps> = ({
  numberAdded,
  backspaceClicked,
  submitClicked,
  numbers,
}) => {
  const shouldDisableNumber = (number: number) =>
    numbers.indexOf(number) !== -1 || numbers.length === NUMBER_LENGTH;

  const makeButton = (number: number) => (
    <IonButton
      className="number"
      color="primary"
      onClick={() => numberAdded(number)}
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
        onClick={backspaceClicked}
        disabled={numbers.length === 0}
        color="secondary"
      >
        <IonIcon icon={backspaceOutline}></IonIcon>
      </IonButton>
      {makeButton(0)}
      <IonButton
        className="submit"
        onClick={submitClicked}
        disabled={numbers.length < NUMBER_LENGTH}
        color="tertiary"
      >
        <IonIcon icon={lockOpen}></IonIcon>
      </IonButton>
    </>
  );
};

export default NumberPad;
