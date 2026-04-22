# Quick Reference: The Signup Architecture

## Files Overview

### 1. **Types File** (`backend/src/types/signup.ts`)
- **SignupInput**: What frontend sends
- **SignupOutput**: What we return (no password!)
- **SignupError**: Custom error with code + message
- **ERROR_STATUS_MAP**: Maps error codes to HTTP status

### 2. **Service File** (`backend/src/services/userService.ts`)
- **handleUserSignup()**: The main function
  - Takes: `SignupInput`
  - Returns: `SignupOutput`
  - Throws: `SignupError`
  
**What it does:**
1. Validate input with Zod
2. Check for duplicate username
3. Hash password with bcrypt
4. Create user in database
5. Return user (without password)

### 3. **Route Handler** (`backend/index.ts`)
- **POST /signup**: Calls `handleUserSignup()`
- Catches `SignupError` and sends appropriate HTTP status
- Returns proper JSON response

---

## The Data Flow

```
Frontend Request
    ↓
Express Route: app.post("/signup")
    ↓
Service: handleUserSignup(data)
    ├─ Zod: Validate
    ├─ Prisma: Check duplicate
    ├─ Bcrypt: Hash password
    ├─ Prisma: Create user
    └─ Return SignupOutput
    ↓
Route Handler catches response/error
    ↓
HTTP Response (201 or 4xx/5xx)
    ↓
Frontend receives JSON
```

---

## Error Handling Pattern

```typescript
// In service:
if (someError) {
  throw new SignupError("CODE", "message");
}

// In route handler:
try {
  await handleUserSignup(req.body);
} catch (error) {
  if (error instanceof SignupError) {
    const status = ERROR_STATUS_MAP[error.code];
    res.status(status).json({ error: error.message });
  }
}
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| **username** | 3-30 chars, alphanumeric + underscore |
| **password** | 6-100 chars |
| **gender** | Male, Female, Non-Binary, Others |

---

## Response Examples

### ✅ Success (201)
```json
{
  "id": "uuid-123",
  "username": "john",
  "gender": "Male",
  "channelName": "john",
  "message": "User created successfully"
}
```

### ❌ Validation Error (400)
```json
{
  "error": "Invalid signup data",
  "code": "VALIDATION_ERROR",
  "details": [...]
}
```

### ❌ Duplicate User (409)
```json
{
  "error": "Username \"john\" is already taken",
  "code": "DUPLICATE_USER"
}
```

### ❌ Server Error (500)
```json
{
  "error": "An error occurred during signup. Please try again.",
  "code": "SERVER_ERROR"
}
```

---

## Why This Design?

| Aspect | Benefit |
|--------|---------|
| **Service layer** | Reusable, testable, maintainable |
| **Custom errors** | Clear error handling |
| **Zod validation** | Type-safe at boundaries |
| **Bcrypt hashing** | Secure password storage |
| **TypeScript interfaces** | Prevent bugs early |
| **Comments** | Explain the "why" |

---

## Testing Checklist

- [ ] Successful signup returns 201 + user data (no password)
- [ ] Duplicate username returns 409
- [ ] Missing field returns 400
- [ ] Invalid gender returns 400
- [ ] Password is hashed (not plain text in DB)
- [ ] User appears in database
- [ ] Frontend can still receive response

---

## How to Extend

**Add email verification:**
1. Add `email` field to `SignupInput`
2. Add `emailVerified` to database schema
3. Generate verification token in service
4. Send email in service
5. Create `/verify-email` endpoint

**Add password strength:**
1. Add regex to Zod schema
2. Require uppercase, numbers, special chars

**Add username availability check:**
1. Create `GET /username/:username` endpoint
2. Return `{ available: boolean }`

---

## Common Patterns You've Learned

1. **Service Layer**: Business logic separate from HTTP
2. **Custom Errors**: Different error types → different HTTP status
3. **Type Safety**: TypeScript + Zod = no surprises
4. **Validation Boundary**: Validate input first
5. **Security**: Hash passwords, never expose secrets
6. **Error Handling**: Catch specific errors, handle them clearly

These patterns scale to building large applications! 🚀
