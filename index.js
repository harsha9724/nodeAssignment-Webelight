const express=require("express");
const app=express();
const swaggerJSDoc=require("swagger-jsdoc");
const swaggerUI=require("swagger-ui-express");
const mongoose=require("mongoose");
const userRouter=require("./routes/user");
const productRouter=require("./routes/product");
const dotenv = require("dotenv");
dotenv.config();
const port=5000 || process.env.PORT
const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"node js api project",
            version:"1.0.0"
        },
        servers:[
            {
                url:`http://localhost:${port}`
            }
        ]
    },
        components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                in: "header",
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }],
    apis:["./routes/user.js","./routes/product.js"]
}
const swaggerSpec=swaggerJSDoc(options);
app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(swaggerSpec));

app.use("/",userRouter);
app.use("/",productRouter);



app.listen(port, ()=>{
    mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true},()=>{
    console.log("connected to database");
})
    console.log(`server is up at ${port}`);
})
