/** @format */

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
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

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs");

app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select,
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

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

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
