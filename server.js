const express = require('express')
const app = express();
const db = require('./database/database');
require('dotenv').config();

const PORT = process.env.PORT
const routes = require('./routes/index')

app.use(express.json())
app.use('/', routes)

app.use((req, res) => {
    res.status(404).json({message: "We could not find what you are looking for."});
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

process.on('SIGINT', () => {
    db.close();
    console.log("Database closed");
});