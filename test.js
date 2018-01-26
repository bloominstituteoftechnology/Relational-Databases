const { Client } = require('pg')
const client = new Client()

client.connect()

// client.query('select now()', (err, res) => {
//     if (err) console.log(err);

//     console.log(res);
//     client.end()
// })

// client.query('SELECT NOW() as now', (err, res) => {
//     if (err) {
//         console.log(err.stack)
//     } else {
//         console.log(res.rows[0])
//     }
// })

client.query('CREATE TABLE IF NOT EXISTS Earthquake(ID SERIAL PRIMARY KEY, Name VARCHAR(20), Magnitude REAL, Lat Real, Lon REAL, Date DATE)');

let data = [
    ["Earthquake 1", 2.2],
    ["Earthquake 2", 7.0],
    ["Earthquake 3", 1.8],
    ["Earthquake 4", 5.2],
    ["Earthquake 5", 2.9],
    ["Earthquake 6", 0.6],
    ["Earthquake 7", 6.6]
];

data.forEach(values => {
    const text = 'INSERT INTO Earthquake(Name, Magnitude) VALUES($1, $2)'

    client.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
        }
    })
})