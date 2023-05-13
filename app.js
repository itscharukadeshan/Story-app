/** @format */

const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const morgan = require("morgan");
const { route } = require("./routes");

dotenv.config({ path: "./config/.env" });

connectDB();

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/index"));

const PORT = process.env.PORT || 3001;

app.listen(
  PORT,
  console.log(
    `process running in ${process.env.NODE_ENV} mode on port ${PORT} `
  )
);
