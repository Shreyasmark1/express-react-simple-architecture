
---


# 🚀 API Best Practices


This document provides essential guidelines for designing, developing, and maintaining APIs. Adhering to these rules ensures maintainability, predictability, and a high-quality learning experience.

---

## 1. RESTful URL Design & Structure 🗺️

We enforce strict RESTful principles, using resource nouns, standard HTTP methods, and shallow URL structures.

### A. URL Pattern Constraint: Maximum Two Path Variables

| Component | Principle | Actionable Rule |
| :--- | :--- | :--- 
| **URIs** | Use Nouns, Not Verbs | URIs must represent resources (e.g., /users), not actions (e.g., /getAllUsers).
| **HTTP Methods** | Standard Mapping (Verbs) | Map CRUD operations directly to standard methods.
| **Structure** | Keep URIs Simple | Use lowercase letters and hyphens (-). Avoid excessive nesting.


### Versioning

Version your API to allow for non-breaking changes and seamless migration.

* **Use URI Versioning (Recommended):** The most common and clearest method.
      * *Example:* `/v1/users`, `/v2/products`.
* **Avoid Header Versioning:** While cleaner, it makes testing and casual browsing harder.
* **Increment Slowly:** Only introduce a new major version when introducing **breaking changes**.



| HTTP Method | Allowed Pattern | Data Example | Purpose |
| :--- | :--- | :--- | :--- |
| **GET** | `/v1/{resource}` | `/v1/users` | List all resources (e.g., all users). |
| **POST** | `/v1/{resource}` | `/v1/users` | Create a new resource. |
| **GET** | `/v1/{resource}/:{id}` | `/v1/posts/456` | Retrieve a single resource. |
| **PUT/PATCH** | `/v1/{resource}/:{id}` | `/v1/posts/456` | Update a single resource. |
| **DELETE** | `/v1/{resource}/:{id}` | `/v1/posts/456` | Delete a single resource. |
| **GET** | `/v1/{parent}/:{pId}/{child}` | `/v1/users/123/posts` | List child resources (posts) for a parent (user 123). |
| **GET** | `/v1/{parent}/:{pId}/{child}/:{cId}` | `/v1/users/123/posts/456` | Retrieve a specific child resource. |

To prevent deep, complex URLs, endpoints must not contain more than two path parameters (`:id`, `:slug`). Use query parameters for deeper context if necessary.


| Pattern | Not Allowed Patter | Description | Better
| :--- | :--- | :--- | :---
| **GET** `/v1/localities/:{lId}/companies/:{cId}/departments/:{dId}/employees` | ❌ **Bad** | Too deep. Rethink the relationship. | **GET** `/v1/companies/:{cId}/employees?department=finance`
| **GET** `/v1/a/:aId/b/:bId/c/:cId` | ❌ **Bad** | Too deep. Rethink the relationship. | **GET** `/v1/a/b/c/:cId`

## 2. Request & Response Handling

### Data Formats

  * **JSON is King:** Use **JSON** (`application/json`) for request and response bodies. It is universally understood and lightweight.
  * **Consistent Formatting:** Use **camelCase** for JSON object keys.

### Filtering, Sorting, and Pagination

APIs should allow consumers to efficiently retrieve data collections.

  * **Filtering:** Use query parameters for filtering data.
      * *Example:* `/products?category=electronics&price_lt=500`
      * *Example:* `/products?category=electronics,laptops,smartphones`
  * **Sorting:** Use a dedicated `sort` query parameter, often with a direction indicator.
      * *Example:* `/users?sort=name:asc` or `/users?sort=-name`
  * **Pagination:** Implement **limit/offset** or **cursor-based** pagination to prevent large payloads.
      * *Example (Limit/Page):* `/products?recLimit=25&pageNumber=2`
      * *Example (Limit/Offset):* `/products?limit=25&offset=50`

---

## 3. Security & General Best Practices 🔒

### A. Authentication & Authorization

  * **Use HTTPS/TLS:** **All** API communication must use **HTTPS** to ensure data is encrypted in transit.
  * **Stateless Authentication:** Use **Token-Based Authentication** (e.g., OAuth 2.0, JWT) instead of session cookies. The server should not need to store session state.
  * **Store Tokens Securely:** Tokens should be sent in the **`Authorization` header** using the `Bearer` scheme or Http-Only cookies **Never store tokens in session cookies without Http-Only flag**.

### B. Rate Limiting

Implement **Rate Limiting** to protect against abuse and resource exhaustion (DoS attacks).

  * Include rate-limit headers in responses (e.g., `X-RateLimit-Limit`, `X-RateLimit-Remaining`).
  * Return a **`429 Too Many Requests`** status code when a client exceeds the limit.


### C. Input Validation

  * **Never trust client input.**
  * Always perform strict server-side validation on all incoming data to prevent injection attacks and ensure data integrity.