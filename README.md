# Scalable Job Importer

This project implements a scalable job importer system using **Node.js**, **Redis**, **MongoDB**, and **Next.js**. It fetches job listings from external RSS feeds (XML), converts and processes them using a queue mechanism, and stores them in MongoDB. An admin UI allows users to view the import history, with real-time updates powered by **Socket.IO**.

---

## 📂 Project Structure

```
/client               # Frontend - Next.js Admin UI
/server               # Backend - Express server with queue and cron
/docs/architecture.md # System design overview
/README.md            # Setup and instructions


---

## 🧩 Tech Stack

| Layer         | Tech           |
|--------------|----------------|
| Frontend     | Next.js + TailwindCSS |
| Backend      | Node.js + Express |
| Database     | MongoDB (Mongoose) |
| Queue System | BullMQ (Redis) |
| Real-Time    | Socket.IO |
| Scheduler    | node-cron |

---

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/artha-job-board.git
cd artha-job-board
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `/server`:

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/jobboard
REDIS_URL=redis://localhost:6379
```

### 4. Start Redis server

If not already running:

```bash
redis-server
```

### 5. Start the backend

```bash
npm start
```

> This starts the server, cron job, and background job processor.

---

### 6. Install frontend dependencies

```bash
cd ../client
npm install
```

### 7. Run the frontend

```bash
npm run dev
```

---

## 🧪 Testing (Manual)

- Watch your terminal for cron logs (`cronJob.js`)
- Visit: `http://localhost:3000` to view the Import History
- Job updates will appear in real-time via Socket.IO

---

## 📡 Job Sources

Jobs are fetched from the following RSS feeds:

- `https://jobicy.com/?feed=job_feed`
- Multiple variants with categories, regions, etc.

These are parsed from XML → JSON → queued → saved into MongoDB.

---

## 💡 Features

- [x] Scheduled Cron to fetch jobs every hour (or custom interval)
- [x] Queue-based job processing (BullMQ + Redis)
- [x] Failure handling and retry logic
- [x] MongoDB storage and import log tracking
- [x] Admin dashboard with import history table
- [x] Real-time updates with Socket.IO

---

## 🧠 Assumptions

- The Job Feed XML format is consistent and contains standard fields.
- MongoDB, Redis, and the Node server are running locally.
- Cron interval can be configured (for testing: every 10s / 1min).

---

## 🚀 Bonus Implementations

- [x] Real-time updates (Socket.IO)
- [x] Retry handling (via queue job failure)
- [x] Scalable architecture and modular design
- [ ] Docker setup (optional)
- [ ] Deployment to Vercel/Render (optional)

---

## 📁 Useful Commands

```bash
# Clean node modules (if needed)
rm -rf node_modules

# Rebuild TailwindCSS (if using PostCSS)
npx tailwindcss build

# Redis CLI (monitor queue)
redis-cli monitor
```

---

## 📄 License

MIT - Feel free to use for learning and demo purposes.