import React from "react";
import { render } from "@testing-library/react";
import { GuessList } from "./GuessList";
import { GameState } from "../store/GameState";
import { GameStatisticsService } from "../services/persistence";
import { createStubInstance } from "sinon";

describe("GuessList", () => {
  let state: GameState;

  beforeEach(() => {
    const statsService = createStubInstance(GameStatisticsService);
    state = new GameState(statsService);
  });

  it("renders empty list when no guesses made", () => {
    const { container } = render(<GuessList state={state} />);
    const items = container.querySelectorAll("ion-item");
    expect(items).toHaveLength(0);
  });

  it("renders one item after one guess", () => {
    state.answer = [1, 2, 3, 4];
    state.addNumber(5);
    state.addNumber(6);
    state.addNumber(7);
    state.addNumber(8);
    state.submitClicked();

    const { container } = render(<GuessList state={state} />);
    const items = container.querySelectorAll("ion-item");
    expect(items).toHaveLength(1);
  });

  it("renders multiple items for multiple guesses", () => {
    state.answer = [1, 2, 3, 4];
    for (let i = 0; i < 3; i++) {
      state.addNumber(5);
      state.addNumber(6);
      state.addNumber(7);
      state.addNumber(8);
      state.submitClicked();
    }

    const { container } = render(<GuessList state={state} />);
    const items = container.querySelectorAll("ion-item");
    expect(items).toHaveLength(3);
  });

  it("displays guesses in reverse order (newest first)", () => {
    state.answer = [1, 2, 3, 4];

    state.addNumber(5);
    state.addNumber(6);
    state.addNumber(7);
    state.addNumber(8);
    state.submitClicked();

    state.addNumber(9);
    state.addNumber(0);
    state.addNumber(1);
    state.addNumber(2);
    state.submitClicked();

    const { container } = render(<GuessList state={state} />);
    const labels = container.querySelectorAll(".guess-number-label");
    // Labels alternate: index label, then guess digits
    // First item should be guess #2 (newest), second should be guess #1
    const indexLabels = Array.from(labels).filter((el) =>
      el.textContent?.endsWith(".")
    );
    expect(indexLabels[0].textContent).toBe("2.");
    expect(indexLabels[1].textContent).toBe("1.");
  });

  it("shows correct guess digits in each row", () => {
    state.answer = [1, 2, 3, 4];

    state.addNumber(5);
    state.addNumber(6);
    state.addNumber(7);
    state.addNumber(8);
    state.submitClicked();

    const { container } = render(<GuessList state={state} />);
    const digitLabels = Array.from(
      container.querySelectorAll(".guess-number-label")
    ).filter((el) => !el.textContent?.endsWith("."));
    expect(digitLabels[0].textContent).toBe("5678");
  });
});
