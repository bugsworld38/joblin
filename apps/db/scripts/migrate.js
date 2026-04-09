import { config } from "dotenv";
import { execFileSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(__dirname, "../.env") });

const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT = "5432",
    POSTGRES_DB,
} = process.env;

if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_HOST || !POSTGRES_DB) {
    console.error("Missing required POSTGRES_* environment variables");
    process.exit(1);
}

const databaseUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable`;

const args = process.argv.slice(2);

execFileSync(
    "dbmate",
    [
        "--url",
        databaseUrl,
        "--migrations-dir",
        resolve(__dirname, "../migrations"),
        ...args,
    ],
    {
        stdio: "inherit",
    },
);
