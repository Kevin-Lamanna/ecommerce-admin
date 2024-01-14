const { Schema, model, models } = require("mongoose");

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
});

// 'product' must match the filename product.js, 
// (i.e., not 'Product', which maches the variable name)
export const Product = models.Product || model('Product', ProductSchema);