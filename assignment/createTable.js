require('dotenv').config(); 
const { Client } = require('pg');

(async () => {
  const client = new Client()
  try {
    await client.connect()
    await client.query('CREATE TABLE IF NOT EXISTS Earthquake (Name VARCHAR(20), Magnitude REAL)');

    const data = [
      ["Earthquake 1", 2.2],
      ["Earthquake 2", 7.0],
      ["Earthquake 3", 1.8],
      ["Earthquake 4", 5.2],
      ["Earthquake 5", 2.9],
      ["Earthquake 6", 0.6],
      ["Earthquake 7", 6.6]
    ];

    const text = 'INSERT INTO Earthquake(Name, Magnitude) VALUES($1, $2)';

    for (let i = 0; i < data.length; i++) {
      await client.query(text, data[i]);
    }

    await client.end()
  } catch (err) {
    console.log(err.stack)
  }
})();