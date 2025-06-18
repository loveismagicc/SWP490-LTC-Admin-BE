const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const routesPath = path.join(__dirname, 'src', 'routes');
fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith('.routes.js')) {
        const route = require(path.join(routesPath, file));
        const routePrefix = file.replace('.routes.js', '');
        app.use(`/api/${routePrefix}`, route);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
