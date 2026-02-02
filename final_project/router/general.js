const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Base URL for Axios requests (adjust port if yours differs)
const BASE_URL = "http://localhost:8080";

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];

  const bookKeys = Object.keys(books);

  bookKeys.forEach(key => {
    if (books[key].author === author) {
      booksByAuthor.push({
        isbn: key,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });

  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  const bookKeys = Object.keys(books);

  bookKeys.forEach(key => {
    if (books[key].title === title) {
      booksByTitle.push({
        isbn: key,
        author: books[key].author,
        reviews: books[key].reviews
      });
    }
  });

  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// ============================================
// ASYNC/AWAIT WITH AXIOS (Tasks 10-13)
// ============================================

// Task 10: Get all books using async/await with Axios
public_users.get('/async-await/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/async-await/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${req.params.isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get('/async-await/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${req.params.author}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 13: Get book details based on Title using async/await with Axios
public_users.get('/async-await/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${req.params.title}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// ============================================
// PROMISE CALLBACK WITH AXIOS (Tasks 10-13)
// ============================================

// Task 10: Get all books using Promise callback with Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
  axios.get(`${BASE_URL}/isbn/${req.params.isbn}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(404).json({ message: "Book not found" });
    });
});

// Task 12: Get book details based on Author using Promise callback with Axios
public_users.get('/async/author/:author', function (req, res) {
  axios.get(`${BASE_URL}/author/${req.params.author}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(404).json({ message: "No books found by this author" });
    });
});

// Task 13: Get book details based on Title using Promise callback with Axios
public_users.get('/async/title/:title', function (req, res) {
  axios.get(`${BASE_URL}/title/${req.params.title}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(404).json({ message: "No books found with this title" });
    });
});

module.exports.general = public_users;