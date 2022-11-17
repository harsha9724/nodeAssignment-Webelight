const express=require("express");
const app=express();
const swaggerJSDoc=require("swagger-jsdoc");
const swaggerUI=require("swagger-ui-express");
const mongoose=require("mongoose");
const userRouter=require("./routes/user");
const productRouter=require("./routes/product");

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"node js api project",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:5000"
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



app.listen(5000,()=>{
    mongoose.connect("mongodb+srv://Harsha:harsha%401234@cluster0.ohltzw6.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true},()=>{
    console.log("connected to database");
})
    console.log("server is up at 5000");
})
