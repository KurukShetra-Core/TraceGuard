import { expect, test } from "vitest";

import Hello from "../src/utils/check.js";

test("result of hello", () => {
  expect(Hello()).toBe("hello utils");
});
