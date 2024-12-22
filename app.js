const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const db = require("./config/database");
const authRouter = require("./Components/auth/api/authRoutes");
const coursesRouter = require("./Components/course/api/course");
const homeRouter = require("./Components/Home/api/home");
const profileRouter = require("./Components/profile/api/profileRoutes");
const userRouter = require("./Components/users/api/user");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const hbs = require("hbs");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const orderRouter = require("./Components/order/api/pay");
const reportRouter = require("./Components/report/api/report");

db.connect();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));
//helpers
require("./views/helpers/format");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }, (limit = "10mb")));

app.use(express.urlencoded({ extended: true }));
const multer = require("multer");
const upload = multer();

app.use(
    session({
        secret: process.env.SECRET_KEY, // Khóa bí mật dùng để mã hóa session
        resave: false, // Không lưu session nếu không có thay đổi
        saveUninitialized: false, // Không lưu session trống
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Thời hạn cookie (1 giờ)
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI, // URL kết nối MongoDB
            collectionName: "sessions", // Tên collection lưu session
        }),
    })
);
// Cấu hình Passport
app.use(passport.initialize());
app.use(passport.session());
hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
});

// Cấu hình flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("successMessage");
    res.locals.errorMessage = req.flash("errorMessage");
    res.locals.warningMessage = req.flash("warningMessage");
    res.locals.existUser = req.flash("existUser");
    res.locals.existMail = req.flash("existMail");
    next();
});
// Đăng ký helper 'eq'
hbs.registerHelper("eq", function (a, b) {
    return a === b;
});
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    if (req.user) res.locals.user = req.user;
    next();
});
require("./views/helpers/orderHelpers");

// Routes
app.use("/", authRouter);
app.use("/home", homeRouter);
app.use("/courses", coursesRouter);
app.use("/users", userRouter);
app.use("/profile", profileRouter);
app.use("/orders", orderRouter);
app.user("/report", reportRouter);
module.exports = app;
