import React, { useCallback, useEffect, useState } from "react";
import "./GameController.css";
import { GuessList, Guess } from "./GuessList";
import InputBar from "./InputBar";
import NumberPad from "./NumberPad";
import { NUMBER_LENGTH } from "./constants";

interface ContainerProps {
  name: string;
}

const GameController: React.FC<ContainerProps> = ({ name }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [answer, ] = useState<number[]>(() =>
    generateAnswer(NUMBER_LENGTH)
  );

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
    <div className="container">
      <br />
      <InputBar values={numbers} total={NUMBER_LENGTH}></InputBar>
      <NumberPad
        numbers={numbers}
        numberAdded={appendNumber}
        backspaceClicked={deleteNumber}
        submitClicked={submitClicked}
      ></NumberPad>
      <GuessList items={guesses}></GuessList>
    </div>
  );
};

const computeGuessForNumber = (numbers: number[], actual: number[]): Guess => {
  let correctSpot = 0;
  let incorrectSpot = 0;
  let incorrect = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === actual[i]) {
      correctSpot++;
    } else if (actual.indexOf(numbers[i]) !== -1) {
      incorrectSpot++;
    } else {
      incorrect++;
    }
  }
  return {
    number: parseInt(numbers.join("")),
    correctSpot,
    incorrectSpot,
    incorrect,
  };
};

const generateAnswer = (length: number): number[] => {
  let arr = [];
  while (arr.length < length) {
    let rand = Math.floor(Math.random() * 10) + 1;
    if (arr.indexOf(rand) === -1) arr.push(rand);
  }
  return arr;
};
export default GameController;
