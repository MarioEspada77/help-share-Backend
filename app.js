const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors")({ origin: true, credentials: true });
require("dotenv").config();

mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected to: ", process.env.MONGO_URL);
  })
  .catch(error => {
    console.error(error);
  });

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const app = express();

app.set("trust proxy", true);
app.use(cors);
app.options("*", cors);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    name: "unitalkies-ih", // configuracion del nombre de la cookie
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none", // esta es la linea importante
      secure: process.env.NODE_ENV === "production"
    }
  })
);
app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
