import { IonList } from "@ionic/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { GameState } from "../store/GameState";
import "./GuessList.css";
import { GuessListItem } from "./GuessListItem";

interface ListProps {
  state: GameState;
}

interface Guess {
  numbers: number[];
  correctSpot: number;
  incorrectSpot: number;
  incorrect: number;
}
const GuessList: React.FC<ListProps> = observer(({ state }) => {
  return (
    <IonList>
      {state.guesses
        .slice()
        .reverse()
        .map((item, idx) => (
          <GuessListItem
            item={item}
            idx={state.guesses.length - idx}
            key={idx}
          ></GuessListItem>
        ))}
    </IonList>
  );
});

export { GuessList };
export type { Guess };
