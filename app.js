/** @format */

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const morgan = require("morgan");
const { route } = require("./routes");
const sessions = require("express-session");
const passport = require("passport");
const mongoStore = require("connect-mongo");

dotenv.config({ path: "./config/.env" });
require("./config/passport")(passport);
connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const { formatDate } = require("./helpers/hbs");

app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      formatDate,
    },
  })
);
app.set("view engine", ".hbs");

app.use(
  sessions({
    secret: "keyboard cats",
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3001;

app.listen(
  PORT,
  console.log(
    `process running in ${process.env.NODE_ENV} mode on port ${PORT} `
  )
);
