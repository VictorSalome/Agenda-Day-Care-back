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

router.post("/dog", upload.single("profileImage"), async (req, res) => {
    return new DogController(req, res).postDog();
});

router.put("/dog/:id", upload.single("profileImage"), async (req, res) => {
    return new DogController(req, res).putDog();
});

// Rota para buscar todos os cachorros
router.get("/dogs", async (req, res) => {
    return new DogController(req, res).getDogs();
});

// Rota para deletar um cachorro
router.delete("/dog/:id", async (req, res) => {
    return new DogController(req, res).deleteDog();
});

module.exports = router;
