export const config = {
  isDev: ["dev", "development"].includes(process.env.NODE_ENV),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    database: process.env.DB_NAME || "test"
  }
}
