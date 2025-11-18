-----

# 🛠️ Express Feature-Based API Best Practices

This documentation provides guidelines for developing API features within this Express template. Our focus is on maintainable RESTful design, proper use of the feature architecture, and intentional library usage.

-----

## 1\. RESTful Design & URL Structure

We adhere to strict RESTful principles to ensure endpoints are predictable and easy to use.

### A. Path Variable Constraint (Maximum Two)

To prevent deep, hard-to-read URLs, limit path parameters (`:id`, `:slug`) to a maximum of **two** per route. If you need to access a resource that is nested deeper, use query parameters or ensure the parent resource ID is available in the request context (e.g., from an authenticated user).

| Pattern | Status | Example |
| :--- | :--- | :--- |
| **`GET /resources`** | ✅ Good | `/api/v1/users` (List all users) |
| **`GET /resources/:id`** | ✅ Good | `/api/v1/users/123` (Get a specific user) |
| **`GET /resources/:parentId/childResources`** | ✅ Good | `/api/v1/users/123/posts` (List posts for user 123) |
| **`GET /resources/:parentId/childResources/:id`** | ✅ Good | `/api/v1/users/123/posts/456` (Get post 456 by user 123) |
| **`GET /a/:aId/b/:bId/c/:cId`** | ❌ **Bad** | Too deep. Rethink the relationship. |

### B. Route Definition Example (Feature: `posts`)

All feature routes should be defined within the feature's directory (`src/features/posts/posts.routes.ts`).

```typescript
// src/features/posts/posts.routes.ts

import { Router } from 'express';
import * as postController from './posts.controller';
import { validate } from '../../middlewares/validator.middleware';
import { createPostSchema } from './posts.validation';
import { authenticate } from '../../middlewares/auth.middleware'; // Assuming Auth Middleware exists

const router = Router();

// Route for listing and creating posts
router.route('/')
  .get(postController.getAllPosts) // GET /api/v1/posts
  .post(authenticate, validate(createPostSchema), postController.createPost); // POST /api/v1/posts

// Route for a single post (Max 1 path variable)
router.route('/:postId')
  .get(postController.getPostById) // GET /api/v1/posts/123
  .put(authenticate, postController.updatePost) // PUT /api/v1/posts/123
  .delete(authenticate, postController.deletePost); // DELETE /api/v1/posts/123

export default router;
```

-----

## 2\. Feature-Based Architecture Focus

This template uses a feature-based architecture (`src/features/<feature-name>`).

### A. Separation of Concerns (SoC)

Every feature should contain:

1.  **`*.routes.ts`**: Express routes definition.
2.  **`*.controller.ts`**: Handles request/response, validation errors, and calls the service layer. **No business logic or database access here.**
3.  **`*.service.ts`**: Contains all business logic (calculations, complex checks, transactions) and calls the data/repository layer.
4.  **`*.repository.ts`**: Contains direct database interactions (Drizzle ORM calls).
5.  **`*.validation.ts`**: Schema definitions for input validation (e.g., using **Zod** or similar library).

### B. Controller Example

The controller is lean and focuses on I/O.

```typescript
// src/features/posts/posts.controller.ts

import { Request, Response, NextFunction } from 'express';
import * as postService from './posts.service';

/**
 * Handles creation of a new post.
 * POST /api/v1/posts
 */
export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    // Assuming req.user is set by the authentication middleware
    const userId = req.user?.id;
    const postData = req.body;

    const newPost = await postService.createNewPost(userId, postData);

    // Use 201 Created for new resource creation
    res.status(201).json({ 
      success: true, 
      data: newPost 
    });
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
}
```

-----

## 3\. Intentional Library Usage (`src/lib`)

The `src/lib` folder contains external utility implementations. Only import the module you intend to use for the current project to avoid unnecessary dependencies and confusion.

### A. File Storage Example

If the current project only uses **Amazon S3** for file storage, only import and use the S3 implementation from the `src/lib` folder.

| Implementation | Use Status | Import Path (If Used) |
| :--- | :--- | :--- |
| `cloudinary.ts` | ❌ Ignore | |
| `s3.ts` | ✅ **Use** | `import { uploadFileToS3 } from '../../lib/s3';` |
| `local.ts` | ❌ Ignore | |

### B. Drizzle Migrations

**DO NOT** delete any files within the Drizzle `drizzle/migrations` directory. These files represent the history of the database schema and are essential for production deployment and collaboration.

-----

## 4\. Other Suggestions & Best Practices

### A. Environment Management (`_ecosystem.config.js`)

The `_ecosystem.config.js` file for **PM2** should be used **only** when preparing the project for production deployment where process management (like automatic restart and clustering) is required.

  * **For Development:** Use the standard `npm run dev` script (usually powered by `ts-node` or `nodemon`).
  * **For Deployment:** Rename the file to `ecosystem.config.js` and use PM2 to start the application (e.g., `pm2 start ecosystem.config.js`).

### B. Zod/Joi for Validation

Use a modern schema validation library (like **Zod** or **Joi**) within a dedicated validation middleware to ensure data correctness before it hits the business logic.

**Example Zod Schema (`posts.validation.ts`):**

```typescript
// src/features/posts/posts.validation.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long.'),
    content: z.string().min(20, 'Content must be at least 20 characters long.'),
    tags: z.array(z.string()).optional(),
  }),
});

// The 'validate' middleware would call schema.parse(req)
```
