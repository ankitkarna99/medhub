require("dotenv").config();

const app = require("./app");

const mysql = require("promise-mysql");

pool = null;

mysql
  .createPool({
    charset: "utf8mb4",
    database: "medhub",
    connectionLimit: 100,
    user: "root",
  })
  .then(p => {
    pool = p;
    console.log("MySQL: Pool created.");
  });

app.listen(process.env.PORT, () => {
  console.log("App is listening on PORT: " + process.env.PORT);
});
