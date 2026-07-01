# Travel Booking — MERN Stack

Full-stack travel booking app with Razorpay payments, email confirmations, search/filter, and an admin dashboard.

## Stack
- **Frontend**: React (Vite), React Router, Context API, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Payments**: Razorpay (test mode)
- **Email**: Nodemailer + Gmail SMTP

## Folder structure
```
travel-booking/
  backend/
    config/         db.js, razorpay.js, mailer.js
    controllers/    authController, tourController, bookingController, paymentController
    middleware/     authMiddleware.js, adminMiddleware.js
    models/         User.js, TourPackage.js, Booking.js
    routes/         authRoutes, tourRoutes, bookingRoutes, paymentRoutes
    scripts/        createAdmin.js
    server.js
  frontend/
    src/
      api/          axiosClient.js
      components/   Navbar, TourCard, PrivateRoute, AdminRoute
      context/      AuthContext.jsx
      pages/        Home, Login, Register, TourDetails, MyBookings
      pages/admin/  AdminDashboard
```

## Prerequisites
- Node.js v18+ and npm
- MongoDB running locally OR a free MongoDB Atlas cluster
- A Razorpay account (free, test mode) — sign up at https://dashboard.razorpay.com
- A Gmail account with an App Password generated at https://myaccount.google.com/apppasswords

---

## Setup

### 1. Backend

```bash
cd travel-booking/backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — `mongodb://127.0.0.1:27017/travel-booking` for local, or your Atlas connection string
- `JWT_SECRET` — any long random string (e.g. run: `openssl rand -base64 32`)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — from Razorpay dashboard → Settings → API Keys → Test Mode
- `EMAIL_USER` — your Gmail address
- `EMAIL_APP_PASSWORD` — the 16-character App Password from Google (NOT your Gmail login password)

Start the backend:
```bash
npm run dev
```
You should see:
```
MongoDB connected
Server running on port 5001
```

### 2. Frontend

Open a new terminal:
```bash
cd travel-booking/frontend
npm install
cp .env.example .env
```

`.env` should contain:
```
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## First-time setup: create an admin user

1. Register a user through the app UI (`/register`) or via the API.
2. Run the admin promotion script:
```bash
cd backend
npm run seed:admin -- youremail@example.com
```
3. Log out and log back in — the Navbar will now show an "Admin" link taking you to `/admin`.

---

## Testing payments (Razorpay test mode)

Use these test card details in the Razorpay checkout popup:
- Card number: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: any 3 digits
- OTP: `1234`

No real money is charged in test mode.

---

## Deployment

### Backend → Render
1. Push your project to GitHub.
2. Go to https://render.com → New Web Service → connect your repo.
3. Set root directory to `backend`, build command `npm install`, start command `npm start`.
4. Add all your `.env` values as Environment Variables in the Render dashboard.

### Frontend → Vercel
1. Go to https://vercel.com → New Project → connect your repo.
2. Set root directory to `frontend`.
3. Add environment variable: `VITE_API_URL=https://your-render-backend-url.onrender.com/api`

### Database → MongoDB Atlas
1. Sign up at https://mongodb.com/atlas, create a free M0 cluster.
2. Under Network Access, allow connections from anywhere (0.0.0.0/0) for Render.
3. Copy the connection string and use it as `MONGO_URI` on Render.

---

## Common issues
- **Port 5000 in use**: Change `PORT=5001` in backend `.env` (macOS uses 5000 for AirPlay).
- **MongoDB connection failed**: Make sure `mongod` is running locally, or your Atlas IP whitelist includes Render's IPs.
- **CORS errors**: Make sure `CLIENT_URL` in backend `.env` matches your frontend URL exactly.
- **Razorpay widget doesn't open**: Make sure `checkout.razorpay.com/v1/checkout.js` is loading in `index.html` and your `RAZORPAY_KEY_ID` is correct.
- **Email not sending**: Make sure you used an App Password (not your Gmail password), and that 2FA is enabled on your Google account (required for App Passwords).
