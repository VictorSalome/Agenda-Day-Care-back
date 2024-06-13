const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async postRegister() {
        const { name, email, password, confirmPassword } = this.req.body;
        //Validações

        if (!name) {
            return this.res.status(422).json({ msg: "O nome e obrigatorio" });
        }
        if (!email) {
            return this.res.status(422).json({ msg: "O email e obrigatorio" });
        }
        if (!password) {
            return this.res.status(422).json({ msg: "A senha e obrigatorio" });
        }
        if (password != confirmPassword) {
            return this.res.status(422).json({ msg: "As senhas nao conferem" });
        }

        // Verificar se o email ja existe
        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return this.res
                .status(422)
                .json({ msg: "Por favor escolha outro email" });
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
            this.res.status(201).json({ msg: "Usuario criado com sucesso" });
        } catch (error) {
            console.log(error);
            this.res.status(500).json({ msg: "Aconteceu um erro no servidor" });
        }
    }

    async postLogin() {
        const { email, password } = this.req.body;

        //validacoes
        if (!email) {
            return this.res.status(422).json({ msg: "O email e obrigatorio" });
        }
        if (!password) {
            return this.res.status(422).json({ msg: "A senha e obrigatorio" });
        }

        //Verificar se o usuario existe
        const user = await User.findOne({ email: email });

        if (!user) {
            return this.res.status(404).json({ msg: "Usuario nao encontrado" });
        }

        //Verificar se a senha confere
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return this.res.status(422).json({ msg: "Senha invalida" });
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
            this.res
                .status(200)
                .json({ msg: "Autenticado com sucesso", token: token });
        } catch (error) {
            console.log(error);
            this.res.status(500).json({
                msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
            });
        }
    }

    async getUsers() {
        const { id } = this.req.params;

        //Verificar se o usuario existe
        const user = await User.findById(id, "-password");

        if (!user) {
            return this.res.status(404).json({ msg: "Usuario não encontrado" });
        }
        this.res.status(200).json({ user });
    }
}

module.exports = AuthController;
