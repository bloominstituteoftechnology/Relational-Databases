const { Client } = require('pg');

(async function run() {
  const client = new Client()
  try {
    await client.connect()
    await client.query(`
      CREATE TABLE IF NOT EXISTS Earthquake
      (ID SERIAL NOT NULL PRIMARY KEY,
      Name VARCHAR(20),
      Magnitude REAL,
      Occurrence DATE,
      LONG REAL,
      LAT REAL)`)
    await client.query('DELETE FROM Earthquake')

    /* I spent way too much time trying to figure out how to
       INSERT a POINT type using client.query()
       INSERT-ing directly in psql works though */

    // await client.query(`
    // CREATE TABLE IF NOT EXISTS Earthquake
    // (ID SERIAL NOT NULL PRIMARY KEY,
    // Name VARCHAR(20),
    // Magnitude REAL,
    // Occurrence DATE,
    // LONG_LAT POINT)`)

    // let data = [
    //   ['Earthquake 1', 2.2, "to_date('2017-12-31', 'YYYY-MM-DD')", (36.169941,-115.139830)],
    //   ['Earthquake 2', 7.0, "to_date('2018-01-01', 'YYYY-MM-DD')", (37.774929,-122.419416)],
    //   ['Earthquake 3', 1.8, "to_date('2017-12-22', 'YYYY-MM-DD')", (40.712775,-74.005973)],
    //   ['Earthquake 4', 5.2, "to_date('2017-11-25', 'YYYY-MM-DD')", (34.052234,-118.243685)],
    //   ['Earthquake 5', 2.9, "to_date('2013-09-11', 'YYYY-MM-DD')", (45.523062,-122.676482)],
    //   ['Earthquake 6', 0.6, "to_date('2016-08-01', 'YYYY-MM-DD')", (30.267153,-97.743061)],
    //   ['Earthquake 7', 6.6, "to_date('2016-03-19', 'YYYY-MM-DD')", (39.739236,-104.99025)]
    // ]

    // INSERT INTO Earthquake(Name, Magnitude, Occurrence, Long_Lat) VALUES('Earthquake 7', 6.6, '2016-03-19', '(39.739236, -104.990251)')

    let data = [
      ['Earthquake 1', 2.2, '2017-12-31', '36.169941', '-115.139830'],
      ['Earthquake 2', 7.0, '2018-01-01', '37.774929', '-122.419416'],
      ['Earthquake 3', 1.8, '2017-12-22', '40.712775', '-74.005973'],
      ['Earthquake 4', 5.2, '2017-11-25', '34.052234', '-118.243685'],
      ['Earthquake 5', 2.9, '2013-09-11', '45.523062', '-122.676482'],
      ['Earthquake 6', 0.6, '2016-08-01', '30.267153', '-97.743061'],
      ['Earthquake 7', 6.6, '2016-03-19', '39.739236', '-104.990251']
    ]

    const query = 'INSERT INTO Earthquake(Name, Magnitude, Occurrence, LONG, LAT) VALUES($1, $2, $3, $4, $5)'
    for (let record of data) {
      await client.query(query, record)
    }

    await client.end()
  } catch (err) {
    console.log(err)
  }
})()