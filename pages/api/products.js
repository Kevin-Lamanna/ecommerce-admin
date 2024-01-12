import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

export default async function handle(req, res) {
    // res.json(req.method);
    const { method } = req;
    // mongoose.connect(clientPromise.url);
    await mongooseConnect();

    if (method === 'GET') {
        res.json(await Product.find());
    }

    if (method === 'POST') {
        // Grab the following values from the payload:
        const { title, description, price } = req.body;
        const productDoc = await Product.create({
            title, description, price
        })
        res.json(productDoc);
    }
}