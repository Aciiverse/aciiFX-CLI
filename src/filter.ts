export namespace filter {
    export enum CompareOperator {
        Equal = "eq",
        NotEqual = "neq",
        GreaterThan = "gt",
        GreaterEqual = "ge",
        LessThan = "lt",
        LessEqual = "le",
        Inside = "in",
        NotInside = "ni",
    }

    export interface Filter {
        operator: CompareOperator;
        value: any;
    }

    export interface FiltersType {
        [key: string]: FilterContent;
    }

    export interface FilterContent {
        filters: Filter[];
        and: boolean;
    }

    export interface SQLFilterExport {
        sql: string;
        values: any[];
    }

    /**
     * @method gets a filter by it's property
     * @param {string} property
     */
    export function getFilter(
        filters: FiltersType,
        property: string
    ): FilterContent {
        return filters[property];
    }

    /**
     * @method gets a filter by it's property
     * @param {string} property
     * @param {string} sqlProperty property as sql property
     * @returns {SQLFilterExport | undefined} the filter in sql syntax and it's values
     * @example sql: ` t.title = ? AND t.title != ? AND t.title LIKE %?% `
     * @example values: `[ Acii, Lacii, Joyboy ]`
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 20.11.2024
     */
    export function getFilterSQL(
        filters: FiltersType,
        property: string,
        sqlProperty: string
    ): SQLFilterExport | undefined {
        const filter = filters[property],
            values: any[] = [],
            sql: string[] = [];

        if (!filter) {
            // -> filter not exists
            return undefined;
        }

        const and = getSQLAnd(filter.and),
            content = filter.filters;

        content.forEach((e) => {
            const operator = getSQLOperator(e.operator);

            if (
                e.operator === CompareOperator.Inside ||
                e.operator === CompareOperator.NotInside
            ) {
                // -> LIKE with `%`
                sql.push(` ${sqlProperty} ${operator} %?% `);
            } else {
                // -> standard sql string
                sql.push(` ${sqlProperty} ${operator} ? `);
            }
            values.push(e.value);
        });

        const sqlStr = sql.join(and);
        return { sql: sqlStr, values: values };
    }

    /**
     * @method gets AND / OR
     * @param {boolean} and AND or OR
     * @returns {string} sql ready string
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 20.11.2024
     */
    function getSQLAnd(and: boolean): string {
        if (and) {
            // -> AND
            return "AND";
        }

        // -> OR
        return "OR";
    }

    /**
     * @method gets the compare operator
     * @param {boolean} operator
     * @returns {string} sql ready string
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 20.11.2024
     */
    function getSQLOperator(operator: CompareOperator): string {
        switch (operator) {
            case CompareOperator.Equal:
                return "=";
            case CompareOperator.GreaterEqual:
                return ">=";
            case CompareOperator.GreaterThan:
                return ">";
            case CompareOperator.Inside:
                return "LIKE";
            case CompareOperator.LessEqual:
                return "<=";
            case CompareOperator.LessThan:
                return "<";
            case CompareOperator.NotEqual:
                return "!=";
            case CompareOperator.NotInside:
                return "NOT LIKE";
        }
    }
}
