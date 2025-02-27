# EasyOrder

EasyOrder is an online marketplace that allows customers to browse products, add items to their cart, and place orders. The application is built with a **Flask API backend** and a **React frontend**.

## Features

- **User Authentication**: Customers can sign up, log in, and manage their accounts.
- **Product Browsing**: All users can view available products.
- **Cart System**: Logged-in customers can add items to their cart and modify order quantities.
- **Order Management**: Customers can place, edit, and view their past orders.
- **Secure Transactions**: Orders are linked to authenticated users, ensuring privacy.

## Tech Stack

### Backend:
- **Flask** (REST API)
- **SQLAlchemy** (ORM for database management)
- **Flask-Session** (User authentication)
- **Marshmallow** (Data serialization & validation)

### Frontend:
- **React** (UI framework)
- **React Router** (Navigation)
- **Formik & Yup** (Form validation)

### Database:
- **SQLite** (Development)
- **PostgreSQL** (Production)

## Installation

### Prerequisites
- Python 3.8+
- Node.js & npm
- PostgreSQL (for production)

### Backend Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/layalEsna/sitter_app.git
   cd sitter_app/server
Create a virtual environment (optional but recommended):

sh
Copy code
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:

sh
Copy code
pip install -r requirements.txt
Set up the database:

sh
Copy code
flask db upgrade
python seed.py  # Seed initial data
Run the Flask server:

sh
Copy code
flask run
Frontend Setup
Navigate to the frontend directory:

sh
Copy code
cd ../client
Install dependencies:

sh
Copy code
npm install
Start the React development server:

sh
Copy code
npm start
API Endpoints
Authentication
POST /signup – Register a new user
POST /login – Log in an existing user
POST /logout – Log out a user
Products
GET /products – Retrieve all available products
Orders
GET /orders – Retrieve customer’s orders
POST /orders – Create a new order
PATCH /orders/<order_id> – Update an existing order
DELETE /orders/<order_id> – Remove an order
Project Requirements & Implementation
✅ Flask API backend with React frontend
✅ Three models: Customer, Order, and Item
✅ One-to-many relationships:
Customer ↔ Orders (one customer can have many orders)
Item ↔ Orders (one item can appear in multiple orders)
✅ Many-to-many relationship:
Implemented through an association table where customers can order multiple items.
✅ Full CRUD for Order resource
✅ Forms and validation using Formik & Yup
✅ At least one data type validation
✅ At least one string/number format validation
✅ Three different client-side routes using React Router
✅ Fetch API for backend communication
Contributing
Fork the repository
Create a new branch:
sh
Copy code
git checkout -b feature-branch
Make changes and commit:
sh
Copy code
git commit -m "Added new feature"
Push to the branch:
sh
Copy code
git push origin feature-branch
Create a Pull Request
License
This project is licensed under the MIT License.

Developed with ❤️ by Amene Esnaashari.

yaml
Copy code

---

### **Why is this version better?**
✅ **Corrected formatting** for installation steps and API endpoints  
✅ **Fixed command-line sections** for clarity  
✅ **Improved readability** for project requirements  
