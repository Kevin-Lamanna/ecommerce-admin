import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
    // Every Input needs a useState Hook to update the value
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    // Allows use to grab the data from the database
    // and then set the categories' (list) values to the grabbed data
    useEffect(() => {
        fetchCategories();
    }, []);
    // Fetches the category from the database
    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    // Saves the category
    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            // make a PUT request
            await axios.put('/api/categories', data);
            // Set the input back to null or ''
            setEditedCategory(null);
        } else {
            // await axios.post('/api/categories', {
            //     name, parentCategory
            // });
            // We simplified our code with the data variable
            await axios.post('/api/categories', data);
        }

        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    // edits the category
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            }))
        );
    }
    // Deletes the Category
    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }
    // Adds a property
    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        });
    }
    // Updates the Property's name
    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            // Make a copy of the prev Array
            const properties = [...prev];
            // Change the name
            properties[index].name = newName;
            // Return the Array
            return properties;
        });
    }
    // Updates the Property's value
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            // Make a copy of the prev Array
            const properties = [...prev];
            // Change the name
            properties[index].values = newValues;
            // Return the Array
            return properties;
        });
    }
    // Removes a Property
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory
                    ? `Edit category ${editedCategory.name}`
                    : 'Create new category'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder={'Category name'}
                        onChange={ev => setName(ev.target.value)}
                        value={name} />
                    <select
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block mb-2">Properties</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-default text-sm mb-2">
                        Add new property
                    </button>
                    {/* Lists All of our Properties on the Categories Page */}
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={property.name} className="flex gap-1 mb-2">
                            <input type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="property name (example: color)" />
                            <input type="text"
                                className="mb-0"
                                onChange={ev =>
                                    handlePropertyValuesChange(
                                        index,
                                        property, ev.target.value
                                    )}
                                value={property.values}
                                placeholder="values, comma separated" />
                            <button
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="btn-red">
                                Remove
                            </button>
                        </div>
                    ))}

                </div>
                <div className="flex gap-1">
                    {/* Cancel Button */}
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-default">Cancel</button>
                    )}
                    {/* Save Button */}
                    <button type="submit"
                        className="btn-primary py-1">
                        Save
                    </button>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button
                                        onClick={() => editCategory(category)}
                                        className="btn-default mr-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="btn-red">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));