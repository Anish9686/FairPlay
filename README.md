Performance & Reward Platform

A full-stack MERN application that tracks golf performance, enables subscription-based eligibility, and runs a transparent monthly reward draw with admin verification and charity contributions.

🚀 Live Demo
🌐 Frontend: https://fairplay-xyz.vercel.app
⚙️ Backend API: https://your-backend.onrender.com
📌 Overview

FairPlay is designed to simulate a real-world SaaS product with:

User subscriptions (mock payment system)
Performance tracking (Stableford scoring)
Monthly lottery system for rewards
Admin verification workflow
Charity contribution integration

The platform focuses on clean architecture, real-world workflows, and production-ready practices.

✨ Key Features
👤 User Features
🔐 Secure Authentication (JWT-based)
📊 Performance Dashboard (Average score, rounds tracked)
📈 Performance Trajectory (last 5 rounds visualization)
📝 Score Logging with validation
🚫 Duplicate date restriction (PRD requirement)
💳 Mock Subscription System (Monthly / Yearly)
🎯 Eligibility tracking for monthly draw
🏆 Winner claim flow with proof submission
❤️ Charity selection with flexible contribution %
🛠️ Admin Features
📊 System metrics (users, active subscriptions)
🎲 Monthly Draw Engine
📜 Draw history tracking
✅ Proof verification (Approve / Reject)
💰 Mark rewards as Paid
👥 User directory with subscription status
🧠 Tech Stack
Frontend
React (Vite)
Tailwind CSS
Axios
Context API (State Management)
Backend
Node.js
Express.js
MongoDB (Atlas)
Mongoose
JWT Authentication
Deployment
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
🏗️ Architecture

Client (React) → REST API (Express) → MongoDB Atlas

Separation of concerns (frontend/backend)
Environment-based configuration
Secure API communication with CORS
⚙️ Environment Variables
Backend (.env)
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=https://fairplay-xyz.vercel.app
Frontend (.env)
VITE_API_URL=https://your-backend.onrender.com

⚠️ Never commit .env files to GitHub

🧪 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/fairplay.git
cd fairplay
2️⃣ Install dependencies
Backend
cd backend
npm install
Frontend
cd frontend
npm install
3️⃣ Setup environment variables
Create .env in both frontend and backend
4️⃣ Run the project
Backend
npm run dev
Frontend
npm run dev
🔐 Security Practices
Environment variables protected via .gitignore
JWT authentication for protected routes
CORS configured using environment-based origin
No sensitive data exposed in frontend
📱 Responsive Design
Mobile-first UI
Admin tables optimized for smaller screens
Clean and modern dashboard layout
🧩 PRD Compliance Highlights

✔ Mock subscription system implemented
✔ Charity contribution flexibility
✔ Duplicate score prevention
✔ Admin verification workflow
✔ Monthly draw engine
✔ Mobile-first design

📊 Future Improvements
Real payment gateway integration (Stripe/Razorpay)
Email notifications
Role-based access control (RBAC)
Advanced analytics dashboard
🙌 Author

Anish

Full Stack Developer (MERN)
Focused on building scalable and production-ready applications
⭐ Final Note

This project is built to demonstrate real-world SaaS architecture, clean UI/UX, and full-stack integration. It reflects strong fundamentals in backend logic, frontend design, and deployment workflows.

If you find this project valuable, consider giving it a ⭐ on GitHub.
