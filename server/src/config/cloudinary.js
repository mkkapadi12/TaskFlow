import cloudinary from "cloudinary";
import env from "./env.js";

cloudinary.v2.config({
  cloud_name: env.cloudinary.cloud_name,
  api_key: env.cloudinary.api_key,
  api_secret: env.cloudinary.api_secret,
});

export default cloudinary;
