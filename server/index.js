const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output");
const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected ..."))
  .catch((err) => console.log(err));

// Routes

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/community/", require("./routes/communities"));

app.use("/api/users", require("./routes/users"));

app.use("/api/profile", require("./routes/profile"));

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`Server Listening ${port}`);
});
