// Centralized constants so every file (controllers + middleware) signs/verifies
// JWTs with the exact same secret. Previously the auth controller and the auth
// middleware read the secret differently, which broke login when JWT_SECRET
// wasn't set in .env. Fixed here by sharing one source of truth.
const JWT_SECRET = process.env.JWT_SECRET || "nexhire_jwt_secret_2026";

module.exports = { JWT_SECRET };
