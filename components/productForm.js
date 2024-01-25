import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    // Function arguments in the form of an array
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
    // Function Body
}) {
    // Local State Variables
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    // We use useEffect to fetch an array of all of our categories 
    // from the /api/categories endpoint
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            // We set our categories array to the fetched data (array)
            setCategories(result.data);
        })
    }, []);
    // console.log({ _id });
    // This async function sends new product data to the endpoint /products
    // Most functions dealing with HTTP requests/responses are async
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title, description, price, images, category,
            properties: productProperties
        };
        if (_id) {
            //update
            await axios.put('/api/products', { ...data, _id });
        }
        else {
            //create
            // we use axios to (HTTP) Post the data to the endpoint 
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }
    async function uploadImages(ev) {
        // console.log(ev);
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            // const res = await axios.post('/api/upload', data, {
            //     headers: { 'Content-Type': 'multipart/form/data' },
            // });
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    function updateImagesOrder(images) {
        // console.log(arguments);
        // console.log(images);
        setImages(images);
    }
    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            <label>Category</label>
            {/* Sets the value to the selected target value from the list of options */}
            <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {/* Populate the select input with options from our categories array*/}
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {/* {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className="">
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                        <select value={productProperties[p.name]}
                            onChange={ev =>
                                setProductProp(p.name, ev.target.value)
                            }
                        >
                            {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))} */}
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                {/* React Sortable is used to Sort our images */}
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-2"
                    setList={updateImagesOrder}>
                    {/* double !! converts number to boolean */}
                    {!!images?.length && images.map(link => (
                        // Later, added functionality to zoom in on images
                        <div key={link} className="h-24">
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 p1 flex items-center">
                        {/* Uploading... */}
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 border cursor-pointer text-center flex flex-col items-center justify-center text-sm text-gray-600 rounded-md bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>

                    <div>
                        Upload
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            </div>
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