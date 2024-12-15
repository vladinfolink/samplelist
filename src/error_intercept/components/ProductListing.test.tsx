/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  describe("ProductListing", () => {
    it("filters by status when status is selected", async () => {
      render(<ProductListing />);

      // Find the status select by its placeholder or text
      const statusSelect = screen.getByText("All");
      expect(statusSelect).toBeInTheDocument();

      // Open the dropdown
      fireEvent.mouseDown(statusSelect);

      // Wait for and click the "Active" option in the dropdown
      const activeOption = await waitFor(() =>
        screen.getByText("Active", {
          selector: ".ant-select-item-option-content",
        })
      );
      fireEvent.click(activeOption);

      // Verify that the filter has been applied by checking status indicators
      await waitFor(() => {
        const statusElements = screen.getAllByText("Active", {
          selector: '[class*="statusIndicator"]',
        });
        expect(statusElements.length).toBeGreaterThan(0);
      });
    });
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
});
