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
    <div className="grid">
      {[1,2,3,4,5,6,7,8,9,0].map(x => makeButton(x))}
      <button
        className="submit shadow"
        onClick={state.submitClicked.bind(state)}
        disabled={state.submitButtonDisabled}
      >
        <IonIcon icon={lockOpen} style={{ height: "30px" }}></IonIcon>
      </button>
    </div>
  );
};

export default observer(NumberPad);
