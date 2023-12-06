const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const db = require('../data/database');

router.post('/signup', async function (req, res) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredConfirmEmail = userData["confirm-email"];
    const enteredPassword = userData.password;
  
    const hashedPassword = await bcrypt.hash(enteredPassword, 12);
    const data = [enteredEmail, hashedPassword];
    await db.query('insert into users (email, password) values (?)', [data]);
  
    res.send(true);
  });
  
  router.post('/login', async function (req, res) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredPassword = userData.password;
  
    const [existingUsers] = await db.query('select * from users where email = ?', [enteredEmail]);
    const existingUser = existingUsers[0];
  
    if (!existingUser || existingUser.length === 0) {
      return res.redirect('/login');
    }
  
    const passwordEqual = await bcrypt.compare(enteredPassword, existingUser.password);
  
    if (!passwordEqual) {
      return res.redirect('/login');
    }
  
    res.send(true);
  
  });

module.exports = router;