const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const db = require("./config/database");
const authRouter = require('./auth/api/authRoutes');
const homeRouter = require('./Home/api/home');
const profileRouter = require('./profile/api/profileRoutes');
const hbs = require('hbs');


db.connect();


const app = express();


app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const upload = multer();

app.use(
    session({
      secret: "secretKey", 
      resave: false,      
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60, // 1 giờ
      },
    })
  );
app.use(flash());

// Routes
app.use('/', authRouter);
app.use('/home', homeRouter);
app.use('/profile',profileRouter),
module.exports = app;
