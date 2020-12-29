import { Guess } from "./GuessList";

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
  return {
    numbers,
    correctSpot,
    incorrectSpot,
    incorrect,
  };
};

export const generateAnswer = (length: number): number[] => {
  let arr = [];
  while (arr.length < length) {
    let rand = Math.floor(Math.random() * 10);
    if (arr.indexOf(rand) === -1) arr.push(rand);
  }
  console.log(`Current game answer is: ${arr.join("")}`)
  return arr;
};

export const getSecondsElapsed = (startTime: Date) =>
    ((new Date() as any) - (startTime as any)) / 1000;

    export const getDigit = (): number => {
      return Math.floor(Math.random() * 10);
    };