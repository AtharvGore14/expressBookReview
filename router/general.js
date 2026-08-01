const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = "http://localhost:5000";

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN]);
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(ans);
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let ans = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              ans.push(books[key]);
          }
      }
  }
  if(ans.length == 0){
      return res.status(300).json({message: "Title not found"});
  }
  res.send(ans);
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

// Task 10: Get all books using Axios with async/await
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book by ISBN using Axios with async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 12: Get books by author using Axios with Promise callbacks
public_users.get('/async/author/:author', (req, res) => {
  const author = req.params.author;
  axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
    .then((response) => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching books by author", error: error.message });
    });
});

// Task 13: Get books by title using Axios with Promise callbacks
public_users.get('/async/title/:title', (req, res) => {
  const title = req.params.title;
  axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then((response) => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching books by title", error: error.message });
    });
});

module.exports.general = public_users;