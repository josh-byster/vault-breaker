import {
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import React from "react";
import "./GuessList.css";

interface ListProps {
  items: Guess[];
}

interface Guess {
  number: number;
  correctSpot: number;
  incorrectSpot: number;
  incorrect: number;
}
const GuessList: React.FC<ListProps> = ({ items }) => {
  const boxForGuess = (guess: Guess): JSX.Element => {
    return (
      <div>
        {[...Array(guess.correctSpot)].map((_,idx) => (
          <span className="box correct" key={idx}></span>
        ))}

{[...Array(guess.incorrectSpot)].map((_,idx) => (
          <span className="box incorrect-spot" key={idx}></span>
        ))}
        {[...Array(guess.incorrect)].map((_,idx) => (
          <span className="box incorrect" key={idx}></span>
        ))}
      </div>
    );
  };
  return (
    <IonList>
      {items.map((item,idx) => (
        <IonItem key={idx}>
          <IonLabel>
            {boxForGuess(item)}
            Number: {item.number}, correct spot: {item.correctSpot}, incorrect
            spot: {item.incorrectSpot}, incorrect: {item.incorrect}{" "}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export { GuessList };
export type { Guess };
