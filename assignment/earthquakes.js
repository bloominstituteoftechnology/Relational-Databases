require('dotenv').config(); 
const { Client } = require('pg');

const magnitude = parseFloat(process.argv[2]);
if(!magnitude){
  console.log("Enter earthquake magnitude");
  process.exit(1);
}

(async () => {
  const client = new Client();
  try {
    await client.connect()
    const text = "SELECT * FROM Earthquake WHERE Magnitude >= $1 ORDER BY Magnitude DESC";
    const res = await client.query(text, [magnitude]);
    for(let i = 0; i < res.rows.length; i++) {
      console.log(`${res.rows[i].name}: ${res.rows[i].magnitude}`);
    }
    await client.end();
  } catch (err) {
    console.log(err.stack)
  }
})();

