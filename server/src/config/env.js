import "dotenv/config";

const env = {
  server: {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },

  client: {
    url: process.env.CLIENT_URL || "http://localhost:5173",
  },

  db: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME || "",
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    port: process.env.DATABASE_PORT || 3306,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};

// Validate all critical variables on startup
const required = {
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

Object.entries(required).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
});

console.log(`Environment loaded — mode: ${env.server.nodeEnv}`);

export default env;
