import Layout from "@/components/layout";

export default function Categories() {
    function saveCategory() {

    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>New category name</label>
            <form onSubmit={saveCategory} className="flex gap-2">
                <input className="mb-0" type="text" placeholder={'Category name'} />
                <button type="submit" className="btn-primary">Save</button>
            </form>
        </Layout>
    );
}