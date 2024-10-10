import { db as dbModule } from "./db";
import { filter as filterModule } from "./filter";

export const db = dbModule,
    filter = filterModule;

/**
 * @module aciiFX cli shows all modules & functions you can use
 * @author Flowtastisch
 * @memberof Aciiverse
 * @date 10.10.2024
 */
export namespace aciiFX {
    export const db = dbModule,
        filter = filterModule;
}
