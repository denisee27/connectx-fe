import { describe, it, expect } from "vitest";
import { buildProfilingPayload } from "../../Profiling/utils/payload";

describe("buildProfilingPayload", () => {
  it("normalizes profile and answers correctly", () => {
    const profile = {
      fullName: "Jane Doe",
      age: "28",
      gender: "female",
      city: "Jakarta",
      occupation: "Engineer",
    };
    const answers = [
      { id: 1, value: "Large gatherings" },
      null,
      { id: 2, value: "Exercise" },
    ];

    const payload = buildProfilingPayload(profile, answers);
    expect(payload).toEqual({
      profile: {
        fullName: "Jane Doe",
        age: 28,
        gender: "female",
        city: "Jakarta",
        occupation: "Engineer",
      },
      answers: [
        { id: 1, value: "Large gatherings" },
        { id: 2, value: "Exercise" },
      ],
    });
  });
});