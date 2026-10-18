#!/usr/bin/env python3
"""Create one invite row and print the registration link.

Stores sha256(raw token bytes) in Invite.token. The link carries the raw
token as hex. Requires: pip install "psycopg[binary]"

Usage:
  DATABASE_URL=postgresql://curricula:curricula@localhost:5432/curricula \\
    python scripts/create_invite.py \\
      --email teacher@school.si \\
      --school-id 3 \\
      --role ADMIN \\
      --days 7 \\
      --base-url https://app.example.com
"""

import argparse
import hashlib
import os
import secrets
import sys
from datetime import datetime, timedelta, timezone

import psycopg


def main() -> None:
    parser = argparse.ArgumentParser(description="Insert an invite and print its URL.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--school-id", required=True, type=int)
    parser.add_argument("--role", choices=["USER", "ADMIN"], default="USER")
    parser.add_argument("--days", type=int, default=7, help="Days until the invite expires.")
    parser.add_argument(
        "--base-url",
        default=os.environ.get("APP_BASE_URL", "http://localhost:3001"),
        help="Frontend origin. The path /register?invite= is appended.",
    )
    args = parser.parse_args()

    email = args.email.strip()
    if not email:
        sys.exit("Email is empty.")
    if args.days < 1:
        sys.exit("--days must be at least 1.")

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        sys.exit("Set DATABASE_URL.")

    raw = secrets.token_bytes(32)
    url_token = raw.hex()
    stored_hash = hashlib.sha256(raw).hexdigest()
    expiry = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=args.days)

    with psycopg.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute('SELECT name FROM "School" WHERE id = %s', (args.school_id,))
            school = cur.fetchone()
            if school is None:
                sys.exit(f"School {args.school_id} does not exist.")

            cur.execute(
                """
                INSERT INTO "Invite" (token, email, "schoolId", role, expiry)
                VALUES (%s, %s, %s, %s::"Role", %s)
                """,
                (stored_hash, email, args.school_id, args.role, expiry),
            )
        conn.commit()

    link = f"{args.base_url.rstrip('/')}/register?invite={url_token}"
    print(f"school: {school[0]}")
    print(f"email:  {email}")
    print(f"role:   {args.role}")
    print(f"expiry: {expiry.isoformat(timespec='seconds')}Z")
    print(link)


if __name__ == "__main__":
    main()
