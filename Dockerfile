FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base AS development

RUN npm ci --ignore-scripts

COPY . .

ENV DATABASE_URL="postgresql://curricula:curricula@db:5432/curricula"

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]

FROM base AS build

RUN npm ci --ignore-scripts

COPY . .

ENV DATABASE_URL="postgresql://curricula:curricula@db:5432/curricula"

RUN npx prisma generate

RUN npm run build

RUN npm ci --omit=dev --ignore-scripts

FROM base AS production

ENV NODE_ENV=production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prompts ./prompts
COPY package*.json ./

CMD ["npm", "run", "start:prod"]
