const { Client } = require('pg');

function usageExit() {
  console.error("usage: earthquake min_magnitude");
  process.exit(1);
}

const args = process.argv.slice(2)

if (args.length != 1) {
  usageExit()
}

const mag = parseFloat(args[0])

if (isNaN(mag)) {
  usageExit()
}

(async function run(mag) {
  const client = new Client()

  try {
    await client.connect()

    const query = `SELECT * FROM Earthquake
      WHERE Magnitude >= $1
      ORDER BY Magnitude DESC`

    const res = await client.query(query, [mag])

    console.log(`Earthquakes with magnitudes greater than or equal to ${mag}:\n`)

    for (let row of res.rows) {
        console.log(`${row.name}: ${row.magnitude}`)
    }

    await client.end()

  } catch (err) {
    console.log(err)
  }
})(mag)