const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const taskData = req.body; // Assuming Asana sends task data in the request body

  // Call a function to add the data to Airtable
  addTaskToAirtable(taskData);

  res.status(200).json({ message: "Webhook received" });
});

function addTaskToAirtable(taskData) {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "Asana Tasks";

  const headers = {
    Authorization: `Bearer ${airtableApiKey}`,
    "Content-Type": "application/json",
  };

  const data = {
    fields: {
      "Task ID": taskData.task_id,
      Name: taskData.name,
      Assignee: taskData.assignee,
      "Due Date": taskData.due_date,
      Description: taskData.description,
    },
  };

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Task added to Airtable successfully.");
    })
    .catch((error) => {
      console.error("Failed to add task to Airtable:", error);
    });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
