const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const port = 8000;

dotenv.config();

app.use(express.static('./public'));

app.set("views", path.join(__dirname, "./server/views"));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  name: 'member',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { SameSite: 'lax', maxAge: 5 * 60 * 1000 }
}));

const loginRoute = require('./server/routes/login');
app.use(loginRoute);

app.get("/check", (req, res) => {
    return res.send("Hello World!");
})

// --------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broken!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});