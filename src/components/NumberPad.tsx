import { IonButton, IonIcon } from "@ionic/react";
import React from "react";
import "./NumberPad.css";
import { lockOpen } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { GameState } from "../store/GameState";
interface ContainerProps {
  state: GameState;
}

const NumberPad: React.FC<ContainerProps> = ({ state }) => {
  const makeButton = (number: number) => (
    <IonButton
      className="number"
      color="primary"
      onClick={() => state.addNumber(number)}
      disabled={state.shouldDisableNumber(number)}
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
      {makeButton(0)}
      <IonButton
        className="submit"
        onClick={state.submitClicked.bind(state)}
        disabled={state.submitButtonDisabled}
        color="tertiary"
      >
        <IonIcon icon={lockOpen}></IonIcon>
      </IonButton>
    </>
  );
};

export default observer(NumberPad);
