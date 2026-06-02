## package.json

- `package.json` tells how to run the project and what libraries are used.
- `npm run dev` starts the Next.js app locally.
- `npm run build` creates production build.
- `postinstall` runs `prisma generate`, because the original project uses Prisma.

Important libraries:
- Next.js + React: frontend and routing
- Clerk: authentication
- Prisma: current database layer
- LiveKit: live video streaming
- UploadThing: thumbnail/image upload
- Tailwind + Radix UI: styling/components
- Zustand: frontend state management

Learning:
This project uses Next.js with Clerk, Prisma, LiveKit, and UploadThing.  
For my version, Prisma/database logic will later be replaced with Spring Boot + PostgreSQL APIs.

## .env.example

- `.env.example` shows all config values needed to run the project.
- The app depends on Clerk, Database, LiveKit, and UploadThing.

Services:
- Clerk: authentication/login/signup
- DATABASE_URL: database connection used by Prisma in the original project
- LiveKit: live video streaming
- UploadThing: thumbnail/image upload

Important:
- Variables starting with `NEXT_PUBLIC_` are available on the frontend/browser.
- Variables without `NEXT_PUBLIC_` are private server-side secrets.

Current learning:
The app failed earlier because Clerk keys and DATABASE_URL were missing. Clerk was fixed, but DATABASE_URL is still empty, so Prisma database calls fail.

For my final version:
- Clerk can be kept for authentication.
- Prisma/MySQL database logic will be replaced by Spring Boot + PostgreSQL.
- LiveKit will be used for streaming.
- UploadThing can be kept for thumbnail upload.