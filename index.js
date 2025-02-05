const express = require("express");
const mongoose = require("mongoose");
const Job = require("./models/Job"); // Make sure to import your Job model
const cors = require("cors");
const app = express();
const port = 9000;
const dbUrl =
  "mongodb+srv://kemparajsanjana:d1Cny0ZKjSFX5FU4@react-job-app.xihhy.mongodb.net/?retryWrites=true&w=majority&appName=React-job-app";

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB and start server
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error(err));

// Route to get all jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find(); // Get all jobs from MongoDB
    res.json(jobs); // Return the jobs
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // Get job by ID from MongoDB
    if (!job) {
      return res.status(404).json({ message: "Job not found" }); // Handle not found case
    }

    res.json(job); // Return the job
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//post
app.post("/api/jobs", async (req, res) => {
  try {
    const newJob = new Job(req.body); // Create a new job from the request body
    const savedJob = await newJob.save(); // Save to MongoDB

    res.status(201).json(savedJob); // Respond with the saved job and status 201 (Created)
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

// Update job by ID
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id, // Job ID from URL
      req.body, // New data to update
      { new: true } // Return the updated job (not the original)
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(updatedJob); // Return the updated job
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
});
