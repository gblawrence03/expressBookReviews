const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve,reject) => {
        let books_result = JSON.stringify(books, null, 4);
        resolve(books_result);
    })
    .then((result) => {
        res.status(200).send(result);
    })
    .catch((error) => {
        res.status(500).send('Internal Server Error');
    })  
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(`Book with isbn ${isbn} could not be found.`);
        }
    }).then((result) => {
        res.status(200).send(JSON.stringify(result));
    }).catch((error) => {
        res.status(404).send(error);
    })
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise(function (resolve, reject) {
        const author = req.params.author;
        let author_books = {}
        for (const [isbn, info] of Object.entries(books)) {
            if (info.author === author) {
                author_books[isbn] = info;
            }
        }
        resolve(author_books);
    })
    .then((result) => {
        res.send(JSON.stringify(result, null, 4));
    })
    .catch((error) => {
        res.status(500).send('Internal Server Error');
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise(function (resolve, reject) {
        const title = req.params.title;
        let title_books = {}
        for (const [isbn, info] of Object.entries(books)) {
            if (info.title === title) {
                title_books[isbn] = info;
            }
        }
        resolve(title_books);
    })
    .then((result) => {
        res.send(JSON.stringify(result, null, 4));
    })
    .catch((error) => {
        res.status(500).send('Internal Server Error');
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book["reviews"], null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
