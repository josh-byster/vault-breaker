import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NumberPad from "./NumberPad";
import { GameState } from "../store/GameState";
import { GameStatisticsService } from "../services/persistence";
import { createStubInstance } from "sinon";

describe("NumberPad", () => {
  let state: GameState;

  beforeEach(() => {
    const statsService = createStubInstance(GameStatisticsService);
    state = new GameState(statsService);
  });

  it("renders 10 number buttons (0-9)", () => {
    render(<NumberPad state={state} />);
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("renders a submit button", () => {
    const { container } = render(<NumberPad state={state} />);
    const submitBtn = container.querySelector(".submit");
    expect(submitBtn).toBeInTheDocument();
  });

  it("calls addNumber when a number button is clicked", () => {
    render(<NumberPad state={state} />);
    fireEvent.click(screen.getByText("5"));
    expect(state.numbers).toContain(5);
  });

  it("calls addNumber on pointerUp event", () => {
    render(<NumberPad state={state} />);
    fireEvent.pointerUp(screen.getByText("7"));
    expect(state.numbers).toContain(7);
  });

  it("disables buttons for already-entered numbers", () => {
    state.addNumber(3);
    render(<NumberPad state={state} />);
    expect(screen.getByText("3")).toBeDisabled();
  });

  it("disables all number buttons when input is full", () => {
    state.addNumber(1);
    state.addNumber(2);
    state.addNumber(3);
    state.addNumber(4);
    render(<NumberPad state={state} />);
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).toBeDisabled();
    }
  });

  it("disables submit button when numbers are incomplete", () => {
    state.addNumber(1);
    const { container } = render(<NumberPad state={state} />);
    const submitBtn = container.querySelector(".submit") as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it("enables submit button when numbers are complete", () => {
    state.addNumber(1);
    state.addNumber(2);
    state.addNumber(3);
    state.addNumber(4);
    const { container } = render(<NumberPad state={state} />);
    const submitBtn = container.querySelector(".submit") as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);
  });

  it("calls submitClicked when submit button is clicked", () => {
    state.answer = [1, 2, 3, 4];
    state.addNumber(5);
    state.addNumber(6);
    state.addNumber(7);
    state.addNumber(8);
    const { container } = render(<NumberPad state={state} />);
    const submitBtn = container.querySelector(".submit") as HTMLButtonElement;
    fireEvent.click(submitBtn);
    expect(state.guesses).toHaveLength(1);
  });

  it("handles rapid sequential button presses", () => {
    render(<NumberPad state={state} />);
    fireEvent.pointerUp(screen.getByText("1"));
    fireEvent.pointerUp(screen.getByText("2"));
    fireEvent.pointerUp(screen.getByText("3"));
    fireEvent.pointerUp(screen.getByText("4"));
    expect(state.numbers).toEqual([1, 2, 3, 4]);
  });

  it("dual event (click + pointerUp) on same button is idempotent", () => {
    render(<NumberPad state={state} />);
    const btn = screen.getByText("5");
    fireEvent.pointerUp(btn);
    fireEvent.click(btn);
    expect(state.numbers).toEqual([5]);
  });

  it("buttons re-enable after submit clears input", () => {
    state.answer = [1, 2, 3, 4];
    state.addNumber(5);
    state.addNumber(6);
    state.addNumber(7);
    state.addNumber(8);
    state.submitClicked();
    // After submit, numbers are cleared - all buttons should be enabled
    render(<NumberPad state={state} />);
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).not.toBeDisabled();
    }
  });

  it("submit button via pointerUp triggers submission", () => {
    state.answer = [1, 2, 3, 4];
    state.addNumber(5);
    state.addNumber(6);
    state.addNumber(7);
    state.addNumber(8);
    const { container } = render(<NumberPad state={state} />);
    const submitBtn = container.querySelector(".submit") as HTMLButtonElement;
    fireEvent.pointerUp(submitBtn);
    expect(state.guesses).toHaveLength(1);
  });

  it("does not allow pressing a number that fills past max", () => {
    state.addNumber(1);
    state.addNumber(2);
    state.addNumber(3);
    state.addNumber(4);
    render(<NumberPad state={state} />);
    // Button 5 should be disabled since input is full
    expect(screen.getByText("5")).toBeDisabled();
    // Clicking it shouldn't change state
    fireEvent.click(screen.getByText("5"));
    expect(state.numbers).toEqual([1, 2, 3, 4]);
  });

  it("handles all buttons in sequence (0-9) up to max length", () => {
    render(<NumberPad state={state} />);
    fireEvent.click(screen.getByText("0"));
    fireEvent.click(screen.getByText("9"));
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("3"));
    expect(state.numbers).toEqual([0, 9, 5, 3]);
    // Trying more should not work
    fireEvent.click(screen.getByText("7"));
    expect(state.numbers).toEqual([0, 9, 5, 3]);
  });
});
