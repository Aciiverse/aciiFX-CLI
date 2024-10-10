import assert = require("node:assert");
import { describe, it } from "node:test";
import { db } from "@aciiverse/aciifx-cli";

describe("query", () => {
    it("get items", async () => {
        try {
            const result = await db.query("SELECT title FROM brands;");

            assert(result.length >= 0);
        } catch (error) {
            console.error(error);
        }
    });
});
