import React, { useCallback, useEffect, useState } from "react";
import "./GameController.css";
import { GuessList, Guess } from "./GuessList";
import InputBar from "./InputBar";
import NumberPad from "./NumberPad";
import { NUMBER_LENGTH } from "./constants";
import { computeGuessForNumber, generateAnswer } from "./utilities";

interface ContainerProps {
  name: string;
}

const GameController: React.FC<ContainerProps> = ({ name }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [answer] = useState<number[]>(() => generateAnswer(NUMBER_LENGTH));

  const appendNumber = useCallback(
    (value: number): void => {
      if (numbers.length < NUMBER_LENGTH) {
        setNumbers((nums) => [...nums, value]);
      }
    },
    [numbers.length]
  );

  const deleteNumber = () => setNumbers((nums) => nums.slice(0, -1));

  const submitClicked = useCallback(() => {
    if (numbers.length !== NUMBER_LENGTH) return;
    setGuesses((guesses) => [
      ...guesses,
      computeGuessForNumber(numbers, answer),
    ]);
    clearNumbers();
  }, [numbers, answer]);

  useEffect(() => {
    const cb = (ev: globalThis.KeyboardEvent) => {
      if (ev.repeat) return;
      if (/\d$/.test(ev.key)) appendNumber(parseInt(ev.key));
      if (ev.key === "Enter") submitClicked();
      if (ev.key === "Backspace") deleteNumber();
    };
    document.addEventListener("keydown", cb);
    return () => document.removeEventListener("keydown", cb);
  }, [submitClicked, appendNumber]);

  const clearNumbers = () => setNumbers([]);

  return (
    <div style={{height:"100%"}}>
      <div style={{width:"50%", height:"100%", display:"inline-block" , verticalAlign:"top", textAlign: "center"}}>
        <InputBar values={numbers} total={NUMBER_LENGTH}></InputBar>
        <NumberPad
          numbers={numbers}
          numberAdded={appendNumber}
          backspaceClicked={deleteNumber}
          submitClicked={submitClicked}
        ></NumberPad>
      </div>
      <div style={{width:"50%", height:"100%",display:"inline-block" , verticalAlign:"top"}}>
        <GuessList items={guesses}></GuessList>
      </div>
    </div>
  );
};

export default GameController;
