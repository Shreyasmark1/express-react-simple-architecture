
---


# 🛠️ Express Feature-Based Architecture Guidelines


This documentation defines the specific rules and structure required for all development within this Express template. Adherence to these guidelines is mandatory for code reviews and deployment.

---

## 2. Feature-Based Architecture: Separation of Concerns (SoC) 🏗️

The `src/app/<feature-name>` structure enforces clear boundaries for maximum maintainability.

| Component File | Responsibility | Rule & Primary Concern |
| :--- | :--- | :--- |
| `*.route.ts` | **Route Definition** | Maps URLs and HTTP methods to Controllers. |
| `*.controller.ts` | **I/O Handling** | Handles request parsing, calls the Service, and sends the final HTTP response (e.g., status codes). **No business logic here.** |
| `*.service.ts` | **Business Logic & Transactions** | Contains all core logic (calculations, complex checks) and orchestrates **database transactions**. Calls the Repository. |
| `*.repository.ts` | **Database Access** | Direct interaction with the ORM/database. Should only focus on data retrieval/storage. |
| `*.validation.ts` | **Input Validation** | Defines schemas (Zod/Joi) for all request bodies and query parameters. |

---

## 3. Data Integrity & Error Flow 🛡️

The structure ensures robust error handling and consistent data state.

### A. Service Layer: The Transaction Manager

The **Service Layer** is the only place where complex business logic and **database transactions** are orchestrated.

| Scenario | Component Responsible | Action |
| :--- | :--- | :--- |
| **Two-step update** (e.g., creating a post and updating the user's post count). | `*.service.ts` | **Wrap in a single database transaction.** Ensure both steps succeed or both fail (Atomicity). |
| **Permission Check** (e.g., PUT request on a post). | `*.service.ts` | Before update, verify resource ownership (e.g., is `req.user.id` the `post.authorId`). Throw **ForbiddenError** if not. |

### B. Standard Error Propagation

Custom errors thrown at any layer are handled centrally to return consistent JSON responses.

Provide clear, helpful error responses in JSON format, especially for **4xx** codes.

  * Include a unique error code, a developer-friendly message, and optionally, a link to documentation.
  * *Example:*

```json
{
  "status": false,
  "httpStatus": 400,
  "code": "INVALID_FIELD",
  "message": "The 'email' field is required and cannot be empty.",
  "data": [
    {
      "field": "email",
      "detail": "Email is a required field."
    }
  ]
}
```

  * `For simplicity and rapid development use the following structure only`

```json
{
  "status": false,
  "message": "The 'email' field is required and cannot be empty.",
  "data": null
}
```

### C. Standard Error Handling

Use a consistent error handling pattern. Create custom error classes (e.g., `NotFoundError`, `UnauthorizedError`) and use a central Express error handler to map these classes to appropriate **HTTP Status Codes**.

```typescript
// Example: Custom Error Class
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

  * `For simplicity and rapid development use single global ApiError. If required more custom errors make them extend ApiError` 

```typescript
// Example: Custom Global Error Class
export class ApiError extends Error {

    readonly httpCode: number;

    constructor(message: string, httpCode: number) {
        super(message);

        this.httpCode = httpCode;

        this.name = this.constructor.name;
    }
}
```


| Error Source | Example Custom Error | HTTP Status Code | Example Response Body |
| --- | --- | --- | --- |
| **Input Validation** (`*.validation.ts` middleware) | `ApiError` | **400 Bad Request** | `{"status": false, "message":"Validation failed", "data": null}` |
| **Service/Repo Logic** (Resource not found) | `ApiError` | **404 Not Found** | `{"status": false, "message": "Post with ID 456 not found", "data": null}` |
| **Service Logic** (Forbidden action) | `ApiError` | **403 Forbidden** | `{"status": false, "message": "You lack permission to modify this post", "data": null}` |
| **Unexpected** (DB connection loss, unhandled crash) | `ApiError` Generic Error | **500 Internal Server Error** | `{"status": 500, "message": "An unexpected internal error occurred.", "data": null}` |

---



### B. Intentional Library Usage (`src/lib`)

The `src/lib` folder contains multiple utility implementations (e.g., `s3.ts`, `cloudinary.ts`).

* **Rule:** Only import and use the utility implementation necessary for the current project. Avoid importing unused files to keep the dependency graph clean.
* **Dependency Direction:** Files in `src/lib` **must not** import anything from `src/features`.

### C. Deployment & Migrations

* **Drizzle Migrations:** Do **not** delete or modify existing migration files. They represent the permanent history of the database schema. Always generate new files for schema changes.
* **PM2 Ecosystem:** The `_ecosystem.config.js` file is solely for production process management (PM2). Use the standard `npm run dev` script for all local development. Only rename the file for production deployment.