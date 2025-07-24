const queue = require("../queue");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");

function sanitizeKeys(obj) {
  if (Array.isArray(obj)) return obj.map(sanitizeKeys);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        const newKey = k.startsWith("$") ? k.replace(/^\$/, "_") : k;
        return [newKey, sanitizeKeys(v)];
      })
    );
  }
  return obj;
}

function normalizeJobFields(job) {
  const rawDate = job.pubDate;
  const parsedDate = new Date(rawDate);
  const isValidDate = !isNaN(parsedDate.getTime());

  let jobId = "";
  if (typeof job.guid === "string") jobId = job.guid;
  else if (job.guid && typeof job.guid._ === "string") jobId = job.guid._;
  else if (typeof job.link === "string") jobId = job.link;

  return {
    jobId,
    title: job.title || "",
    description: job.description || "",
    company: job["job:company"] || "",
    location: job["job:location"] || "",
    datePosted: isValidDate ? parsedDate : undefined,
  };
}

queue.process(async (job) => {
  const { jobs } = job.data;
  console.log("📥 Processing", jobs.length, "jobs");

  const log = {
    timestamp: new Date(),
    totalFetched: jobs.length,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: [],
  };

  for (const j of jobs) {
    const safeJob = normalizeJobFields(sanitizeKeys(j));

    console.log(
      "Processing jobId:",
      safeJob.jobId,
      "datePosted:",
      safeJob.datePosted
    );

    try {
      const existing = await Job.findOne({ jobId: safeJob.jobId });

      if (existing) {
        await Job.findOneAndUpdate({ jobId: safeJob.jobId }, safeJob);
        log.updatedJobs++;
        io.emit("job-updated", safeJob);
      } else {
        await Job.create(safeJob);
        log.newJobs++;
        io.emit("job-added", safeJob);
      }
    } catch (err) {
      log.failedJobs.push({ job: safeJob, error: err.message });
    }
  }

  await ImportLog.create(log);
  console.log("✅ Log saved:", log);
});
