const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const DogController = require("../controller/dog.controller");

// Verifica se o diretório de upload existe, se não, cria
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Diretório onde as imagens serão salvas
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo será a data atual com a extensão original
    },
});

const upload = multer({ storage: storage });

// Rota para cadastrar um novo cachorro
// Recebe um arquivo de imagem no campo "profileImage" e o salva no diretório de upload
// Em seguida, chama a função "postDog" do controller "DogController", passando o objeto "req" e "res"
router.post("/dog", upload.single("profileImage"), async (req, res) => {
    return new DogController(req, res).postDog();
});

// Rota para atualizar um cachorro existente
// Recebe um arquivo de imagem no campo "profileImage" e o salva no diretório de upload
// Em seguida, chama a função "putDog" do controller "DogController", passando o objeto "req" e "res"
router.put("/dog/:id", upload.single("profileImage"), async (req, res) => {
    return new DogController(req, res).putDog();
});

// Rota para buscar todos os cachorros
// Chama a função "getDogs" do controller "DogController", passando o objeto "req" e "res"
router.get("/dogs", async (req, res) => {
    return new DogController(req, res).getDogs();
});

//Rota para obter uma anotação específica por ID
router.get("/dog/:id", async (req, res) => {
    return new DogController(req, res).getDog();
});

// Rota para deletar um cachorro
// Chama a função "deleteDog" do controller "DogController", passando o objeto "req" e "res"
router.delete("/dog/:id", async (req, res) => {
    return new DogController(req, res).deleteDog();
});

module.exports = router;
