const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const routes = require('./routes');
const usePassport = require('./config/passport');
require('./config/mongoose');

const app = express();
const PORT = process.env.PORT;

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

usePassport(app);

app.use(flash());

app.use((req, res, next) => {
  // the following will be used in views

  res.locals.isAuthenticated = req.isAuthenticated(); //locals can return any data as an object
  res.locals.user = req.user; //req.user is from the deserialized user in passport.js

  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
});

app.use(routes);

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
