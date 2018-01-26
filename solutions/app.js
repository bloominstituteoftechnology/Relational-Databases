const app = require('express')()
const bodyParser = require('body-parser')
const { Pool } = require('pg')

const pool = new Pool()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(`<html>
              <body>
                <p>Usage:
                  /list — GET — Returns a list of all earthquakes
                  /minmag/:id — GET —  Returns a list of earthquakes larger than parameter
                  /new — POST — Creates a new entry with details in req.body
                  /delete:id — DELETE — Deletes earthquake entry specified by id
                </p>
              </body>
            </html>`)
})

/* —— Return list of earthquakes larger than value specified in parameter —— */
app.get('/minmag/:id', async (req, res) => {
  const query = `SELECT * FROM Earthquake WHERE Magnitude >= $1 ORDER BY Magnitude DESC`
  const output = { results: [] }
  try {
    const { id } = req.params
    const response = await pool.query(query, [id])

    for (let row of response.rows) {
      const { name, magnitude, occurrence, long, lat } = row
      output.results.push({ name, magnitude, date: occurrence.toDateString(), long, lat })
    }

    res.status(200).json({ 'status': 'ok', output })
  } catch (err) {
    res.status(500).json({ 'status': 'error', err })
  }
})

/* —— Return a list of all rows —— */
app.get('/list', async (req, res) => {
  const output = { results: [] }
  try {
    const response = await pool.query('SELECT * FROM EARTHQUAKE')

    for (let row of response.rows) {
      const { id, name, magnitude, occurrence, long, lat } = row
      output.results.push({ id, name, magnitude, date: occurrence.toDateString(), long, lat })
    }

    res.status(200).json({ 'status': 'ok', output })
  } catch (err) {
    res.status(500).json({ 'status': 'error', err })
  }
})

/* —— Create a new row —— */
app.post('/new', async (req, res) => {
  try {
    const { name, magnitude, occurrence, long, lat } = req.body
    const new_entry =
      await pool.query(`INSERT INTO Earthquake(Name, Magnitude, Occurrence, LONG, LAT)
        VALUES($1, $2, $3, $4, $5)`, [name, magnitude, occurrence, long, lat])

    res.status(200).json({ 'status': 'ok', new_entry })
  } catch (err) {
    res.status(500).json({ 'status': 'error', err })
  }
})

/* —— Delete a row corresponding to its id —— */
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    const response = await pool.query('DELETE FROM Earthquake WHERE ID = $1', [id])

    res.status(200).json({ 'status': 'ok', response })
  } catch (err) {
    res.status(500).json({ 'status': 'error', err })
  }
})

app.listen(8000, err => {
  if (err) console.log(err)
  console.log('Server is listening on port 8000')
})
