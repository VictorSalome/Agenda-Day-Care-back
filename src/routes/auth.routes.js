const express = require("express");
const router = express.Router();
const AuthController = require("../controller/auth.controller");

const checkToken = require("../middleware/tokenMiddleware");

//Registrar usuario
router.post("/register", async (req, res) => {
    return new AuthController(req, res).postRegister();
});

//login de usuario
router.post("/login", async (req, res) => {
    return new AuthController(req, res).postLogin();
});

// Rotas para puchar usuario com token privada
router.get("/user/:id", checkToken, async (req, res) => {
    return new AuthController(req, res).getUsers();
});

module.exports = router;
