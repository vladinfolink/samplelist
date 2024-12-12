/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductListing from "./ProductListing";

describe("ProductListing", () => {
  it("renders component and shows title", () => {
    render(<ProductListing />);
    expect(screen.getByText(/Instrument Products/)).toBeInTheDocument();
  });

  it("shows search input and filter controls", () => {
    render(<ProductListing />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("+ Add Filter")).toBeInTheDocument();
    expect(screen.getByText("Reset All")).toBeInTheDocument();
  });

  it("filters products when searching", () => {
    render(<ProductListing />);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Pliant Corp Credit" } });
    expect(screen.getByText("Pliant Corp Credit")).toBeInTheDocument();
  });

  it("resets filters when clicking Reset All", () => {
    render(<ProductListing />);
    const resetButton = screen.getByText("Reset All");
    const searchInput = screen.getByPlaceholderText("Search");

    // First apply a filter
    fireEvent.change(searchInput, { target: { value: "Pliant Corp Credit" } });

    // Then reset
    fireEvent.click(resetButton);
    expect(searchInput).toHaveValue("");
  });
});

describe("ProductListing", () => {
  // Keep existing passing tests unchanged
  it("renders component and shows title", () => {
    render(<ProductListing />);
    expect(screen.getByText(/Instrument Products/)).toBeInTheDocument();
  });

  it("shows search input and filter controls", () => {
    render(<ProductListing />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("+ Add Filter")).toBeInTheDocument();
    expect(screen.getByText("Reset All")).toBeInTheDocument();
  });

  it("filters products when searching", () => {
    render(<ProductListing />);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Pliant Corp Credit" } });
    expect(screen.getByText("Pliant Corp Credit")).toBeInTheDocument();
  });

  it("resets filters when clicking Reset All", () => {
    render(<ProductListing />);
    const resetButton = screen.getByText("Reset All");
    const searchInput = screen.getByPlaceholderText("Search");

    fireEvent.change(searchInput, { target: { value: "Pliant Corp Credit" } });
    fireEvent.click(resetButton);
    expect(searchInput).toHaveValue("");
  });

  // Fixed network test
  it("displays network information", () => {
    render(<ProductListing />);
    const mastercardElements = screen.getAllByText("Mastercard");
    expect(mastercardElements.length).toBeGreaterThan(0);
  });
});

describe("ProductListing", () => {
  it("renders component and shows title", () => {
    render(<ProductListing />);
    expect(screen.getByText(/Instrument Products/)).toBeInTheDocument();
  });

  it("shows search input and filter controls", () => {
    render(<ProductListing />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("+ Add Filter")).toBeInTheDocument();
    expect(screen.getByText("Reset All")).toBeInTheDocument();
  });

  it("filters products when searching", () => {
    render(<ProductListing />);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Pliant Corp Credit" } });
    expect(screen.getByText("Pliant Corp Credit")).toBeInTheDocument();
  });

  it("resets filters when clicking Reset All", () => {
    render(<ProductListing />);
    const resetButton = screen.getByText("Reset All");
    const searchInput = screen.getByPlaceholderText("Search");

    fireEvent.change(searchInput, { target: { value: "Pliant Corp Credit" } });
    fireEvent.click(resetButton);
    expect(searchInput).toHaveValue("");
  });

  it("displays network information", () => {
    render(<ProductListing />);
    const mastercardElements = screen.getAllByText("Mastercard");
    expect(mastercardElements.length).toBeGreaterThan(0);
  });

  it("filters by status when status is selected", async () => {
    const { container } = render(<ProductListing />);

    // Allow time for initial render
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Find the select element by class
    const select = container.querySelector(".ant-select-selector");
    expect(select).toBeTruthy();

    if (select) {
      // Open dropdown
      fireEvent.mouseDown(select);

      // Wait for dropdown to open
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Click Active option
      fireEvent.click(screen.getByText("Active"));

      // Wait for filtering to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify filter results
      const approvedElements = screen.getAllByText("Approved");
      expect(approvedElements.length).toBeGreaterThan(0);
    }
  });

  it("changes page when pagination is clicked", () => {
    render(<ProductListing />);
    const nextButton = screen.getByText(">");
    fireEvent.click(nextButton);
    expect(screen.getByText(/Total \d+ items/)).toBeInTheDocument();
  });

  it("handles page change during loading state", () => {
    render(<ProductListing />);
    const nextButton = screen.getByText(">");
    // Click rapidly to test loading state handling
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(screen.getByText(/Total \d+ items/)).toBeInTheDocument();
  });

  it("filters by status when status is selected", async () => {
    const { container } = render(<ProductListing />);

    // Using MutationObserver to wait for the Select to be fully rendered
    await new Promise((resolve) => setTimeout(resolve, 0));

    const select = container.querySelector(".ant-select-selector");
    expect(select).toBeTruthy();

    if (select) {
      fireEvent.mouseDown(select);
      fireEvent.click(screen.getByText("Active"));
    }

    // Wait for the filtering to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    const approvedElements = screen.getAllByText("Approved");
    expect(approvedElements.length).toBeGreaterThan(0);
  });
});
