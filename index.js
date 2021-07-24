require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const mongoose = require("mongoose");


mongoose.connect(process.env.MONGO_ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Mongo is ON");
}).catch((e) => console.log("error while connecting to mongo:", e.message));


const app = express();
app.use(morgan('dev'));
app.use( cors({origin: "*"}));
app.use(express.json());

const authRouter = require("./Routes/authRouter");
const postRouter = require("./Routes/postRouter");

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.get("/", async (req,res) => {
    res.status(200).json({messsage: "Hello World!"})
})


const PORT = 3300

app.listen(PORT, () => {
    console.log("server is listening on PORT: " +PORT)
})