const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const saltrounds = 5;

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

// =====================================================================

// check if the mail is inside the database
async function chkmail (mail) {
  const [row] = await pool.query(`
    SELECT email FROM user
    WHERE email = ?`, [mail]);
  return row[0]; // row[0] = { "email": "<mail>" }
};

// check if the input pwd is correct, return true or false
async function chkpair (mail, pwd) {
  const [row] = await pool.query(`
    SELECT email, password FROM user
    WHERE email = ?`, [mail]); // row[0] = { "email": "<mail>", "password": "<pwd>" }
  if (row.length > 0) {
    const validpwd = await bcrypt.compare(pwd, row[0].password);
    return validpwd;
  }
};

// get name by input mail
async function getNameByMail (mail) {
  const [row] = await pool.query(`
    SELECT name FROM user
    WHERE email = ?`, [mail]);
  return row[0]; // row[0] = { "name": "<name>" }
}

// get all columns by id
async function getUser (sysid) {
  const [row] = await pool.query(`
    SELECT * FROM user 
    WHERE id = ?`, [sysid]);
  return row[0];
};

// create new records in the database
async function createUser (name, mail, pwd) {
  const hashedpwd = await bcrypt.hash(pwd, saltrounds);
  const [result] = await pool.query(`
    INSERT INTO user (name, email, password)
    VALUES (?, ?, ?)`, [name, mail, hashedpwd]);
  const newsysid = result.insertId;
  return getUser(newsysid);
};

module.exports = {
  chkmail,
  chkpair,
  getNameByMail,
  getUser,
  createUser
};
