import { Guess } from "../components/GuessList";
import log from "debug";

const logGuess = log("guess");
const logComputedAnswer = log("answer");

export const computeGuessForNumber = (
  numbers: number[],
  actual: number[]
): Guess => {
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

  const guess = {
    numbers,
    correctSpot,
    incorrectSpot,
    incorrect,
  };
  logGuess("Computed guess state %o", guess);
  return guess;
};

export const generateAnswer = (length: number): number[] => {
  let arr = [];
  logComputedAnswer("Computing new game answer...");
  while (arr.length < length) {
    let rand = Math.floor(Math.random() * 10);
    if (arr.indexOf(rand) === -1) arr.push(rand);
  }
  logComputedAnswer("Current game answer: %o", arr);
  return arr;
};

export const getSecondsElapsed = (startTime: Date) =>
  ((new Date() as any) - (startTime as any)) / 1000;

export const getDigit = (): number => {
  return Math.floor(Math.random() * 10);
};
