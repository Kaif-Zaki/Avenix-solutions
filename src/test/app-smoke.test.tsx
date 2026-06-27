import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App", () => {
  it("renders the Nexora Tech homepage", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
      createRoot(container).render(<App />);
    });

    expect(container.textContent).toMatch(/build the website clients trust before they ever call/i);
  });
});
