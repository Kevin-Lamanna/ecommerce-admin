import Layout from "@/components/layout";
import axios from "axios";
import { useState } from "react";

export default function Categories() {
    // Every Input needs a useState Hook to update the value
    const [name, setName] = useState('');
    async function saveCategory(ev) {
        ev.preventDefault();
        await axios.post('/api/categories', { name });
        setName('');
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>New category name</label>
            <form onSubmit={saveCategory} className="flex gap-2">
                <input
                    className="mb-0"
                    type="text"
                    placeholder={'Category name'}
                    onChange={ev => setName(ev.target.value)}
                    value={name} />
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
        </Layout>
    );
}