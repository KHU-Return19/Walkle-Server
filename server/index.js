const express=require('express');
const app=express();


require('dotenv').config();
const port=process.env.PORT || 5000;


const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

const config=require('./config/key');

const mongoose=require('mongoose');
const connect = mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true,
    // useCreateIndex: true, useFindAndModify: false
    })
    .then(()=>console.log('디비연결 성공'))
    .catch((err)=>console.log(err));


// Routes



app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users',require('./routes/users'));

app.listen(port,()=>{
    console.log(`Server Listening ${port}`)
})