export default () => ({
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  host: process.env.DATABASE_HOST ?? 'localhost',
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});
