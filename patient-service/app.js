const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'hmis'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// CREATE Patient
app.post('/patients', (req, res) => {
  const { name, age, disease } = req.body;
  const sql = "INSERT INTO patients (name, age, disease) VALUES (?, ?, ?)";
  db.query(sql, [name, age, disease], (err, result) => {
    if (err) throw err;
    res.send("Patient Added");
  });
});

// READ Patients
app.get('/patients', (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
