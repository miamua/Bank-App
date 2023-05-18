import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();
const saltRounds = 10;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(cookieParser());
//app.use(express.static("public"));
app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "shhhhh, this is very secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5601000,
    },
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();

const db = client.db("bankDB");
const usersCollection = db.collection("accounts");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the home page" });
});

app.get("/accounts/all", requireLogin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  let entries = await usersCollection.find({}).limit(limit).toArray();
  res.json(entries);
});

app.get("/accounts", requireLogin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  let entries = await usersCollection.find({}).limit(limit).toArray();
  res.sendFile(join(__dirname, "/accounts.html"));
});

app.post("/account/:id/delete", async (req, res) => {
  await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(204).send();
});

app.post("/register", async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
  await usersCollection.insertOne({
    username: req.body.username,
    password: hashPassword,
    money: req.body.money,
  });
  res.json({ message: "Registration successful" });
  //res.sendFile(join(__dirname, '/public/login.html'));
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
      res.json({
        user: req.session.user,
      });
      //res.status(200).json({ message: "Login successful"});
      //res.sendFile(__dirname + '/secrets.html');
    } else {
      res.status(401).json({
        message: "Wrong Password",
      });
    }
  } else {
    console.log(req.body);
    res.status(401).json({ message: "User can't found" });
  }
});

app.get("/user", async (req, res) => {
  let userId = req.session.user;
  let entries = await usersCollection.findOne({
    _id: new ObjectId(userId._id),
  });
  res.json(entries);
  //res.json({
  //user: req.session.user,
  //});
});

app.post("/accounts/:id/transaction", async (req, res) => {
  const { id } = req.params;
  const { amount, action } = req.body;
  const account = await usersCollection.findOne({ _id: new ObjectId(id) });
  console.log(account);
  if (action === "deposit") {
    account.money += Number(amount);
  } else if (action === "withdraw") {
    if (account.money >= Number(amount)) {
      account.money -= Number(amount);
    } else {
      res.status(400).send("Insufficient funds.");
      return;
    }
  }
  await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { money: account.money } }
  );
  res.sendFile(__dirname + "/secrets.html");
});

// Middleware to check if the user is authenticated
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.sendFile(join(__dirname, "/public/login.html"));
  }
}

app.get("/secrets", requireLogin, (req, res) => {
  res.sendFile(join(__dirname, "secrets.html"));
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({
      loggedin: false,
    });
  });
});

app.listen(3000, function () {
  console.log(`Server is running on port 3000`);
});
