export namespace filter {
    interface Req {
        query: {
            [key: string]: any;
        };
    }

    interface GetQueryParamsOptions {
        all?: boolean;
        filters?: boolean;
        orderBy?: boolean;
        topSkip?: boolean;
        select?: boolean;
    }

    interface GetQueryParams {
        filters?: FiltersType;
        orderBy?: OrderByType;
        top?: number;
        skip?: number;
        select?: string[];
    }

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

    interface OrderBy {
        property: string;
        ascending: boolean;
    }
    export type OrderByType = OrderBy | OrderBy[];

    /**
     * @async
     * @method gets the query params
     * @param {Req} req the route request
     * @param {GetQueryParamsOptions} options for defining which params should readed
     * @returns {Promise<GetQueryParams>} all `query params` as an object
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 21.11.2024
     */
    export async function getQueryParams(
        req: Req,
        options: GetQueryParamsOptions
    ): Promise<GetQueryParams> {
        const response: GetQueryParams = {};

        if (options.all || options.filters) {
            // -> filters defined -> read filters
            const filters = req.query.$filters;

            if (filters && typeof filters === "string") {
                // -> filter string not undefined & valid
                try {
                    const fObj: FiltersType = await JSON.parse(filters);

                    if (!fObj || Object.keys(fObj).length === 0) {
                        // -> no filters
                        response.filters = undefined;
                    } else {
                        // -> filters exists
                        response.filters = fObj;
                    }
                } catch (err) {
                    // -> response stay undefined
                }
            }
        }

        if (options.all || options.orderBy) {
            // -> orderBy defined -> read orderBy
            const orderBy = req.query.$orderBy;

            if (orderBy && typeof orderBy === "string") {
                // -> orderBy string not undefined & valid
                try {
                    const parsed: OrderBy | OrderBy[] =
                        await JSON.parse(orderBy);
                    response.orderBy = parsed;
                } catch (err) {
                    // -> response stay undefined
                }
            }
        }

        if (options.all || options.select) {
            // -> select defined -> read select
            const select = req.query.$select;

            if (select && typeof select === "string") {
                // -> select string not undefined & valid
                try {
                    const parsed: string[] = await JSON.parse(select);
                    response.select = parsed;
                } catch (err) {
                    // -> response stay undefined
                }
            }
        }

        if (options.all || options.topSkip) {
            // -> topSkip defined -> read topSkip
            const top = parseInt(req.query.$top as string),
                skip = parseInt(req.query.$skip as string);

            if (!isNaN(top) && typeof top === "number") {
                // -> top number not undefined & valid
                response.top = top;
            }

            if (!isNaN(skip) && typeof skip === "number") {
                // -> skip number defined & valid
                response.skip = skip;
            } else {
                // -> skip undefined -> skip initially to 0
                response.skip = 0;
            }
        }
        return response;
    }

    /**
     * @method gets only the first filter value, that exists for the searched property
     * @param {FiltersType} filters in which to search
     * @param {string} property search property
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 21.11.2024
     */
    export function getFirstFilterValue(
        filters: FiltersType,
        property: string
    ): any | undefined {
        const content = getFilter(filters, property),
            innerFilters = content?.filters;

        if (!innerFilters || !innerFilters[0]) {
            // -> filter not defined
            return undefined;
        }

        return innerFilters[0].value;
    }

    /**
     * @method gets a filter by it's property
     * @param {FiltersType} filters in which to search
     * @param {string} property
     * @returns {FilterContent} the raw filter content
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 21.11.2024
     */
    export function getFilter(
        filters: FiltersType,
        property: string
    ): FilterContent {
        return filters[property];
    }

    /**
     * @method gets a filter by it's property
     * @param {FiltersType} filters in which to search
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
                // -> (NOT) LIKE value with `%`
                values.push(`%${e.value.trim()}%`);
            } else {
                // -> standard value string
                values.push(e.value);
            }
            sql.push(` ${sqlProperty} ${operator} ? `);
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
