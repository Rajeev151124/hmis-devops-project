const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'hmis'
});

db.connect(err => {
  if (err) {
    console.log("DB connection failed, retrying...");
    setTimeout(() => db.connect(), 5000);
  } else {
    console.log("MySQL Connected...");
  }
});

// CREATE appointment
app.post('/appointments', (req, res) => {
  const { patient_name, doctor_name, date } = req.body;

  const sql = "INSERT INTO appointments (patient_name, doctor_name, date) VALUES (?, ?, ?)";

  db.query(sql, [patient_name, doctor_name, date], (err, result) => {
    if (err) throw err;
    res.send("Appointment Created");
  });
});

// GET appointments
app.get('/appointments', (req, res) => {
  db.query("SELECT * FROM appointments", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3001, () => console.log("Appointment service running on port 3001"));
