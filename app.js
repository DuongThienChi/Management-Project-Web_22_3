const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const db = require("./config/database");
const authRouter = require("./Components/auth/api/authRoutes");
const coursesRouter = require("./Components/course/api/course");
const homeRouter = require("./Components/Home/api/home");
const profileRouter = require("./Components/profile/api/profileRoutes");
const hbs = require("hbs");

db.connect();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(flash());

// Đăng ký helper 'eq'
hbs.registerHelper("eq", function (a, b) {
    return a === b;
});
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    if (req.user) res.locals.user = req.user;
    next();
});
// Routes
app.use("/", authRouter);
app.use("/home", homeRouter);
app.use("/courses", coursesRouter);
app.use("/profile", profileRouter), (module.exports = app);

module.exports = app;
