DATABASE_URL=postgresql://curricula:curricula@localhost:5432/curricula npx prisma migrate dev --name add_users_table

docker compose exec api npm install
