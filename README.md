
---

## 📁 `server/README.md` — Backend (Node.js + MongoDB + Nodemailer)

```markdown
# 🛠 Job Application Tracker – Backend

This is the backend API for the Job Application Tracker.  
It handles user authentication, CRUD operations for job applications, and sends email notifications when job status changes.

---

## 🚀 Features

- JWT-based user login & registration
- Job CRUD: add, edit, delete, view
- Status tracking: `Applied`, `Interview`, `Offer`, `Rejected`, `Accepted`
- Filter/sort jobs by status or date
- Email notifications via Nodemailer (e.g., status updates)
- CORS + rate limiting + express middlewares

---

## 🖥 Tech Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- JWT Authentication
- Nodemailer (for real-time email alerts)
- dotenv
- Socket.IO (optional for panel notifications)

---

## 🔧 Getting Started

### 📁 Step 1: Navigate to `server` folder

```bash
cd server


📥 Step 2: Install dependencies
bash
Copy
Edit
npm install

⚙️ Step 3: Create .env file
env
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Nodemailer Email Configuration
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_email@ethereal.email
EMAIL_PASS=your_password
EMAIL_FROM="Job Tracker <noreply@jobtracker.com>"

▶️ Run the Server
bash
Copy
Edit
npm start
