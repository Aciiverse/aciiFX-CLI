import { aciiFX } from "@aciiverse/fetcii";
import assert = require("node:assert");
import { describe, it } from "node:test";

describe("module worked", () => {
    it("started", () => {
        assert(aciiFX.testModule());
    });
});
