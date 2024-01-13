import Layout from "@/components/layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    // console.log({ _id });
    // This async function sends new product data to the endpoint /products
    // Most functions dealing with HTTP requests/responses are async
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price };
        if (_id) {
            //update

            await axios.put('/api/products', { ...data, _id });
        }
        else {
            //create
            // we use axios to (HTTP) Post the data to the endpoint 
            await axios.post('/api/products', data);
            setGoToProducts(true);
        }

    }
    if (goToProducts) {
        router.push('/products');
    }
    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <label>Description</label>
            <textarea
                placeholder="desciption"
                value={description}
                onChange={ev => setDescription(ev.target.value)}></textarea>
            <label>Price (in USD)</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)} />
            <button
                type="submit"
                className="btn-primary">Save</button>
        </form>
    );
}