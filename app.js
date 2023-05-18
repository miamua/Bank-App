import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import cookieParser from "cookie-parser";

const app = express();
const saltRounds = 10;

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(session({
    secret: "shhhhh, this is very secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 5*60*1000
    }
}));

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();

const db = client.db("userdb");
const usersCollection = db.collection("users");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
  await usersCollection.insertOne({
    username: req.body.username,
    password: hashPassword,
  });
  res.render("secrets",{
    userName: req.body.username
  });
});

app.post("/login", async (req, res) => {
  const user = await usersCollection.findOne({
    username: req.body.username,
  });
  if (user) {
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (passwordMatches) {
    req.session.user = user;
    //res.json()
      res.render("secrets",{
        userName: user.username
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
});

/*
app.get("/logout", async(req,res) =>{
    req.logout();
    res.redirect("/");
});
*/


app.listen(3000, function () {
  console.log(`Server is running on port 3000`);
});
