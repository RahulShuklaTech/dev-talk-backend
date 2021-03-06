require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const mongoose = require("mongoose");
const path = require("path");


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
app.use(express.static(path.join(__dirname, "/public")));

const authRouter = require("./Routes/authRouter");
const postRouter = require("./Routes/postRouter");
const followRouter = require("./Routes/followRouter");
const profileRouter = require("./Routes/profileRouter");


app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/follow", followRouter);
app.use("/profile", profileRouter);

app.get("/", async (req,res) => {
    res.status(200).json({messsage: "Hello World!"})
})


const PORT = process.env.PORT || 3300; 

app.listen(PORT, () => {
    console.log("server is listening on PORT: " +PORT)
})