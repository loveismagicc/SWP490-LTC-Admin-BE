const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Tour & Hotel API",
        version: "1.0.0",
        description: "API documentation for Tour & Hotel Management System",
    },
    servers: [
        {
            url: "http://localhost:5000/api",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.routes.js"], // hoặc đường dẫn tới các file định nghĩa swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
