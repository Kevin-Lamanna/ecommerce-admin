import Layout from "@/components/layout";
import { useState } from "react";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    // This async function sends new product data to the endpoint /products
    // Most functions dealing with HTTP requests/responses are async
    async function createProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price };
        // we use axios to (HTTP) Post the data to the endpoint 
        await axios.post('/api/products', data);
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }
    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
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
        </Layout>
    );
}