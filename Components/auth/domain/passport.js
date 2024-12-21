const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../data-access/AdminModel");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const bcrypt = require("bcrypt");

// Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, {
                        type: null,
                        message: "Incorrect email.",
                    });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, {
                        type: null,
                        message: "Incorrect password.",
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    console.log("Serialize User:", user); // Kiểm tra dữ liệu user
    done(null, {
        id: user.id,
        username: user.username,
        email: user.email,
        Img: user.Img,
    });
});

// Deserialize user
passport.deserializeUser(async (user, done) => {
    console.log("Deserialize User:", user); // Kiểm tra dữ liệu user
    try {
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
