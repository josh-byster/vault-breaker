import { IonIcon } from "@ionic/react";
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
    <button
      className="number shadow"
      color="primary"
      onClick={() => state.addNumber(number)}
      disabled={state.shouldDisableNumber(number)}
    >
      {number}
    </button>
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
      <button
        className="submit shadow"
        onClick={state.submitClicked.bind(state)}
        disabled={state.submitButtonDisabled}
      >
        <IonIcon icon={lockOpen} style={{ height: "30px" }}></IonIcon>
      </button>
    </>
  );
};

export default observer(NumberPad);
