const express = require("express");
const router = express.Router();

//model
const Dog = require("../models/Dogs.model");

router.post("/dog", async (req, res) => {
    const {
        name,
        breed,
        color,
        gender,
        birthDate,
        age,
        selectedImageName,
        ownerName,
        feeding: { foodType, feedingFrequency, serveSnack, snackName = "" },
        profileImage,
    } = req.body;

    //validacoes
    if (!name) {
        return res.status(422).json({ msg: "O nome e obrigatorio" });
    }
    if (!breed) {
        return res.status(422).json({ msg: "A raca e obrigatorio" });
    }
    if (!color) {
        return res.status(422).json({ msg: "A cor e obrigatorio" });
    }
    if (!gender) {
        return res.status(422).json({ msg: "O genero e obrigatorio" });
    }
    if (!birthDate) {
        return res
            .status(422)
            .json({ msg: "A data de nascimento e obrigatorio" });
    }
    if (!age) {
        return res.status(422).json({ msg: "A idade e obrigatorio" });
    }
    if (!selectedImageName) {
        return res.status(422).json({ msg: "A imagem e obrigatorio" });
    }
    if (!ownerName) {
        return res.status(422).json({ msg: "O proprietario e obrigatorio" });
    }

    if (!profileImage) {
        return res.status(422).json({ msg: "A imagem e obrigatorio" });
    }

    if (!foodType || !feedingFrequency || !serveSnack) {
        return res.status(422).json({ msg: "A alimentação é obrigatorio" });
    }

    if (serveSnack && !snackName) {
        return res.status(422).json({ msg: "O nome do lanche e obrigatorio" });
    }

    try {
        const dog = await Dog.create({
            name,
            breed,
            color,
            gender,
            birthDate,
            age,
            selectedImageName,
            ownerName,
            feeding: {
                foodType,
                feedingFrequency,
                serveSnack,
                snackName,
            },
            profileImage,
        });
        res.status(201).json({ msg: "Cachorro criado com sucesso", dog });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor" });
    }
});

module.exports = router;
