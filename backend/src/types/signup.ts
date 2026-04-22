/**
 * Signup Types & Interfaces
 *
 * These TypeScript interfaces define the shape of data used in the signup process.
 * Think of them as "contracts" - they promise what data will look like.
 *
 * Why use types?
 * - Catch errors before your code runs (TypeScript compiler checks them)
 * - IDE gives you autocomplete when using these types
 * - Self-documenting code - you know exactly what fields exist
 */

/**
 * SignupInput - The data a user sends when signing up
 *
 * This is what comes from the frontend in the request body.
 * All fields are strings because that's what HTTP sends.
 */
export interface SignupInput {
  username: string; // The user's unique login name
  password: string; // The user's password (plain text from form)
  gender: "Male" | "Female" | "Non-Binary" | "Others"; // User's gender (enum)
}

/**
 * SignupOutput - The safe data we return after successful signup
 *
 * Notice: NO PASSWORD!
 * We never send passwords back to the frontend.
 * This is a security best practice.
 *
 * This is the response body the frontend receives.
 */
export interface SignupOutput {
  id: string; // Unique user ID (UUID)
  username: string; // The username they chose
  gender: "Male" | "Female" | "Non-Binary" | "Others"; // Their gender
  channelName: string; // Their channel name (defaults to username)
  message?: string; // Optional success message
}

/**
 * SignupError - Represents different types of signup failures
 *
 * Instead of generic errors, we define specific error types.
 * This makes it easy to handle each error type differently.
 *
 * Example:
 *   throw new SignupError('DUPLICATE_USER', 'Username already exists')
 */
export class SignupError extends Error {
  // The error type - helps us decide HTTP status code
  constructor(
    public code: "VALIDATION_ERROR" | "DUPLICATE_USER" | "SERVER_ERROR",
    public override message: string,
    public details?: any,
  ) {
    super(message);
    this.name = "SignupError";
  }
}

/**
 * Error Status Map - Maps our custom errors to HTTP status codes
 *
 * This is used by the route handler to know which HTTP status to send.
 *
 * For example:
 *   if (error.code === 'DUPLICATE_USER') → send 409 Conflict
 *   if (error.code === 'VALIDATION_ERROR') → send 400 Bad Request
 */
export const ERROR_STATUS_MAP: Record<string, number> = {
  VALIDATION_ERROR: 400, // Bad Request - client sent bad data
  DUPLICATE_USER: 409, // Conflict - user already exists
  SERVER_ERROR: 500, // Internal Server Error - something went wrong
};
