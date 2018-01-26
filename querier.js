const { Client } = require('pg')
const client = new Client()

client.connect();

if (process.argv.length <= 2) {
    console.log("Usage: node querier.js <some magnitude>");
    process.exit(-1);
}

const query = 'SELECT name, magnitude FROM Earthquake WHERE magnitude >= $1 ORDER BY Magnitude DESC'
const magnitude = [process.argv[2]];

client.query(query, magnitude, (err, res) => {
    if (err) {
        console.log(err.stack)
    } else {
        // console.log(res)
        res.rows.forEach(row => console.log(`${row.name}: ${row.magnitude}`));
    }
    client.end()
})