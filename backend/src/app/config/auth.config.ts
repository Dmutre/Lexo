export default () => ({
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtRefreshTTL: process.env.JWT_REFRESH_TTL || '7d',
  jwtAccessTTL: process.env.JWT_ACCESS_TTL || '15m',
});
