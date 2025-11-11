
---

# 🚀 API Best Practices & Architectural Guidelines

This document provides essential guidelines for designing, developing, and maintaining APIs within our Express feature-based template. Adhering to these rules ensures maintainability, predictability, and a high-quality learning experience.

---

## 1. RESTful URL Design & Structure 🗺️

We enforce standard RESTful principles, using resource nouns, standard HTTP methods, and shallow URL structures.

### A. URL Pattern Constraint: Maximum Two Path Variables

To prevent deep, complex URLs, endpoints must not contain more than two path parameters (`:id`, `:slug`). Use query parameters for deeper context if necessary.

| HTTP Method | Allowed Pattern | Data Example | Purpose |
| :--- | :--- | :--- | :--- |
| **GET** | `/v1/{resource}` | `/v1/users` | List all resources (e.g., all users). |
| **POST** | `/v1/{resource}` | `/v1/users` | Create a new resource. |
| **GET** | `/v1/{resource}/:{id}` | `/v1/posts/456` | Retrieve a single resource. |
| **PUT/PATCH** | `/v1/{resource}/:{id}` | `/v1/posts/456` | Update a single resource. |
| **DELETE** | `/v1/{resource}/:{id}` | `/v1/posts/456` | Delete a single resource. |
| **GET** | `/v1/{parent}/:{pId}/{child}` | `/v1/users/123/posts` | List child resources (posts) for a parent (user 123). |
| **GET** | `/v1/{parent}/:{pId}/{child}/:{cId}` | `/v1/users/123/posts/456` | Retrieve a specific child resource. |

### B. Standard Query Parameters

Use query parameters for optional actions like filtering, sorting, and pagination.

* **Pagination:** `/v1/products?limit=25&offset=50`
* **Filtering:** `/v1/products?category=electronics&price_lt=500`
* **Sorting:** `/v1/products?sort=price:desc`

---

## 2. Feature-Based Architecture: Separation of Concerns (SoC) 🏗️

The `src/features/<feature-name>` structure enforces clear boundaries for maximum maintainability.

| Component File | Responsibility | Rule & Primary Concern |
| :--- | :--- | :--- |
| `*.routes.ts` | **Route Definition** | Maps URLs and HTTP methods to Controllers. |
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

| Error Source | Example Custom Error | HTTP Status Code | Example Response Body |
| :--- | :--- | :--- | :--- |
| **Input Validation** (`*.validation.ts` middleware) | `ZodError` | **400 Bad Request** | `{"status": 400, "message": "Validation failed", "error_code": "INVALID_INPUT", "details": [{"field": "title", "issue": "Too short"}]}` |
| **Service/Repo Logic** (Resource not found) | `NotFoundError` | **404 Not Found** | `{"status": 404, "message": "Post with ID 456 not found", "error_code": "POST_NOT_FOUND"}` |
| **Service Logic** (Forbidden action) | `ForbiddenError` | **403 Forbidden** | `{"status": 403, "message": "You lack permission to modify this post", "error_code": "ACCESS_DENIED"}` |
| **Unexpected** (DB connection loss, unhandled crash) | Generic Error | **500 Internal Server Error** | `{"status": 500, "message": "An unexpected internal error occurred."}` |

---

## 4. Security & General Best Practices 🔒

### A. Authentication & Transport

* **HTTPS/TLS:** Mandatory for all API communication to ensure data encryption.
* **Stateless Auth:** Use token-based authentication (e.g., JWT) passed in the `Authorization: Bearer <token>` header. **Never use session cookies.**

### B. Intentional Library Usage (`src/lib`)

The `src/lib` folder contains multiple utility implementations (e.g., `s3.ts`, `cloudinary.ts`).

* **Rule:** Only import and use the utility implementation necessary for the current project. Avoid importing unused files to keep the dependency graph clean.
* **Dependency Direction:** Files in `src/lib` **must not** import anything from `src/features`.

### C. Deployment & Migrations

* **Drizzle Migrations:** Do **not** delete or modify existing migration files. They represent the permanent history of the database schema. Always generate new files for schema changes.
* **PM2 Ecosystem:** The `_ecosystem.config.js` file is solely for production process management (PM2). Use the standard `npm run dev` script for all local development. Only rename the file for production deployment.