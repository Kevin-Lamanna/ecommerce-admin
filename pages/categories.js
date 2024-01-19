import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
    // Every Input needs a useState Hook to update the value
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    // Allows use to grab the data from the database
    // and then set the categories' (list) values to the grabbed data
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }, []);
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
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category =>
                    (
                        <tr>
                            <td>{category.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}