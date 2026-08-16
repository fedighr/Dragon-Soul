# Dragon Soul 🛍️

**A full-stack e-commerce platform with real-time inventory management**

Dragon Soul is a complete e-commerce web application built as a team project, covering both the customer-facing storefront and the admin management side. Development was split by feature between two developers, with each contributor working across both the frontend and backend rather than being siloed by layer.

## Key Features

**Customer-facing**
- User authentication (registration, login, logout, JWT-based sessions)
- Product catalog with color and size variants, and real-time stock tracking
- Dynamic product detail pages with variant selection
- Shopping cart and order management
- Product pagination for smooth browsing
- Notification system to keep users updated on orders
- Personal dashboard for order history and account management
- Modern, fashion-forward UI focused on a polished retail experience

**Admin**
- Dedicated admin dashboard for managing products, variants, and stock
- Order oversight and management
- User management tools

## Tech Stack

- **Frontend:** React (hooks-based architecture)
- **Backend:** Django REST Framework
- **Database:** PostgreSQL — relational data across products, variants, orders, and users
- **Authentication:** JWT (stateless, secure sessions)
- **API:** RESTful, with structured validation and error handling throughout the order flow

## Highlight: Real-Time Stock Management

One of the core technical challenges of this project was building a reliable stock management system:
- Validates product availability per color/size variant combination in real time
- Prevents overselling by keeping cart and inventory in sync across concurrent users
- Maintains a smooth, responsive user experience even under simultaneous stock updates

## My Contribution

I worked across the full stack, with a focus on backend architecture: designing the PostgreSQL data models for products, variants, and orders; building the REST API with Django REST Framework; implementing JWT authentication; and designing the real-time stock validation logic that prevents overselling. I also contributed to frontend features on the customer-facing side (product discovery through checkout).

---

*Built as a team project (2 developers), covering the complete customer and admin experience of an e-commerce platform.*
