import { IonItem, IonLabel, IonList } from "@ionic/react";
import React from "react";
import "./GuessList.css";

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
  const boxForGuess = (guess: Guess): JSX.Element => {
    return (
      <div className="box-container">
        {[...Array(guess.correctSpot)].map((_, idx) => (
          <span className="box correct" key={idx}></span>
        ))}

        {[...Array(guess.incorrectSpot)].map((_, idx) => (
          <span className="box incorrect-spot" key={idx}></span>
        ))}
        {[...Array(guess.incorrect)].map((_, idx) => (
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
            <div className="guess-number-label">{item.numbers.join("")}</div>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export { GuessList };
export type { Guess };
