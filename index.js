const express = require("express");
const app = express();
const connectMongo = require("./db");
const path = require("path");
const auth = require("./routes/auth");
const book = require("./routes/books");
const admin = require("./routes/admin");
connectMongo();
app.use(express.static(path.resolve(__dirname, "build")));
const cors = require("cors");
app.use(cors());
app.use(express.json());

//Available routes
app.use(auth);
app.use(book);
app.use(admin);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Book  store backend  started at port ${PORT}`);
});
