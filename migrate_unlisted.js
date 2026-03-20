import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_CONNECTION_URL is not defined");
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log("Creating qps_unlisted_links table...");
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS qps_unlisted_links (
          id TEXT PRIMARY KEY, -- 短いトークン (例: YrsLqc, xxxxx) NanoIDで生成する。
          post_id TEXT NOT NULL, -- qps_posts.id への参照
          expires_at TEXT NOT NULL, -- ISO 8601形式 (例: 2026-04-21T...)
          created_at TEXT NOT NULL,
          FOREIGN KEY (post_id) REFERENCES qps_posts(id) ON DELETE CASCADE
      );
    `);
    
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_unlisted_links_post_id ON qps_unlisted_links(post_id);
    `);
    
    console.log("Table and index created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

main();
