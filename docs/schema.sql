-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- UUID
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    self_intro_markdown TEXT,
    password_hash TEXT,
    email_verified_at TEXT,
    is_admin INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Query Plan Posts table
CREATE TABLE IF NOT EXISTS qps_posts (
    id TEXT PRIMARY KEY, -- UUID
    query_plan_xml TEXT NOT NULL,
    title TEXT NOT NULL,
    comment_markdown TEXT,
    owner_id TEXT, -- UUID, NULL for guest
    edit_token TEXT, -- Token for guest editing
    is_active INTEGER DEFAULT 1, -- 1: Active, 0: Archived
    is_public INTEGER DEFAULT 1, -- 1: Public, 0: Private
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS qps_comments (
    id TEXT PRIMARY KEY, -- UUID
    post_id TEXT NOT NULL,
    comment_markdown TEXT NOT NULL,
    owner_id TEXT, -- UUID, NULL for guest
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES qps_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Email Verification Tokens
CREATE TABLE IF NOT EXISTS email_verify_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
