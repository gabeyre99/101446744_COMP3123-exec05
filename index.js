const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const router = express.Router();

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
app.use(express.json());

router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  const userFilePath = path.join(__dirname, 'user.json');
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading user file' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const userFilePath = path.join(__dirname, 'user.json');
  
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading user file' });
    } else {
      const user = JSON.parse(data);
      if (user.username !== username) {
        res.json({ status: false, message: 'User Name is invalid' });
      } else if (user.password !== password) {
        res.json({ status: false, message: 'Password is invalid' });
      } else {
        res.json({ status: true, message: 'User Is valid' });
      }
    }
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req, res) => {
  const username = req.query.username;
  res.send(`<b>${username} successfully logged out.<b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.use('/', router);

const port = process.env.port || 8081;
app.listen(port, () => {
  console.log(`Web Server is listening at port ${port}`);
});