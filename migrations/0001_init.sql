-- Initial schema for the registration system.

CREATE TABLE registrations (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  event_slug      TEXT    NOT NULL,
  name            TEXT    NOT NULL,
  email           TEXT    NOT NULL,
  phone           TEXT    NOT NULL,
  level_confirmed INTEGER NOT NULL CHECK (level_confirmed IN (0, 1)),
  status          TEXT    NOT NULL CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  cancelled_at    TEXT
);

-- Block duplicate signups per event (case-insensitive on email).
CREATE UNIQUE INDEX idx_registrations_event_email
  ON registrations (event_slug, LOWER(email))
  WHERE status != 'cancelled';

-- Speeds up the per-event capacity / waitlist queries.
CREATE INDEX idx_registrations_event_status
  ON registrations (event_slug, status, created_at);
