const mongoose = require("mongoose");

const DogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    color: { type: String, required: true },
    gender: { type: String, required: true },
    birthDate: { type: Date, required: true },
    age: { type: String, required: true },
    selectedImageName: { type: String, required: true },
    ownerName: { type: String, required: true },
    feeding: {
        foodType: { type: String, required: true },
        feedingFrequency: { type: String, required: true },
        serveSnack: { type: Boolean, required: true },
        snackName: { type: String, required: false },
    },
    profileImage: { type: Buffer, required: true },
});

// Adicione uma opção toJSON para personalizar a serialização dos documentos
DogSchema.set("toJSON", {
    transform: function (doc, ret) {
        if (ret.profileImage && ret.profileImage.data) {
            const profileImageBase64 = Buffer.from(
                ret.profileImage.data
            ).toString("base64");
            ret.profileImageUrl = `data:image/jpeg;base64,${profileImageBase64}`;
            delete ret.profileImage; // Remova o Buffer da imagem de perfil do objeto JSON
        }
    },
});

const Dog = mongoose.model("Dog", DogSchema);

module.exports = Dog;
