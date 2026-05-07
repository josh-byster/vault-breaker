import React from "react";
import { render, screen } from "@testing-library/react";
import { GuessListItem } from "./GuessListItem";

describe("GuessListItem", () => {
  it("displays the guess number", () => {
    const item = { numbers: [1, 2, 3, 4], correctSpot: 2, incorrectSpot: 1, incorrect: 1 };
    render(<GuessListItem item={item} idx={3} />);
    expect(screen.getByText("3.")).toBeInTheDocument();
  });

  it("displays the guessed digits as a string", () => {
    const item = { numbers: [5, 6, 7, 8], correctSpot: 0, incorrectSpot: 0, incorrect: 4 };
    render(<GuessListItem item={item} idx={1} />);
    expect(screen.getByText("5678")).toBeInTheDocument();
  });

  it("renders correct number of colored boxes", () => {
    const item = { numbers: [1, 2, 3, 4], correctSpot: 2, incorrectSpot: 1, incorrect: 1 };
    const { container } = render(<GuessListItem item={item} idx={1} />);
    expect(container.querySelectorAll(".box.correct")).toHaveLength(2);
    expect(container.querySelectorAll(".box.incorrect-spot")).toHaveLength(1);
    expect(container.querySelectorAll(".box.incorrect")).toHaveLength(1);
  });

  it("renders all correct boxes for a perfect guess", () => {
    const item = { numbers: [1, 2, 3, 4], correctSpot: 4, incorrectSpot: 0, incorrect: 0 };
    const { container } = render(<GuessListItem item={item} idx={1} />);
    expect(container.querySelectorAll(".box.correct")).toHaveLength(4);
    expect(container.querySelectorAll(".box.incorrect-spot")).toHaveLength(0);
    expect(container.querySelectorAll(".box.incorrect")).toHaveLength(0);
  });

  it("renders all incorrect boxes for completely wrong guess", () => {
    const item = { numbers: [5, 6, 7, 8], correctSpot: 0, incorrectSpot: 0, incorrect: 4 };
    const { container } = render(<GuessListItem item={item} idx={1} />);
    expect(container.querySelectorAll(".box.incorrect")).toHaveLength(4);
  });

  it("handles zero in the guess numbers", () => {
    const item = { numbers: [0, 1, 2, 3], correctSpot: 1, incorrectSpot: 3, incorrect: 0 };
    render(<GuessListItem item={item} idx={1} />);
    expect(screen.getByText("0123")).toBeInTheDocument();
  });
});
