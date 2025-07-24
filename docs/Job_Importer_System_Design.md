System Design - Job Importer Platform

# 1\. Overview

The platform fetches job data from external APIs on a schedule, processes and stores them using a queue-worker system, tracks import history and provides real-time updates to the frontend via Socket.IO.

# 2. Components Overview

| Component    | Tech Stack                   | Purpose                                                   |
|--------------|------------------------------|------------------------------------------------------------|
| Frontend     | Next.js + TailwindCSS + Socket.IO | Displays job import history and receives real-time updates. |
| API Server   | Express.js + Socket.IO       | Handles routes, real-time events, and queues.              |
| Worker/Queue | Bull (with Redis)            | Processes fetched jobs asynchronously.                    |
| Scheduler    | Node-Cron                    | Periodically fetches job data from external API.          |
| Database     | MongoDB                      | Stores job data and import logs.                          |
| Realtime     | Socket.IO                    | Notifies frontend of new or updated jobs in real-time.     |


# 3\. Architecture Diagram

The system uses a decoupled architecture. Jobs are fetched from external APIs via a scheduled cron job and added to a queue. A worker processes the queue and updates MongoDB. Real-time updates are sent to connected clients via Socket.IO. The frontend uses Next.js to display job import logs and updates.

# 4\. Data Flow

A. Scheduled Job Fetching  
\- Cron job triggers fetchJobsFromAPI.js.  
\- Normalized jobs added to Bull queue.  
B. Queue Processing  
\- Worker processes jobs from queue.  
\- New jobs are inserted, existing are updated.  
\- Events emitted via Socket.IO.  

# 5\. MongoDB Schema Overview

jobs Collection:  
{  
jobId: String,  
title: String,  
company: String,  
location: String,  
description: String,  
datePosted: Date,  
createdAt: Date  
}  
<br/>import_logs Collection:  
{  
timestamp: Date,  
totalFetched: Number,  
newJobs: Number,  
updatedJobs: Number,  
failedJobs: \[ { job: {}, error: String } \]  
}  

# 6\. Socket.IO Events

\- 'job-added': Sent when a new job is added.  
\- 'job-updated': Sent when a job is updated.  

# 7\. Security & Production Suggestions

\- Use CORS restrictions.  
\- Secure environment variables.  
\- Add request rate limiting.  
\- Monitor queues with Bull Board.  
\- Scale Socket.IO with Redis adapter.  

┌────────────────────────────┐

│ External Job API │

└────────────┬───────────────┘

│ (HTTP/XML)

┌────────▼────────┐

│ Cron Job │

│ (node-cron) │

└────────┬────────┘

│

┌────────▼────────┐

│ fetchJobsFromAPI│

└────────┬────────┘

│

┌─────▼─────┐

│ Bull Queue│

└─────┬─────┘

│

┌──────────────▼──────────────┐

│ Worker (Queue.process) │

│ │

│ - Normalize/Sanitize jobs │

│ - Create/Update in MongoDB │

│ - Create Import Log │

│ - Emit events via Socket.IO │

└──────────────┬──────────────┘

│

┌─────────────────▼────────────────┐

│ MongoDB │

│ - jobs collection │

│ - import_logs collection │

└─────────────────┬────────────────┘

│

┌──────────▼───────────┐

│ Express.js Server │

│ + Socket.IO │

└──────────┬───────────┘

│ (WebSocket + REST)

┌─────▼─────┐

│ Next.js │

│ Frontend │

└───────────┘