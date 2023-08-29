const swagger_doc = require("swagger-jsdoc");
const swagger_ui = require("swagger-ui-express");



const options ={
    definition:{
        openapi: "3.0.0",
        info:{
            title: "energywise-back", version:"1.0.0"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./app/routes/userRoute.js"],
};

const swaggerSpec = swagger_doc(options);

const swaggerDocs = (app, port) => {
    app.use("/user/routes/docs", swagger_ui.serve, swagger_ui.setup(swaggerSpec));
    app.get("/user/routes/docs.json",(req, res) =>{
        res.setHeader("Content-Type","application/json");
        res.send(swaggerSpec);
    })
    console.log(`version 1 docs are available at http://localhost:${port}/user/routes/docs/`);
};

module.exports= {swaggerDocs};