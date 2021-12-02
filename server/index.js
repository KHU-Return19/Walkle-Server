const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output");
const express=require('express');
const app=express();
const cors=require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;
const http=require('http').createServer(app);
const io=require('socket.io')(http);
require('./socket')(io)



const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config=require('./config/key');

const mongoose=require('mongoose');
const connect = mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true,

    // useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log("디비연결 성공"))
  .catch((err) => console.log(err));

// Routes

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));


app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/communities/boards", require("./routes/communities/boards"));
app.use("/api/communities/comments", require("./routes/communities/comments"));
app.use("/api/communities/hearts", require("./routes/communities/hearts"));




app.use('/api/users',require('./routes/users'));

app.use('/api/profile',require('./routes/profile'));

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(port,()=>{
    console.log(`Server Listening ${port}`)
});