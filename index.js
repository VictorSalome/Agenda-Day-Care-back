//imports
require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./src/database/mongoose.database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Inicializando o express
const app = express();

// Conexão e configura com o banco de dados
connectToDatabase();

// faz o express entender o json
app.use(express.json());

//models
const User = require("./src/models/User.model");

// Rotas publicas
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Hello World!", welcome: "Welcome to my API" });
});

// Rotas privadas
app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id;

    //Verificar se o usuario existe
    const user = await User.findById(id, "-password");

    if (!user) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
    }
    res.status(200).json({ user });
});

//verificar se o token existe
function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // validar o token
    if (!token) {
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Token invalido" });
    }
}

//Registrar usuario
app.post("/auth/register", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    //Validações

    if (!name) {
        return res.status(422).json({ msg: "O nome e obrigatorio" });
    }
    if (!email) {
        return res.status(422).json({ msg: "O email e obrigatorio" });
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha e obrigatorio" });
    }
    if (password != confirmPassword) {
        return res.status(422).json({ msg: "As senhas nao conferem" });
    }

    // Verificar se o email ja existe
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Por favor escolha outro email" });
    }

    //Criptografar a senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //criar o usuario
    const user = new User({
        name: name,
        email: email,
        password: passwordHash,
    });

    try {
        await user.save();
        res.status(201).json({ msg: "Usuario criado com sucesso" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor" });
    }
});

//login de usuario
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    //validacoes
    if (!email) {
        return res.status(422).json({ msg: "O email e obrigatorio" });
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha e obrigatorio" });
    }

    //Verificar se o usuario existe
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: "Usuario nao encontrado" });
    }

    //Verificar se a senha confere
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha invalida" });
    }

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                name: user.name,
                id: user._id,
            },
            secret
        );
        res.status(200).json({ msg: "Autenticado com sucesso", token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
        });
    }
});

app.listen(process.env.DB_PORT, () => {
    console.log("Servidor iniciado na porta 3000");
});
