// Disabled for the moment
// import { ResultSetHeader } from "mysql2";
// import { connection } from "./mysql";

// export namespace db {
//     interface DBQuery extends Array<any>, ResultSetHeader {}

//     /**
//      * @method executes a sql query async
//      * @param {string} sql query for sql database
//      * @param {any[]?} values optonal values
//      * @returns {Promise<DBQuery>} the sql query result
//      * @author Flowtastisch
//      * @memberof Aciiverse
//      * @date 08.10.2024
//      */
//     export function query(sql: string, values?: any[]): Promise<DBQuery> {
//         if (!values) {
//             values = [];
//         }

//         return new Promise<DBQuery>((res, rej) => {
//             connection.query(sql, values, (err, result: DBQuery) => {
//                 if (err) {
//                     // -> error occured in sql
//                     return rej(err);
//                 }
//                 return res(result);
//             });
//         });
//     }
// }
