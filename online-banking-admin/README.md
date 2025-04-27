
# 🏦 Vardhan Bank - Online Banking System (React + Node.js + MongoDB)

This is a **full-fledged online banking web application** built with a **ReactJS frontend**, a **Node.js backend**, and a **MongoDB database**.

---

## 🚀 Features

### ✨ Frontend (ReactJS)
- Home page with Services, About Us, and Contact
- Secure Login
- User Dashboard
- Transaction management
- Fund Transfer
- Balance Inquiry
- Cheque Payment
- Responsive UI

---

### ✨ Backend (Node.js)
- Handles user authentication, fund transfer, transaction history, etc.
- Routes for Login, Signup, Fund Transfer, Transactions
- MongoDB integration for data storage
- Password Hashing for security

---

### ✨ Database (MongoDB)
- Stores user data
- Stores transaction data
- Stores account balance
- Stores cheque request and address update requests

---

## 🛠 Tech Stack

| Part      | Technology |
|:---------:|:----------:|
| Frontend  | ReactJS ⚛️ |
| Backend   | Node.js 🚀 |
| Database  | MongoDB 🍃 |

---

## 📂 Project Folder Structure

```
/admin                (React Frontend)
/backend              (Node.js Backend)
/backend/models       (Mongoose Models)
/backend/routes       (Express Routes)
/backend/controllers  (Controller Logic)
/README.md            (This file)
```

---

## 🧩 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/TrishaPal2004/Banking-System.git
cd Banking-System
```

---

### 2. Install Frontend Dependencies

```bash
cd admin
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

### 4. Setup Environment Variables

Inside `/backend`, create a file called `.env`:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_here
```

(Replace `your_mongodb_connection_string_here` with your MongoDB Atlas or local connection URI.)

---

### 5. Start the Backend Server

```bash
cd backend
npm start
```
Backend will run on:  
🔗 `http://localhost:5000`

---

### 6. Start the Frontend React App

```bash
cd admin
npm start
```
Frontend will run on:  
🔗 `http://localhost:3000`

---

## ⚡ Important Notes

- Frontend communicates with backend via `http://localhost:5000` during development.
- Replace API base URLs when deploying to production.
- MongoDB must be running (either **local MongoDB** or **MongoDB Atlas**).

---

## 👩‍💻 Author

**Trisha Pal**  
- GitHub: [@TrishaPal2004](https://github.com/TrishaPal2004)

---

# 📢 Deployment

| Service        | Purpose                 |
|:---------------|:------------------------:|
| Vercel          | Frontend Hosting         |
| Render / Railway | Backend Hosting         |
| MongoDB Atlas  | Database Hosting          |

---

```

---

### Instructions for the file:

1. **Clone the Repo**: Copy the code into your terminal.
2. **Install Dependencies**: Both frontend and backend.
3. **Setup Environment**: Add `.env` in the backend folder.
4. **Start Servers**: Start backend and frontend separately.

---

Now you have a **full stack application** ready! Would you like to proceed with deploying it somewhere like **Vercel** or **Render**? Let me know if you'd need that as well! 🚀