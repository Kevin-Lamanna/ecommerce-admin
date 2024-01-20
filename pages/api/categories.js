import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";

export default async function handle(req, res) {
    const { method } = req;
    // mongoose.connect(clientPromise.url);
    await mongooseConnect();

    if (method == 'GET') {
        res.json(await Category.find());
    }

    if (method == 'POST') {
        // we grab name and parentCategory from the request body
        const { name, parentCategory } = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory
        });
        res.json(categoryDoc);
    }

    // if (method == 'PUT') {
    //     res.json(await Category.find());
    // }

    // if (method == 'DELETE') {
    //     res.json(await Category.find());
    // }
}