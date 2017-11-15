const { Client } = require('pg');

/**
 * Does the heavy lifting.
 * 
 * Function is async so we can use await.
 */
async function run(mag) {
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

    // Run the query
    const query = `SELECT * FROM Earthquake
      WHERE Magnitude >= $1
      ORDER BY Magnitude DESC`;

    const res = await client.query(query, [mag]);

    // Print the results
    console.log(`Earthquakes with magnitudes greater than or equal to ${mag}:\n`);

    for (let row of res.rows) {
        console.log(`${row.name}: ${row.magnitude}`);
    }

    await client.end();

  } catch (err) {
    console.log(err);
  }
}

/**
 * Exit with a usage message
 */
function usageExit() {
  console.error("usage: earthquake min_magnitude");
  process.exit(1);
}

// First get the minimum magnitude from the command line
const args = process.argv.slice(2);

if (args.length != 1) {
  usageExit();
}

const mag = parseFloat(args[0]);

if (isNaN(mag)) {
  usageExit();
}

run(mag);