import { describe, expect, it, vi } from "vitest";
import { db } from "@/lib/db";
import * as apiModule from "@/lib/api";

describe("db.setProjects synchronization", () => {
  it("sends imageUrl to the backend POST endpoint when adding a new project", async () => {
    // Spy on apiFetch
    const apiFetchSpy = vi.spyOn(apiModule, "apiFetch").mockImplementation(async () => {
      return {
        ok: true,
        json: async () => ({ success: true }),
      } as Response;
    });

    const newProject = {
      id: "p_test_" + Date.now(),
      title: "Test Sync Project",
      category: "B2B Website",
      description: "Testing db sync",
      iconName: "BriefcaseBusiness",
      palette: "from-sky-600 via-teal-500 to-emerald-700",
      metrics: ["metric1"],
      imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    };

    // Trigger sync by updating projects list
    const currentProjects = db.getProjects();
    await db.setProjects([...currentProjects, newProject]);

    // Check if apiFetch was called with /api/projects and correct body
    const projectCall = apiFetchSpy.mock.calls.find(
      call => call[0] === "/api/projects" && call[1]?.method === "POST"
    );

    expect(projectCall).toBeDefined();
    const body = JSON.parse(projectCall![1]!.body as string);
    console.log("Sync POST Payload:", body);
    expect(body.imageUrl).toBe("https://res.cloudinary.com/demo/image/upload/sample.jpg");
  });
});
