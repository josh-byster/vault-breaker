import { IonList } from "@ionic/react";
import { action, autorun, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLInputElement>(null);

  const scrollIntoView = () => {
    if (null !== messagesEndRef.current) {
      messagesEndRef.current!.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => reaction(() => state.guesses.length, scrollIntoView), []);

  return (
    <IonList>
      {state.guesses.slice().map((item, idx) => (
        <GuessListItem item={item} idx={idx + 1} key={idx}></GuessListItem>
      ))}
      <div ref={messagesEndRef} />
    </IonList>
  );
});

export { GuessList };
export type { Guess };
