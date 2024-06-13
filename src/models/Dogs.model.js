const mongoose = require("mongoose");

const Dog = mongoose.model("Dog", {
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



module.exports = Dog;
