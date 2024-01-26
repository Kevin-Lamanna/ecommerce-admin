import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    // mongoose.connect(clientPromise.url);
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        // we grab name and parentCategory from the request body
        const { name, parentCategory, properties } = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties,
        });
        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        // we grab name and parentCategory from the request body
        const { name, parentCategory, properties, _id } = req.body;
        const categoryDoc = await Category.updateOne({ _id }, {
            name,
            parent: parentCategory || undefined,
            properties,
        });
        res.json(categoryDoc);
    }

    if (method === 'DELETE') {
        const { _id } = req.query;
        await Category.deleteOne({ _id });
        res.json('ok');
    }
}