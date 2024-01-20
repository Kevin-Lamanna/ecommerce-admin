import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
    // Every Input needs a useState Hook to update the value
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    // Allows use to grab the data from the database
    // and then set the categories' (list) values to the grabbed data
    useEffect(() => {
        fetchCategories();
    }, []);
    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev) {
        ev.preventDefault();
        await axios.post('/api/categories', { name, parentCategory });
        setName('');
        fetchCategories();
    }
    function editCategory(category) {

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
                <select className="mb-0"
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}>
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories.map(category =>
                    (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category =>
                    (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button
                                    onClick={() => editCategory(category)}
                                    className="btn-primary mr-1">Edit</button>
                                <button
                                    className="btn-primary">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}