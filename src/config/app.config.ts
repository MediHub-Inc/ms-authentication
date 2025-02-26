import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT as string, 10) || 5000,
  nodenv: process.env.NODE_ENV,
}));
