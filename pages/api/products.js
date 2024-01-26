import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Handles HTTP requests associated with the MongoDB Database
export default async function handle(req, res) {
    // res.json(req.method);
    const { method } = req;
    // mongoose.connect(clientPromise.url);
    await mongooseConnect();
    await isAdminRequest(req, res);

    // Get from Database
    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        } else {
            res.json(await Product.find());
        }
    }

    // Create new product in Database
    if (method === 'POST') {
        // Grab the following values from the payload:
        const { title, description, price, images, category, properties } = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties,
        })
        res.json(productDoc);
    }

    // Update/Change the values of a product in the Database
    if (method === 'PUT') {
        const { title, description, price, images, category, properties, _id } = req.body;
        await Product.updateOne({ _id }, { title, description, price, images, category, properties });
        res.json(true);
    }

    // Delete from Database
    if (method === 'DELETE') {
        if (req.query?.id) {
            // Delete where _id === req.query?.id
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}