import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import GameController from "./GameController";
import { GameStatisticsService } from "../services/persistence";
import { StatisticsContext } from "../App";
import { createStubInstance } from "sinon";

const renderWithContext = () => {
  const statsService = createStubInstance(GameStatisticsService);
  return render(
    <StatisticsContext.Provider value={statsService as unknown as GameStatisticsService}>
      <GameController />
    </StatisticsContext.Provider>
  );
};

describe("GameController", () => {
  it("responds to keyboard digit input", () => {
    const { container } = renderWithContext();
    act(() => {
      fireEvent.keyDown(document, { key: "1" });
      fireEvent.keyDown(document, { key: "2" });
    });
    const numberValues = container.querySelectorAll(".number-value");
    const texts = Array.from(numberValues).map((el) => el.textContent);
    expect(texts).toContain("1");
    expect(texts).toContain("2");
  });

  it("cleans up keyboard listener on unmount (no leaked listeners)", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const removeSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = renderWithContext();
    unmount();

    const addCalls = addSpy.mock.calls.filter(([event]) => event === "keydown");
    const removeCalls = removeSpy.mock.calls.filter(([event]) => event === "keydown");

    expect(addCalls).toHaveLength(1);
    expect(removeCalls).toHaveLength(1);
    expect(removeCalls[0][1]).toBe(addCalls[0][1]);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("supports backspace via keyboard", () => {
    const { container } = renderWithContext();
    act(() => {
      fireEvent.keyDown(document, { key: "1" });
      fireEvent.keyDown(document, { key: "2" });
      fireEvent.keyDown(document, { key: "3" });
      fireEvent.keyDown(document, { key: "Backspace" });
    });
    const numberValues = container.querySelectorAll(".number-value");
    const texts = Array.from(numberValues).map((el) => el.textContent);
    expect(texts).toContain("1");
    expect(texts).toContain("2");
    expect(texts).not.toContain("3");
  });

  it("ignores repeated key events (held key)", () => {
    const { container } = renderWithContext();
    act(() => {
      fireEvent.keyDown(document, { key: "5", repeat: false });
      fireEvent.keyDown(document, { key: "5", repeat: true });
      fireEvent.keyDown(document, { key: "5", repeat: true });
    });
    const numberValues = container.querySelectorAll(".number-value");
    const texts = Array.from(numberValues).map((el) => el.textContent);
    const fiveCount = texts.filter((t) => t === "5").length;
    expect(fiveCount).toBe(1);
  });

  it("renders number pad buttons", () => {
    const { container } = renderWithContext();
    const numberButtons = container.querySelectorAll(".number");
    expect(numberButtons.length).toBe(10);
  });

  it("renders submit button", () => {
    const { container } = renderWithContext();
    const submitButton = container.querySelector(".submit");
    expect(submitButton).toBeInTheDocument();
  });
});
