# App Store

This is a full-stack web application for an online store. It includes a customer-facing frontend for browsing products and making purchases, and a backend for managing products, users, and orders.

## Project Structure

The project is a monorepo with two main directories:

-   `frontend/`: A React application for the client-side.
-   `backend/`: An Express.js server for the backend API.

```
app-store/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    ├── .env
    └── package.json
```

## Features

-   **User Authentication**: User registration and login with JWT.
-   **Product Management**: CRUD operations for products.
-   **Supplier Management**: CRUD operations for suppliers.
-   **Shopping Cart**: Add, update, and remove items from the cart.
-   **Order Management**: Create, view, and manage orders.
-   **Role-based Access Control**: Distinction between `admin` and `customer` roles.
-   **File Uploads**: For user profiles and product images.

## Tech Stack

### Backend

-   **Runtime**: Node.js with Bun
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Authentication**: JWT
-   **Validation**: Joi
-   **Testing**: Jest

### Frontend

-   **Framework**: React
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Routing**: React Router
-   **State Management**: React Context
-   **Form Handling**: React Hook Form
-   **Schema Validation**: Zod

## Prerequisites

-   Node.js
-   Bun
-   PostgreSQL

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd app-store
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    bun install
    cp .env.example .env
    # Update .env with your database credentials
    bunx prisma migrate dev
    bun run dev
    ```

3.  **Frontend Setup:**

    ```bash
    cd frontend
    bun install
    cp .env.example .env
    # Update .env with your backend API URL
    bun run dev
    ```

## API Endpoints

### User

-   `POST /login`: Login a user.
-   `POST /logout`: Logout a user.
-   `POST /register`: Register a new user.
-   `GET /verify`: Verify user token.
-   `GET /user`: Get all users (admin only).
-   `GET /userAll`: Get all users including deleted (admin only).
-   `GET /user/me`: Get current user's profile.
-   `PUT /user/me`: Update current user's profile.
-   `PATCH /user/:id/restore`: Restore a deleted user (admin only).
-   `DELETE /user/:id`: Delete a user.

### Product

-   `GET /product`: Get all products.
-   `GET /productAll`: Get all products including deleted.
-   `GET /product/:id`: Get a single product.
-   `POST /product`: Create a new product (admin only).
-   `PUT /product/:id`: Update a product (admin only).
-   `PATCH /product/:id/restore`: Restore a deleted product (admin only).
-   `DELETE /product/:id`: Delete a product (admin only).

### Supplier

-   `GET /supplier`: Get all suppliers.
-   `GET /supplierAll`: Get all suppliers including deleted.
-   `GET /supplier/:id`: Get a single supplier.
-   `POST /supplier`: Create a new supplier (admin only).
-   `PUT /supplier/:id`: Update a supplier (admin only).
-   `PATCH /supplier/:id/restore`: Restore a deleted supplier (admin only).
-   `DELETE /supplier/:id`: Delete a supplier (admin only).

### Cart

-   `GET /cart/me`: Get the current user's cart.
-   `POST /cart`: Add an item to the cart.
-   `PUT /cart/:id`: Update an item in the cart.
-   `DELETE /cart/:id`: Remove an item from the cart.

### Order

-   `GET /order/all`: Get all orders (admin only).
-   `GET /order/me`: Get the current user's orders.
-   `GET /order/:id`: Get a single order.
-   `POST /order`: Create a new order.
-   `PATCH /order/:id/status`: Update the status of an order (admin only).
-   `DELETE /order/:id/status`: Cancel an order.

## Environment Variables

### Backend (`backend/.env`)

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-jwt-secret"
```

### Frontend (`frontend/.env`)

```
VITE_API_URL="http://localhost:3000"
```
