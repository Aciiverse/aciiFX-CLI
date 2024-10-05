import { aciiFX } from "@aciiverse/aciifx-cli";
import assert = require("node:assert");
import { describe, it } from "node:test";

describe("module worked", () => {
    it("started", () => {
        assert(aciiFX.testModule());
    });
});
