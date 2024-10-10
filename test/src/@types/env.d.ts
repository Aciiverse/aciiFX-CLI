declare namespace NodeJS {
    interface ProcessEnv {
        DB_HOST?: string;
        DB_USER?: string;
        DB_NAME?: string;
        DB_PASS?: string;
        DB_PORT?: string;
    }
}
