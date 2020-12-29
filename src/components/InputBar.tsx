import { observer } from "mobx-react-lite";
import React from "react";
import { GameState } from "../store/GameState";
import "./InputBar.css";

interface ContainerProps {
  state: GameState;
  total: number;
}

const InputBar: React.FC<ContainerProps> = ({ state, total }) => {
  return (
    <div onClick={state.clearNumbers.bind(state)}>
      {[...Array(total)].map((value, idx) => {
        if (idx < state.numbers.length) {
          return (
            <span key={idx} className="number-value">
              {state.numbers[idx]}
            </span>
          );
        }
        return (
          <span key={idx} className="number-value">
            _
          </span>
        );
      })}
    </div>
  );
};

export default observer(InputBar);
