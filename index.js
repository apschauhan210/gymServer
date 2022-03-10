const express = require('express')
const app = express()
const cors = require('cors')

const db = require('./models')

app.use(express.json());
app.use(cors());

// Routers
const userRouter = require("./routes/User");
app.use("/", userRouter);

const port = process.env.port || 3000;

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("GymWebpage");
    });
})
