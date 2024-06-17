//model
const Dog = require("../models/Dogs.model");

const path = require("path");
const fs = require("fs");

class DogController {
    constructor(req, res) {
        // Adicionando o this para referenciar as propriedades req e res dentro da classe
        this.req = req;
        this.res = res;
    }

    async postDog() {
        // Usando this.req para acessar o objeto req da requisição
        const {
            name,
            breed,
            color,
            gender,
            birthDate,
            age,
            selectedImageName,
            ownerName,
            feeding,
        } = this.req.body;

        // Pegue o caminho da imagem do multer
        const profileImage = this.req.file ? this.req.file.filename : null;

        // Validações
        if (!name) {
            return this.res.status(422).json({ msg: "O nome é obrigatório" });
        }
        if (!breed) {
            return this.res.status(422).json({ msg: "A raça é obrigatória" });
        }
        if (!color) {
            return this.res.status(422).json({ msg: "A cor é obrigatória" });
        }
        if (!gender) {
            return this.res.status(422).json({ msg: "O gênero é obrigatório" });
        }
        if (!birthDate) {
            return this.res
                .status(422)
                .json({ msg: "A data de nascimento é obrigatória" });
        }
        if (!age) {
            return this.res.status(422).json({ msg: "A idade é obrigatória" });
        }
        if (!selectedImageName) {
            return this.res.status(422).json({ msg: "A imagem é obrigatória" });
        }
        if (!ownerName) {
            return this.res
                .status(422)
                .json({ msg: "O proprietário é obrigatório" });
        }
        if (!profileImage) {
            return this.res.status(422).json({ msg: "A imagem é obrigatória" });
        }
        if (!feeding) {
            return this.res
                .status(422)
                .json({ msg: "A alimentação é obrigatória" });
        } else {
            const { foodType, feedingFrequency, serveSnack, snackName } =
                feeding;
            if (!foodType || !feedingFrequency || serveSnack === undefined) {
                return this.res.status(422).json({
                    msg: "Os detalhes da alimentação são obrigatórios",
                });
            }
            if (serveSnack && !snackName) {
                return this.res
                    .status(422)
                    .json({ msg: "O nome do lanche é obrigatório" });
            }
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
                feeding,
                profileImage,
            });

            this.res.status(201).json({
                msg: "Cachorro criado com sucesso",
                dog: {
                    ...dog.toObject(),
                    profileImage: `${this.req.protocol}://${this.req.get(
                        "host"
                    )}/uploads/${dog.profileImage}`,
                },
            });
        } catch (error) {
            console.log(error);
            this.res.status(500).json({ msg: "Aconteceu um erro no servidor" });
        }
    }

    async putDog() {
        // Usando this.req para acessar o objeto req da requisição
        const {
            name,
            breed,
            color,
            gender,
            birthDate,
            age,
            selectedImageName,
            ownerName,
            feeding,
        } = this.req.body;

        // Pegue o caminho da imagem do multer
        const profileImage = this.req.file ? this.req.file.filename : null;

        // Validações
        if (!name) {
            return this.res.status(422).json({ msg: "O nome é obrigatório" });
        }
        if (!breed) {
            return this.res.status(422).json({ msg: "A raça é obrigatória" });
        }
        if (!color) {
            return this.res.status(422).json({ msg: "A cor é obrigatória" });
        }
        if (!gender) {
            return this.res.status(422).json({ msg: "O gênero é obrigatório" });
        }
        if (!birthDate) {
            return this.res
                .status(422)
                .json({ msg: "A data de nascimento é obrigatória" });
        }
        if (!age) {
            return this.res.status(422).json({ msg: "A idade é obrigatória" });
        }
        if (!selectedImageName) {
            return this.res.status(422).json({ msg: "A imagem é obrigatória" });
        }
        if (!ownerName) {
            return this.res
                .status(422)
                .json({ msg: "O proprietário é obrigatório" });
        }
        if (!feeding) {
            return this.res
                .status(422)
                .json({ msg: "A alimentação é obrigatória" });
        } else {
            const { foodType, feedingFrequency, serveSnack, snackName } =
                feeding;
            if (!foodType || !feedingFrequency || serveSnack === undefined) {
                return this.res.status(422).json({
                    msg: "Os detalhes da alimentação são obrigatórios",
                });
            }
            if (serveSnack && !snackName) {
                return this.res
                    .status(422)
                    .json({ msg: "O nome do lanche é obrigatório" });
            }
        }

        try {
            const dog = await Dog.findById(this.req.params.id);
            if (!dog) {
                return this.res
                    .status(404)
                    .json({ msg: "Cachorro não encontrado" });
            }

            dog.name = name;
            dog.breed = breed;
            dog.color = color;
            dog.gender = gender;
            dog.birthDate = birthDate;
            dog.age = age;
            dog.selectedImageName = selectedImageName;
            dog.ownerName = ownerName;
            dog.feeding = feeding;

            if (profileImage) {
                // Exclua a imagem antiga se uma nova for enviada
                if (dog.profileImage) {
                    const oldImagePath = path.join(uploadDir, dog.profileImage);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                dog.profileImage = profileImage;
            }

            await dog.save();

            this.res.status(200).json({
                msg: "Cachorro atualizado com sucesso",
                dog: {
                    ...dog.toObject(),
                    profileImage: `${this.req.protocol}://${this.req.get(
                        "host"
                    )}/uploads/${dog.profileImage}`,
                },
            });
        } catch (error) {
            console.log(error);
            this.res.status(500).json({ msg: "Aconteceu um erro no servidor" });
        }
    }

    async getDogs() {
        try {
            const dogs = await Dog.find();

            // Convertendo o Buffer da imagem de perfil para URL base64
            const dogsWithProfileImages = dogs.map((dog) => {
                if (dog.profileImage && dog.profileImage.data) {
                    const profileImageBase64 = Buffer.from(
                        dog.profileImage.data
                    ).toString("base64");
                    return {
                        ...dog.toObject(),
                        profileImageUrl: `data:image/jpeg;base64,${profileImageBase64}`,
                    };
                } else {
                    return dog.toObject();
                }
            });

            this.res.status(200).json({ dogs: dogsWithProfileImages });
        } catch (error) {
            console.log(error);
            this.res.status(500).json({ msg: "Aconteceu um erro no servidor" });
        }
    }

    async getDog() {
        const { id } = this.req.params;

        try {
            const dog = await Dog.findById(id);
            if (!dog) {
                return this.res
                    .status(404)
                    .json({ message: "cachorro nao encontrado" });
            }

            this.res.status(200).json(dog);
        } catch (error) {
            console.log(error);
            this.res.status(500).json({ msg: "Aconteceu um erro no servidor" });
        }
    }

    async deleteDog() {
        const dogId = this.req.params.id;

        try {
            // Verifica se o cachorro existe
            const dog = await Dog.findById(dogId);
            if (!dog) {
                return this.res
                    .status(404)
                    .json({ msg: "Cachorro não encontrado" });
            }

            // Remove a imagem de perfil do servidor, se existir
            if (dog.profileImage) {
                const imagePath = path.join(
                    __dirname,
                    "..",
                    "uploads",
                    dog.profileImage.toString()
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Deleta o cachorro do banco de dados
            await Dog.findByIdAndDelete(dogId);

            this.res.status(200).json({ msg: "Cachorro deletado com sucesso" });
        } catch (error) {
            console.log(error);
            this.res.status(500).json({ msg: "Aconteceu um erro no servidor" });
        }
    }
}

module.exports = DogController;
