const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "User already exists"});
  }

  users.push({username: username, password: password});
  return res.status(201).json({message: "User successfully registered. Now you can login"});
});

// Task 1: Get the book list available in the shop (Synchronous)
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN (Synchronous)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author (Synchronous)
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
    res.status(404).json({message: "No books found by this author"});
  }
});

// Task 4: Get all books based on title (Synchronous)
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
    res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// ============================================
// ASYNC/AWAIT VERSIONS (Tasks 10-13)
// ============================================

// Task 10: Get all books using async callback (Promise)
public_users.get('/async/', function (req, res) {
  // Using Promise to simulate async operation
  const getAllBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 100); // Simulating async delay
  });

  getAllBooks.then(
    (bookData) => {
      res.send(JSON.stringify(bookData, null, 4));
    },
    (error) => {
      res.status(500).json({message: "Error fetching books"});
    }
  );
});

// Alternative Task 10: Using async/await
public_users.get('/async-await/', async function (req, res) {
  try {
    // Simulating async operation with Promise
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };

    const bookData = await getAllBooks();
    res.send(JSON.stringify(bookData, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using async callback
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 100);
  });

  getBookByISBN.then(
    (bookData) => {
      res.send(JSON.stringify(bookData, null, 4));
    },
    (error) => {
      res.status(404).json({message: error});
    }
  );
});

// Alternative Task 11: Using async/await
public_users.get('/async-await/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject("Book not found");
          }
        }, 100);
      });
    };

    const bookData = await getBookByISBN();
    res.send(JSON.stringify(bookData, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});

// Task 12: Get book details based on Author using async callback
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
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
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    }, 100);
  });

  getBooksByAuthor.then(
    (bookData) => {
      res.send(JSON.stringify(bookData, null, 4));
    },
    (error) => {
      res.status(404).json({message: error});
    }
  );
});

// Alternative Task 12: Using async/await
public_users.get('/async-await/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
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
            resolve(booksByAuthor);
          } else {
            reject("No books found by this author");
          }
        }, 100);
      });
    };

    const bookData = await getBooksByAuthor();
    res.send(JSON.stringify(bookData, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});

// Task 13: Get book details based on Title using async callback
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  
  const getBooksByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
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
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    }, 100);
  });

  getBooksByTitle.then(
    (bookData) => {
      res.send(JSON.stringify(bookData, null, 4));
    },
    (error) => {
      res.status(404).json({message: error});
    }
  );
});

// Alternative Task 13: Using async/await
public_users.get('/async-await/title/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
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
            resolve(booksByTitle);
          } else {
            reject("No books found with this title");
          }
        }, 100);
      });
    };

    const bookData = await getBooksByTitle();
    res.send(JSON.stringify(bookData, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});

module.exports.general = public_users;