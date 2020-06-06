const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'users/login'
  })
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  //check if the form is completed
  const errors = [];
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'Please complete all the fields' });
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Check if your confirmed password is correct' });
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    });
  }

  //check if this email has been registered before!
  User.findOne({ email }).then((user) => {
    if (user) {
      //console.log('user already exists!');
      errors.push({ message: 'User already exists' });
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      }); //remember to send the user back to the register page, and send previous info back just for better ux
    }
    // hash password before create a new user
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash
        })
      )
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err));
    // register this new user
    // const newUser = new User({
    //   name,
    //   email,
    //   password
    // });
    // newUser
    //.save() //save the user in db
    //.then(
    //() => res.redirect('/') //remember to redirect the user to new page
    //)
    //.catch((err) => console.log(err));
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Logout successfully');
  res.redirect('/users/login');
});

module.exports = router;
