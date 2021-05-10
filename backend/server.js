const mongoose = require("mongoose");
require("dotenv").config({
    path: `${__dirname}/config.env`
})

let DB = process.env.DB || 'mongodb://localhost/ec2-management';
DB = DB.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB,{                      
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then((con)=>{
    console.log("connection successful!")
    const app = require("./app");
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, ()=>{
        console.log("server started at port "+ PORT);
    })
})
.catch(err=>console.log(err));


