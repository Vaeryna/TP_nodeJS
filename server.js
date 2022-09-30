import express from "express";
import mongoose from "mongoose";
import * as path from "path";
import cookieParser from "cookie-parser";
import flash from "connect-flash";

//Routes
import * as userRoutes from './routes/users.js'
import session from "express-session";


const app = express()
const __dirname = path.resolve()

//const MongoDBStore = require("connect-mongodb-session")(session);

mongoose
    .connect("mongodb://localhost/shop")
    .then(() => {
        console.log("Connected to Mongo DB courses :)");
    })
    .catch((err) => console.log("Error :("));

//Middlewares
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser())
// for parsing application/json
app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({extended: true}));

//session middleware
app.use(
    session({
        secret: "keyboard cat",
        resave: false, //force la session a être save pour chaque demande de client
        saveUninitialized: false,
        cookie: {expires: 60 * 1000},
    })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.flash_message = req.flash("success_message");
    res.locals.messages = [];
    next();
});


//app use route
app.use("/", userRoutes.default);


app.listen(8000, () => {
    console.log("serveur démarré sur le port 8000");
});