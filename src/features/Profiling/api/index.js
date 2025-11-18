import api from "../../../core/api";

// Simple retry mechanism: up to 3 attempts with exponential backoff
export async function submitProfiling(payload) {
  const maxAttempts = 3;
  let attempt = 0;
  let lastError = null;
  while (attempt < maxAttempts) {
    try {
      const res = await api.post("/profiling/submit", payload, {
        timeout: 10000,
      });
      return res?.data ?? res;
    } catch (e) {
      lastError = e;
      attempt += 1;
      const delay = 400 * Math.pow(2, attempt); // 800, 1600, 3200
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError || new Error("Submit failed");
}