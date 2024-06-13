//imports
require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./src/database/mongoose.database");

const AuthRouter = require("./src/routes/auth.Routes");

const RegisterDogRouter = require("./src/routes/registerDog.routes");

//Inicializando o express
const app = express();

// Conexão e configura com o banco de dados
connectToDatabase();

// faz o express entender o json
app.use(express.json());

// Rotas publicas
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Hello World!", welcome: "Welcome to my API" });
});

app.use("/auth", AuthRouter);

app.use("/register", RegisterDogRouter);

app.listen(process.env.DB_PORT, () => {
    console.log("Servidor iniciado na porta 3000");
});
