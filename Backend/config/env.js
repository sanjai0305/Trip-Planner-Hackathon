import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the backend root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("ENV FILE LOADED:", !!process.env.MONGO_URI);
console.log("MONGO URI PREFIX:", process.env.MONGO_URI?.substring(0, 25));
