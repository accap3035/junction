const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vbiuHMdqIIEuEJg',
    database: 'trashback'
  });

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err);
    return;
  }
  console.log('Connected to MySQL Server!');
});

module.exports = db;
