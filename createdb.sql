CREATE TABLE user (
  id INT AUTO_INCREMENT,
  name VARCHAR(70) NOT NULL CHECK (name <> ''),
  email VARCHAR(200) NOT NULL CHECK (email <> ''),
  password VARCHAR(100) NOT NULL CHECK (password <> ''),
  created TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(id)
);