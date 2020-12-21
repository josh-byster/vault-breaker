import { IonItem } from "@ionic/react";
import React from "react";
import { Guess } from "./GuessList";
import "./GuessListItem.css";

interface ListProps {
  item: Guess;
  idx: number;
}

const GuessListItem: React.FC<ListProps> = ({ item, idx }) => {
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
    <IonItem>
      <div className="guess-number-label">{idx}.</div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <div className="guess-number-label">{item.numbers.join("")}</div>
        {boxForGuess(item)}
      </div>
    </IonItem>
  );
};

export { GuessListItem };
