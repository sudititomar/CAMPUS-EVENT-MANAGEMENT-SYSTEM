# Campus Event Management System

## 📌 Project Overview

This is a **full-stack web application** for managing campus events.
Users can register, log in, create events, and register for events.

---

## 🚀 Features

* User Registration & Login (Authentication)
* Create and Manage Events
* Register for Events
* View My Registrations
* Cancel Registration
* Role-based users (Student / Organizer )

---

## 🛠️ Technologies Used

### Frontend:

* HTML
* CSS
* JavaScript

### Backend:

* Node.js
* Express.js

### Database:

* MongoDB

---

## 🏗️ Architecture

This project follows **Client-Server Architecture**:

* Frontend (Client) → Sends requests
* Backend (Server) → Processes requests
* Database → Stores data

We used a **simplified MVC pattern**:

* Models → Database schemas
* Routes → Handle logic (controllers included in routes)

---

## ⚙️ Installation & Setup

1. Clone the repository:

```
git clone <your-repo-link>
```

2. Go to backend folder:

```
cd backend
```

3. Install the dependencies:

```
npm install
```

4. Create `.env` file and add:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

5. Run the server:

```
node app.js
```

6. Open in browser:

```
http://localhost:5000
```

---

## 📁 Folder Structure

```
CAMPUS-EVENT-MANAGEMENT-SYSTEM/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── app.js
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── createevent.html
```

---

## 🔐 Authentication

* JWT (JSON Web Token) is used for secure login
* Protected routes require token

---

## 📚 Software Model

We followed the **Waterfall Model**:

1. Requirement Analysis
2. Design
3. Implementation
4. Testing

---

## 🎯 Future Improvements

* Add UI framework (React)
* Add email notifications
* Improve UI/UX
* Add event images
MVC Structure
---
