/**
 * User Service - Business Logic for User Operations
 *
 * A "service" is a module that contains business logic.
 * It's separate from HTTP routes, so it can be tested independently
 * and reused in different contexts (API, CLI, webhooks, etc).
 *
 * This service handles user signup with all the complex logic:
 * - Validating input
 * - Checking for duplicates
 * - Hashing passwords
 * - Creating database records
 */

import bcrypt from "bcrypt";
import * as z from "zod";
import { prisma } from "../../db";
import type { SignupInput, SignupOutput } from "../types/signup";
import { SignupError } from "../types/signup";

/**
 * PASSWORD HASHING EXPLAINED
 *
 * Why hash passwords?
 * - If your database is hacked, attackers get hashed passwords, not plain passwords
 * - Hashing is ONE-WAY: you can't unhash it back to the original password
 * - Instead, we hash the password they give us and compare the hashes
 *
 * Bcrypt rounds (10):
 * - Higher number = more secure but slower
 * - 10 is a good balance between security and speed
 * - Each signup takes ~100ms with rounds: 10
 */
const BCRYPT_ROUNDS = 10;

/**
 * Zod Validation Schema for Signup Input
 *
 * Zod validates data at the boundary (when it enters our system).
 * This prevents invalid data from reaching our business logic.
 *
 * What we're validating:
 * - username: required string, at least 3 characters
 * - password: required string, at least 6 characters
 * - gender: must be one of the allowed values
 */
const SignupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),

  gender: z
    .enum(["Male", "Female", "Non-Binary", "Others"])
    .transform((value) => (value === "Non-Binary" ? "Non_Binary" : value)),
});

/**
 * handleUserSignup - The main signup function
 *
 * @param input - The signup data from the frontend (username, password, gender)
 * @returns SignupOutput - The user data (without password)
 * @throws SignupError - If validation fails, user exists, or database error
 *
 * WHAT THIS FUNCTION DOES:
 * 1. Validate the input (Zod)
 * 2. Check if username already exists
 * 3. Hash the password (bcrypt)
 * 4. Create the user in database (Prisma)
 * 5. Return user data (without password)
 *
 * FLOW DIAGRAM:
 * Input → Validate → Check Duplicate → Hash Password → Create in DB → Return Output
 */
export async function handleUserSignup(input: unknown): Promise<SignupOutput> {
  try {
    // STEP 1: VALIDATE INPUT
    // Zod checks if the input matches our schema
    // If not, it throws a ZodError with details
    let validatedData: z.infer<typeof SignupSchema>;

    try {
      validatedData = SignupSchema.parse(input);
    } catch (zodError: any) {
      // Zod validation failed - convert to our custom error
      throw new SignupError(
        "VALIDATION_ERROR",
        "Invalid signup data",
        zodError.errors,
      );
    }

    const { username, password, gender } = validatedData;

    // STEP 2: CHECK FOR DUPLICATE USERNAME
    // Query the database for a user with this username
    // If found, the user already exists and we should reject the signup
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      // User already exists - throw custom error
      throw new SignupError(
        "DUPLICATE_USER",
        `Username "${username}" is already taken`,
      );
    }

    // STEP 3: HASH THE PASSWORD
    // Bcrypt takes the plain password and hashes it
    // Hash is deterministic (same password → same hash)
    // But irreversible (can't unhash it)
    //
    // This is SLOW (10 rounds = ~100ms) - that's on purpose!
    // It makes brute-force attacks harder
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // STEP 4: CREATE USER IN DATABASE
    // Prisma creates a new user record
    // channelName defaults to username (can be changed later by user)
    // subscriberCount defaults to 0 (from schema)
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword, // Store hashed password, NOT plain text
        gender,
        channelName: username, // Default channel name is the username
        // Other fields (banner, profilePicture, etc) are optional and default to null
      },
    });

    // STEP 5: RETURN USER DATA (WITHOUT PASSWORD)
    // Create the response object
    // Note: We don't include the password!
    const response: SignupOutput = {
      id: newUser.id,
      username: newUser.username,
      gender: newUser.gender as "Male" | "Female" | "Non-Binary" | "Others",
      channelName: newUser.channelName,
      message: "User created successfully",
    };

    return response;
  } catch (error) {
    // If it's already our custom SignupError, just re-throw it
    if (error instanceof SignupError) {
      throw error;
    }

    // If it's any other error (database error, bcrypt error, etc)
    // Convert it to our custom error format
    console.error("Signup error:", error);
    throw new SignupError(
      "SERVER_ERROR",
      "An error occurred during signup. Please try again.",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

/**
 * BEST PRACTICES DEMONSTRATED HERE:
 *
 * 1. SEPARATION OF CONCERNS
 *    - This function only handles signup logic
 *    - It doesn't know about HTTP, Express, or routing
 *    - Makes it reusable and testable
 *
 * 2. INPUT VALIDATION AT THE BOUNDARY
 *    - Zod validates as soon as data enters the system
 *    - Rest of function can trust data is valid
 *
 * 3. SPECIFIC ERROR HANDLING
 *    - Different error types for different problems
 *    - Makes error messages helpful to users
 *
 * 4. NEVER EXPOSE SECRETS
 *    - Password never returned in response
 *    - Even internally, we use hashed password
 *
 * 5. CLEAR COMMENTS
 *    - Comments explain "why", not "what"
 *    - Code is readable without comments
 *
 * 6. PROPER ASYNC/AWAIT
 *    - Database calls are properly awaited
 *    - Errors bubble up naturally
 *
 * 7. BCRYPT BEST PRACTICE
 *    - Using hash(), not comparing plain passwords
 *    - Proper salt rounds (10)
 */
