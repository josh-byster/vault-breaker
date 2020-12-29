import { makeAutoObservable } from "mobx";
import { NUMBER_LENGTH } from "../components/constants";
import { Guess } from "../components/GuessList";
import { logGameplay } from "../components/persistence";
import {
  computeGuessForNumber,
  generateAnswer,
  getDigit,
  getSecondsElapsed,
} from "../components/utilities";

class GameState {
  numbers: number[] = [];
  guesses: Guess[] = [];
  answer: number[];
  showGameAlert: boolean = false;
  startTime: Date | undefined;
  hintsLeft: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.answer = generateAnswer(NUMBER_LENGTH);
  }

  addNumber(n: number) {
    if (this.numbers.length < NUMBER_LENGTH) {
      this.numbers.push(n);
    }
  }

  clearNumbers() {
    this.numbers = [];
  }

  removeLastNumber() {
    this.numbers = this.numbers.slice(0, -1);
  }

  private handleWin() {
    logGameplay({
      time: getSecondsElapsed(this.startTime!),
      guesses: this.guesses.length,
    });
    this.showGameAlert = true;
  }

  submitClicked() {
    if (this.numbers.length !== NUMBER_LENGTH) return;
    this.guesses.push(computeGuessForNumber(this.numbers, this.answer));
    if (this.guesses.length === 1) {
      this.startTime = new Date();
    }
    if (this.numbers.join("") === this.answer.join("")) {
      this.handleWin();
    }
    this.clearNumbers();
  }

  handleKeyboardEvent(ev: globalThis.KeyboardEvent) {
    if (ev.repeat) return;
    if (this.numbers.indexOf(parseInt(ev.key)) !== -1) return;
    if (/\d$/.test(ev.key)) this.addNumber(parseInt(ev.key));
    if (ev.key === "Enter") this.submitClicked();
    if (ev.key === "Backspace") this.removeLastNumber();
  }

  shouldDisableNumber(number: number) {
    return (
      this.numbers.indexOf(number) !== -1 ||
      this.numbers.length === NUMBER_LENGTH
    );
  }

  get submitButtonDisabled() {
    return this.numbers.length < NUMBER_LENGTH;
  }

  get backspaceButtonDisabled() {
    return this.numbers.length === 0;
  }

  get hintButtonDisabled() {
    return !this.hintsLeft || this.guesses.length < 5;
  }

  get hintMessage() {
    let randomDigit = getDigit();
    while (this.answer.indexOf(randomDigit) !== -1) {
      randomDigit = getDigit();
    }
    return `The answer does not contain ${randomDigit}.`;
  }
}

export { GameState };
