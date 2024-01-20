const { Schema, model, models, default: mongoose } = require("mongoose");

const CategoryScheme = new Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Types.ObjectId },
});

export const Category = models?.Category || model('Category', CategoryScheme);