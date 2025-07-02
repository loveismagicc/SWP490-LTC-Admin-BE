const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./src/config/db');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
    cors({
        origin: ["http://localhost:5173", "https://swp490-ltc-admin.onrender.com"],
        credentials: true,
    })
);

const routesPath = path.join(__dirname, 'src', 'routes');
fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith('.routes.js')) {
        const route = require(path.join(routesPath, file));
        const routePrefix = file.replace('.routes.js', '');
        app.use(`/api/${routePrefix}`, route);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} 🚀`);
});
