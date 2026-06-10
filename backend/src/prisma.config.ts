// import "dotenv/config";
// import { defineConfig } from "prisma/config";

// const url = process.env.DATABASE_URL;
// if (!url) throw new Error("Falta DATABASE_URL en .env");

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   datasource: {
//     url,
//   },
// });

import "dotenv/config";
import { defineConfig } from "prisma/config";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Falta DATABASE_URL en .env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url,
  },
});

// import "dotenv/config";
// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//     seed: "tsx prisma/seed.ts",
//   },
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });