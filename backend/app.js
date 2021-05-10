const express = require("express");
const session = require("express-session")
const MongodbStore = require("connect-mongodb-session")(session);
const userRouter = require("./router/userRouter")
const instanceRouter = require("./router/ec2InstanceRouter")
const app = express();
const path = require("path")

const store = new MongodbStore({
    uri: process.env.DB.replace("<password>", process.env.DB_PASSWORD),
    collection: "sessions",
    expires: new Date(Date.now() + 86400*1000)
})

app.use(express.json());
app.use(session({secret: "swayam_gupta", resave: false, saveUninitialized: false, store: store}));


app.use("/api/v1/users", userRouter);
app.use("/api/v1/instances", instanceRouter)


app.get("/api/v1/check", (req,res,next)=>{
    res.status(200).json({
        status: "success"
    })
})

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
);

app.use((err,req,res,next)=>{
    let statusCode;
    let message;
    if(err.name==="ValidationError"){
        statusCode = 400;
        message = `This ${Object.keys(err.keyValue)[0]} is already exist. Please choose another`
    }
    else if(err.code==11000){
        statusCode= 400;
        message = "Invalid Body!"
    }
    else if(err.custom){
        statusCode = err.statusCode
        message = err.message
    }
    else{
        console.log(err)
        statusCode = 500;
        message = "Something went wrong!"
    }
    res.status(statusCode).json({
        status: "fail",
        message
    })
    next();
})

module.exports = app;