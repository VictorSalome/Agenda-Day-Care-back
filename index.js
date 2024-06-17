//imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./src/database/mongoose.database");

const AuthRouter = require("./src/routes/auth.Routes");

const RegisterDogRouter = require("./src/routes/registerDog.routes");

const ScheduleDogRoutes = require("./src/routes/scheduleDog.routes");

//Inicializando o express
const app = express();

// Conexão e configura com o banco de dados
connectToDatabase();

// faz o express entender o json
app.use(express.json());
app.use(cors());

// Rotas publicas
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Hello World!", welcome: "Welcome to my API" });
});

app.use("/auth", AuthRouter);

app.use("/register", RegisterDogRouter);

app.use("/schedule", ScheduleDogRoutes);

app.listen(process.env.DB_PORT, () => {
    console.log("Servidor iniciado na porta 3000");
});
