const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const name = "Alex";
    connection.query(
      "INSERT INTO people(name) VALUES (?)",
      [name],
      (err, results) => {
        if (err) throw err;

        connection.query("SELECT * FROM people", (err, results) => {
          connection.release();

          if (err) throw err;

          let response = "<h1>Full Cycle Rocks!</h1>";
          response += "<ul>";
          results.forEach((person) => {
            response += `<li>${person.name}</li>`;
          });
          response += "</ul>";

          res.send(response);
        });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
