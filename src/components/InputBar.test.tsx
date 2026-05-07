import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputBar from "./InputBar";
import { GameState } from "../store/GameState";
import { GameStatisticsService } from "../services/persistence";
import { createStubInstance } from "sinon";

describe("InputBar", () => {
  let state: GameState;

  beforeEach(() => {
    const statsService = createStubInstance(GameStatisticsService);
    state = new GameState(statsService);
  });

  it("renders the correct number of slots", () => {
    const { container } = render(<InputBar state={state} total={4} />);
    const spans = container.querySelectorAll(".number-value");
    expect(spans).toHaveLength(4);
  });

  it("shows underscores for empty slots", () => {
    render(<InputBar state={state} total={4} />);
    const underscores = screen.getAllByText("_");
    expect(underscores).toHaveLength(4);
  });

  it("shows entered numbers in their positions", () => {
    state.addNumber(7);
    state.addNumber(3);
    render(<InputBar state={state} total={4} />);
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getAllByText("_")).toHaveLength(2);
  });

  it("shows all numbers when input is full", () => {
    state.addNumber(1);
    state.addNumber(2);
    state.addNumber(3);
    state.addNumber(4);
    render(<InputBar state={state} total={4} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByText("_")).not.toBeInTheDocument();
  });

  it("clears numbers when clicked", () => {
    state.addNumber(5);
    state.addNumber(6);
    const { container } = render(<InputBar state={state} total={4} />);
    fireEvent.click(container.firstChild as Element);
    expect(state.numbers).toEqual([]);
  });

  it("displays zero correctly", () => {
    state.addNumber(0);
    render(<InputBar state={state} total={4} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
