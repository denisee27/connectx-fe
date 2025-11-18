import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock navigate to observe redirects
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Questioner from "../../Profiling/pages/Questioner.jsx";

describe("Questioner refresh confirmation", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("shows modal on F5 and handles Yes to reset and redirect", async () => {
    // Seed temporary data
    localStorage.setItem("profilingProfile", JSON.stringify({ fullName: "Test" }));

    render(<Questioner />);

    // Trigger F5
    const event = new KeyboardEvent("keydown", { key: "F5" });
    window.dispatchEvent(event);

    // Modal should appear
    expect(
      await screen.findByText(
        /Apakah Anda yakin ingin memulai ulang\? Semua jawaban akan direset\./i
      )
    ).toBeInTheDocument();

    // Confirm Yes
    const yesBtn = await screen.findByRole("button", { name: /yes/i });
    await userEvent.click(yesBtn);

    // Redirect called and storage cleared
    expect(mockNavigate).toHaveBeenCalledWith("/profiling/form", { replace: true });
    expect(localStorage.getItem("profilingProfile")).toBeNull();
  });

  it("redirects to form on actual reload when flag is present", async () => {
    // Simulate a previous pagehide and a real reload
    sessionStorage.setItem("profilingReloadPending", "1");
    // Mock performance navigation type
    const original = global.performance.getEntriesByType;
    global.performance.getEntriesByType = () => [{ type: "reload" }];

    render(<Questioner />);

    expect(mockNavigate).toHaveBeenCalledWith("/profiling/form", { replace: true });

    // Restore performance
    global.performance.getEntriesByType = original;
  });
});