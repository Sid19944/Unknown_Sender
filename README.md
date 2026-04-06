# 🕵️ Unknown Sender

> **Send anonymous messages. Receive honest feedback.**

Unknown Sender is a full-stack web application that lets anyone send anonymous messages to a user via their unique public profile link — no account required to send. Built with **Next.js 14**, **TypeScript**, **MongoDB**, and **NextAuth.js**.

---

## ✨ Features

- 🔐 **Authentication** — Secure sign up and login with NextAuth.js
- 📧 **Email Verification** — OTP-based email verification on sign up
- 👤 **Public Profile Link** — Every user gets a unique shareable link `yourdomain.com/u/username`
- 💬 **Anonymous Messaging** — Anyone can send messages without creating an account
- 🤖 **AI Suggested Questions** — Groq AI (Llama 3.1) suggests conversation starters
- 📥 **Dashboard** — View and manage all received anonymous messages
- 🗑️ **Delete Messages** — Remove any message from your dashboard
- ✅ **Accept / Reject Toggle** — Control whether you want to receive messages

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js |
| Email | Resend / Nodemailer |
| AI | Groq (Llama 3.1 8b) |
| Validation | Zod + React Hook Form |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/          # Protected app pages
│   ├── (auth)/         # Auth pages (sign-in, sign-up, verify)
│   └── api/
│       ├── auth/           # NextAuth handlers
│       ├── sign-up/        # User registration
│       ├── verify-code/    # Email OTP verification
│       ├── check-username-unique/
│       ├── send-message/   # Anonymous message sending
│       ├── get-messages/   # Fetch user messages
│       ├── delete-message/ # Delete a message
│       ├── accept-message/ # Toggle accept messages
│       └── suggest-message/ # AI question suggestions
├── components/         # Reusable UI components
├── lib/
│   ├── dbConnect.ts        # MongoDB connection
│   ├── ErrorHandler.ts     # Custom error class
│   ├── errorMiddleware.ts  # Error handler
│   └── asyncWrap.ts        # Async route wrapper
├── models/             # Mongoose models
├── schemas/            # Zod validation schemas
├── types/              # TypeScript types
└── helpers/            # Utility functions
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sid19944/Unknown_Sender.git
cd Unknown_Sender
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of your project:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Email (for OTP verification)
RESEND_API_KEY=your_resend_api_key

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Authentication Flow

```
Sign Up → Enter Details → Email OTP Sent → Verify Code → Logged In
```

- User registers with username, email, and password
- A **6-digit OTP** is sent to their email via Resend
- User verifies OTP on the verify page
- On success, account is activated and user is redirected to dashboard

---

## 📬 How Anonymous Messaging Works

```
Share Link → Anyone visits /u/username → Writes message → Sends anonymously
```

1. User shares their profile link: `yourdomain.com/u/username`
2. Anyone (no account needed) visits the link
3. They write and send an anonymous message
4. The user sees it in their **dashboard**

---

## 🤖 AI Question Suggestions

- Powered by **Groq** (Llama 3.1 8b Instant)
- Suggests 3 random conversation-starter questions
- Uses **streaming** to display questions as they generate
- User can click any suggestion to auto-fill the message box

---

## 🌐 Deployment

This project is deployed on **Vercel**.

| Setting | Value |
|---|---|
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |
| Start Command | `npm run start` |

Make sure to add all environment variables in **Vercel Dashboard → Settings → Environment Variables**.

---

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🙌 Author

**Siddharth**
- GitHub: [@Sid19944](https://github.com/Sid19944)
- Project: [unknown-sender-ten.vercel.app](https://unknown-sender-ten.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).