import { config } from 'dotenv';
const env = process.env.NODE_ENV;
if (!env) process.exit(100);
config({ path: `bin/.env.${env}` });

export const APP_CONFIG = {
  userName: process.env.USER_NAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  localhostPort: process.env.LOCALHOST_PORT,
  postgres: process.env.POSTGRES,
  secret: process.env.JWT_SECRET,
  expires: process.env.JWT_EXPIRATION,
  auth0_domain: process.env.AUTH0_DOMAIN,
  auth0_client_id: process.env.AUTH0_CLIENT_ID,
  auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
  api_url: process.env.API_URL,
  auth0_callback_url: process.env.AUTH0_CALLBACK_URL,
  management_api_token: process.env.MANAGEMENT_API_TOKEN,
  http_port: process.env.HTTP_PORT,
};
