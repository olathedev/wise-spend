# Authentication API Endpoints

## Overview
The authentication system uses Google Sign-In (via NextAuth on frontend) and generates JWT tokens for backend API access.

## Endpoints

### 1. Authenticate with Google
**Endpoint:** `POST /api/auth/google`

**Description:** Verifies Google ID token from NextAuth, creates/updates user in database, and returns JWT token.

**Request Body:**
```json
{
  "idToken": "google_id_token_from_nextauth"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "picture": "https://..."
    },
    "token": "jwt_token_here"
  }
}
```

**Error Response (400/401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid Google token"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your_google_id_token_here"
  }'
```

---

### 2. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Description:** Refreshes an existing JWT token.

**Request Body:**
```json
{
  "token": "existing_jwt_token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_jwt_token_here"
  }'
```

---

## Using JWT Token

After receiving the JWT token from `/api/auth/google`, include it in subsequent API requests:

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```bash
curl -X GET http://localhost:8000/api/protected-route \
  -H "Authorization: Bearer your_jwt_token_here"
```

---

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
MONGODB_URI=your_mongodb_connection_string
```

---

## Frontend Integration Flow

1. User signs in with Google via NextAuth on frontend
2. Frontend gets Google ID token from NextAuth session
3. Frontend sends POST to `/api/auth/google` with the ID token
4. Backend verifies token, creates/updates user, returns JWT
5. Frontend stores JWT and uses it in `Authorization: Bearer <token>` header for all API calls

---

## Protected Routes

To protect a route, use the `authMiddleware`:

```typescript
import { authMiddleware } from '@presentation/middleware/authMiddleware';
import { AuthRequest } from '@presentation/middleware/authMiddleware';

router.get('/protected', authMiddleware, (req: AuthRequest, res) => {
  // req.user.userId and req.user.email are available
  res.json({ userId: req.user?.userId });
});
```
