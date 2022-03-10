const express = require('express')
const app = express()
const cors = require('cors')

const db = require('./models')

app.use(express.json());
app.use(cors());

// Routers
const userRouter = require("./routes/User");
app.use("/", userRouter);

db.sequelize.sync().then(() => {
    app.listen(3030, () => {
        console.log("GymWebpage");
    });
})
