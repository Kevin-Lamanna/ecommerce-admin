import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductForm from "@/components/productForm";

// How does '/products/edit/' + product._id endpoint know how to render this page?
export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const { id } = router.query; // Equivalent to: const id = router.query.id;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
        });
    }, [id]);
    return (
        <Layout>
            <h1>Edit Product</h1>
            {/* We do this to make sure that the form
            only loads after the product informaton has loaded
            otherwise, we might get an empty form */}
            {productInfo && (
                <ProductForm {...productInfo} />
            )}
        </Layout>
    );
};