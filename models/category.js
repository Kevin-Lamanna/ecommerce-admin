const { Schema, model, models } = require("mongoose");

const CategoryScheme = new Schema({
    name: { type: String, required: true },
});

export const Category = models?.Category || model('Category', CategoryScheme);