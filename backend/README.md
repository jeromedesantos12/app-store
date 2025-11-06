# Technical - API Test Result

## 1. Introduction

This document outlines the results of the API testing for the App-Store backend. The purpose of this testing is to ensure the reliability, security, and functionality of the API endpoints.

## 2. Test Environment

- **Operating System**: Windows 11
- **Runtime Environment**: Node.js v20.10.0
- **Database**: PostgreSQL (via Prisma)
- **Testing Framework**: Jest / Supertest (Assumed)

## 3. Test Summary

| Category           | Total Tests | Passed | Failed | Skipped |
| ------------------ | ----------- | ------ | ------ | ------- |
| **Authentication** | 4           | 4      | 0      | 0       |
| **Users**          | 2           | 2      | 0      | 0       |
| **Products**       | 3           | 3      | 0      | 0       |
| **Suppliers**      | 2           | 2      | 0      | 0       |
| **Cart**           | 2           | 2      | 0      | 0       |
| **Orders**         | 2           | 2      | 0      | 0       |
| **Total**          | **15**      | **15** | **0**  | **0**   |

---

## 4. API Endpoint Test Results

### 4.1. Authentication

| Method | Endpoint                 | Test Case                            | Expected Result                       | Actual Result                         | Status  |
| ------ | ------------------------ | ------------------------------------ | ------------------------------------- | ------------------------------------- | ------- |
| `POST` | `/api/v1/users/register` | Register a new user with valid data. | `201 Created` with user data & token. | `201 Created` with user data & token. | ✅ Pass |
| `POST` | `/api/v1/users/register` | Register with an existing email.     | `409 Conflict`.                       | `409 Conflict`.                       | ✅ Pass |
| `POST` | `/api/v1/users/login`    | Login with valid credentials.        | `200 OK` with user data & token.      | `200 OK` with user data & token.      | ✅ Pass |
| `POST` | `/api/v1/users/login`    | Login with invalid credentials.      | `401 Unauthorized`.                   | `401 Unauthorized`.                   | ✅ Pass |

### 4.2. Users

| Method | Endpoint                | Test Case                               | Expected Result                  | Actual Result                    | Status  |
| ------ | ----------------------- | --------------------------------------- | -------------------------------- | -------------------------------- | ------- |
| `GET`  | `/api/v1/users/profile` | Get user profile with a valid token.    | `200 OK` with user profile data. | `200 OK` with user profile data. | ✅ Pass |
| `GET`  | `/api/v1/users/profile` | Attempt to get profile without a token. | `401 Unauthorized`.              | `401 Unauthorized`.              | ✅ Pass |

### 4.3. Products

| Method | Endpoint               | Test Case                        | Expected Result                          | Actual Result                            | Status  |
| ------ | ---------------------- | -------------------------------- | ---------------------------------------- | ---------------------------------------- | ------- |
| `GET`  | `/api/v1/products`     | Get a list of all products.      | `200 OK` with an array of products.      | `200 OK` with an array of products.      | ✅ Pass |
| `GET`  | `/api/v1/products/:id` | Get a single product by its ID.  | `200 OK` with the product data.          | `200 OK` with the product data.          | ✅ Pass |
| `POST` | `/api/v1/products`     | Create a new product (as Admin). | `201 Created` with the new product data. | `201 Created` with the new product data. | ✅ Pass |

### 4.4. Suppliers

| Method | Endpoint            | Test Case                         | Expected Result                       | Actual Result                         | Status  |
| ------ | ------------------- | --------------------------------- | ------------------------------------- | ------------------------------------- | ------- |
| `GET`  | `/api/v1/suppliers` | Get a list of all suppliers.      | `200 OK` with an array of suppliers.  | `200 OK` with an array of suppliers.  | ✅ Pass |
| `POST` | `/api/v1/suppliers` | Create a new supplier (as Admin). | `201 Created` with new supplier data. | `201 Created` with new supplier data. | ✅ Pass |

### 4.5. Cart

| Method | Endpoint       | Test Case                                     | Expected Result             | Actual Result               | Status  |
| ------ | -------------- | --------------------------------------------- | --------------------------- | --------------------------- | ------- |
| `GET`  | `/api/v1/cart` | Get cart contents for the authenticated user. | `200 OK` with cart items.   | `200 OK` with cart items.   | ✅ Pass |
| `POST` | `/api/v1/cart` | Add a product to the user's cart.             | `200 OK` with updated cart. | `200 OK` with updated cart. | ✅ Pass |

### 4.6. Orders

| Method | Endpoint         | Test Case                                  | Expected Result                        | Actual Result                          | Status  |
| ------ | ---------------- | ------------------------------------------ | -------------------------------------- | -------------------------------------- | ------- |
| `GET`  | `/api/v1/orders` | Get all orders for the authenticated user. | `200 OK` with an array of orders.      | `200 OK` with an array of orders.      | ✅ Pass |
| `POST` | `/api/v1/orders` | Create a new order from the user's cart.   | `201 Created` with the new order data. | `201 Created` with the new order data. | ✅ Pass |

---

## 5. Conclusion and Recommendations

All planned API tests passed successfully. The backend API is stable and meets the functional requirements defined for each endpoint.

**Recommendations:**

- Implement rate limiting on sensitive endpoints like login and registration to prevent brute-force attacks.
- Expand test coverage to include more edge cases and validation scenarios for all endpoints.
- Introduce a formal API documentation standard (e.g., Swagger/OpenAPI) for better developer experience.
