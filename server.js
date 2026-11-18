
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Priya Voice Backend is Running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    assistant: "Priya"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Priya Voice running on port ${PORT}`);
});
