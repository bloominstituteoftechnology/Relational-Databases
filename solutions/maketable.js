const { Client } = require('pg');

/**
 * Does the heavy lifting.
 * 
 * Function is async so we can use await.
 */
async function run() {
  // This assumes:
  // User: your username
  // Password: [none]
  // Database: your username
  // Host: localhost
  // Port: 5432
  const client = new Client();

  try {
    // Connect to DB
    await client.connect();
   
    // Create table
    await client.query(`CREATE TABLE IF NOT EXISTS Earthquake
      (Name VARCHAR(20), Magnitude REAL)`);

    // Clear out the table if it already existed
    // Sometimes you want to do this, sometimes you don't.
    await client.query('DELETE FROM Earthquake');

    // Insert new data
    let data = [
        ["Earthquake 1", 2.2],
        ["Earthquake 2", 7.0],
        ["Earthquake 3", 1.8],
        ["Earthquake 4", 5.2],
        ["Earthquake 5", 2.9],
        ["Earthquake 6", 0.6],
        ["Earthquake 7", 6.6]
    ];

    const query = 'INSERT INTO Earthquake(Name, Magnitude) VALUES($1, $2)';
    for (let record of data) {
      await client.query(query, record);
    }

    await client.end();

  } catch (err) {
    console.log(err);
  }
}

run();