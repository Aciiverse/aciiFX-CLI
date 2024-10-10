import { createPool } from "mysql2";

require("dotenv").config();

export const connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT || "3306"),
});
