require('dotenv').config(); 
const { Client } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const server = express();
server.use(bodyParser.json());

server.get("/minmag/:mag", async (req, res) => {
  const { mag } = req.params;
  const client = new Client();
  try {
    await client.connect()
    const text = "SELECT * FROM Earthquake WHERE Magnitude >= $1 ORDER BY Magnitude DESC";
    const results = [];
    const response = await client.query(text, [mag]);
    for(let i = 0; i < response.rows.length; i++) {
      const { name, magnitude } = response.rows[i];
      results.push({ name, magnitude });
    }
    res.json({ results });
  } catch (err) {
    console.log(err.stack)
  }
});

server.post("/new", async (req, res) => {
  const { name, magnitude } = req.body;
  const client = new Client();
  try {
    await client.connect()
    const text = 'INSERT INTO Earthquake(Name, Magnitude) VALUES($1, $2)';
    await client.query(text, [name, magnitude]);
    res.json({ "status": "ok" });
  } catch (err) {
    console.log(err.stack)
  }
});

server.listen(3000, (err) => {
  console.log('Server listening on port 3000');
})