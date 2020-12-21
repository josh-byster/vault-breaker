import { IonList } from "@ionic/react";
import React from "react";
import "./GuessList.css";
import { GuessListItem } from "./GuessListItem";

interface ListProps {
  items: Guess[];
}

interface Guess {
  numbers: number[];
  correctSpot: number;
  incorrectSpot: number;
  incorrect: number;
}
const GuessList: React.FC<ListProps> = ({ items }) => {
  return (
    <IonList>
      {items
        .slice()
        .reverse()
        .map((item, idx) => (
          <GuessListItem item={item} idx={items.length - idx} key={idx}></GuessListItem>
        ))}
    </IonList>
  );
};

export { GuessList };
export type { Guess };
